// tslint:disable:max-classes-per-file
// tslint:disable:member-ordering

import { Database, EventEmitter, State, TransactionPool } from "@arkecosystem/core-interfaces";
import { Enums, Interfaces, Managers, Transactions } from "@arkecosystem/crypto";
import {
    InsufficientBalanceError,
    InvalidMultiSignatureError,
    InvalidSecondSignatureError,
    SenderWalletMismatchError,
    UnexpectedMultiSignatureError,
    UnexpectedNonceError,
    UnexpectedSecondSignatureError,
} from "../errors";
import { ITransactionHandler } from "../interfaces";

export abstract class TransactionHandler implements ITransactionHandler {
    public abstract getConstructor(): Transactions.TransactionConstructor;

    /**
     * Wallet logic
     */
    public abstract async bootstrap(
        connection: Database.IConnection,
        walletManager: State.IWalletManager,
    ): Promise<void>;

    public verify(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): boolean {
        const senderWallet: State.IWallet = walletManager.findByPublicKey(transaction.data.senderPublicKey);

        if (senderWallet.hasMultiSignature()) {
            transaction.isVerified = senderWallet.verifySignatures(transaction.data);
        }

        return transaction.isVerified;
    }

    public canBeApplied(
        transaction: Interfaces.ITransaction,
        wallet: State.IWallet,
        databaseWalletManager: State.IWalletManager,
    ): boolean {
        const { data }: Interfaces.ITransaction = transaction;

        if (data.version > 1 && !data.nonce.isEqualTo(wallet.nonce.plus(1))) {
            throw new UnexpectedNonceError(data.nonce, wallet.nonce.plus(1));
        }

        if (
            wallet.balance
                .minus(data.amount)
                .minus(data.fee)
                .isLessThan(0)
        ) {
            throw new InsufficientBalanceError();
        }

        if (data.senderPublicKey !== wallet.publicKey) {
            throw new SenderWalletMismatchError();
        }

        if (wallet.hasSecondSignature()) {
            // Ensure the database wallet already has a 2nd signature, in case we checked a pool wallet.
            const databaseWallet: State.IWallet = databaseWalletManager.findByPublicKey(
                transaction.data.senderPublicKey,
            );

            if (!databaseWallet.hasSecondSignature()) {
                throw new UnexpectedSecondSignatureError();
            }

            const secondPublicKey: string = wallet.getExtraAttribute("secondPublicKey");
            if (!Transactions.Verifier.verifySecondSignature(data, secondPublicKey)) {
                throw new InvalidSecondSignatureError();
            }
        } else if (data.secondSignature || data.signSignature) {
            const isException =
                Managers.configManager.get("network.name") === "devnet" &&
                Managers.configManager.getMilestone().ignoreInvalidSecondSignatureField;
            if (!isException) {
                throw new UnexpectedSecondSignatureError();
            }
        }

        if (wallet.hasMultiSignature()) {
            // Ensure the database wallet already has a multi signature, in case we checked a pool wallet.
            const databaseWallet: State.IWallet = databaseWalletManager.findByPublicKey(
                transaction.data.senderPublicKey,
            );

            if (!databaseWallet.hasMultiSignature()) {
                throw new UnexpectedMultiSignatureError();
            }
            if (!wallet.verifySignatures(data, wallet.getExtraAttribute("multiSignature"))) {
                throw new InvalidMultiSignatureError();
            }
        } else if (transaction.type !== Enums.TransactionTypes.MultiSignature && transaction.data.signatures) {
            throw new UnexpectedMultiSignatureError();
        }

        return true;
    }

    public apply(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
        this.applyToSender(transaction, walletManager);
        this.applyToRecipient(transaction, walletManager);
    }

    public revert(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
        this.revertForSender(transaction, walletManager);
        this.revertForRecipient(transaction, walletManager);
    }

    protected applyToSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
        const sender: State.IWallet = walletManager.findByPublicKey(transaction.data.senderPublicKey);
        sender.balance = sender.balance.minus(transaction.data.amount).minus(transaction.data.fee);
        sender.incrementNonce();
    }

    protected revertForSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
        const sender: State.IWallet = walletManager.findByPublicKey(transaction.data.senderPublicKey);
        sender.balance = sender.balance.plus(transaction.data.amount).plus(transaction.data.fee);
        sender.decrementNonce();
    }

    protected abstract applyToRecipient(
        transaction: Interfaces.ITransaction,
        walletManager: State.IWalletManager,
    ): void;
    protected abstract revertForRecipient(
        transaction: Interfaces.ITransaction,
        walletManager: State.IWalletManager,
    ): void;

    /**
     * Database Service
     */
    // tslint:disable-next-line:no-empty
    public emitEvents(transaction: Interfaces.ITransaction, emitter: EventEmitter.EventEmitter): void {}

    /**
     * Transaction Pool logic
     */
    public canEnterTransactionPool(
        data: Interfaces.ITransactionData,
        pool: TransactionPool.IConnection,
        processor: TransactionPool.IProcessor,
    ): boolean {
        processor.pushError(
            data,
            "ERR_UNSUPPORTED",
            `Invalidating transaction of unsupported type '${Enums.TransactionTypes[data.type]}'`,
        );

        return false;
    }

    public applyToSenderInPool(transaction: Interfaces.ITransaction, poolWalletManager: State.IWalletManager): void {
        // TOOD: this is working around the fact that the tx pool needs to increment the nonce
        // before applying it, but it's not exactly the best solution.
        poolWalletManager.findByPublicKey(transaction.data.senderPublicKey).decrementNonce();
        this.applyToSender(transaction, poolWalletManager);
    }

    public revertForSenderInPool(transaction: Interfaces.ITransaction, poolWalletManager: State.IWalletManager): void {
        this.revertForSender(transaction, poolWalletManager);
    }

    public applyToRecipientInPool(transaction: Interfaces.ITransaction, poolWalletManager: State.IWalletManager): void {
        this.applyToRecipient(transaction, poolWalletManager);
    }

    public revertForRecipientInPool(
        transaction: Interfaces.ITransaction,
        poolWalletManager: State.IWalletManager,
    ): void {
        this.revertForRecipient(transaction, poolWalletManager);
    }

    protected typeFromSenderAlreadyInPool(
        data: Interfaces.ITransactionData,
        pool: TransactionPool.IConnection,
        processor: TransactionPool.IProcessor,
    ): boolean {
        const { senderPublicKey, type }: Interfaces.ITransactionData = data;

        if (pool.senderHasTransactionsOfType(senderPublicKey, type)) {
            processor.pushError(
                data,
                "ERR_PENDING",
                `Sender ${senderPublicKey} already has a transaction of type '${
                    Enums.TransactionTypes[type]
                }' in the pool`,
            );

            return true;
        }

        return false;
    }
}
