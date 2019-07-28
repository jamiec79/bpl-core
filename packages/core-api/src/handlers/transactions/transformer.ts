import { app } from "@blockpool-io/core-container";
import { Blockchain, Database } from "@blockpool-io/core-interfaces";
import { formatTimestamp } from "@blockpool-io/core-utils";
import { Interfaces, Transactions } from "@blockpool-io/crypto";

export const transformTransaction = (model, transform) => {
    const blockchain = app.resolvePlugin<Blockchain.IBlockchain>("blockchain");
    const databaseService = app.resolvePlugin<Database.IDatabaseService>("database");

    const transaction: Interfaces.ITransaction = Transactions.TransactionFactory.fromBytesUnsafe(
        model.serialized,
        model.id,
    );

    if (!transform) {
        return transaction.toJson();
    }

    const { data } = transaction;

    const sender: string = databaseService.walletManager.findByPublicKey(data.senderPublicKey).address;

    const lastBlock: Interfaces.IBlock = blockchain.getLastBlock();

    return {
        id: data.id,
        blockId: model.blockId,
        version: data.version,
        type: data.type,
        amount: data.amount.toFixed(),
        fee: data.fee.toFixed(),
        sender,
        senderPublicKey: data.senderPublicKey,
        recipient: data.recipientId || sender,
        signature: data.signature,
        signSignature: data.signSignature || data.secondSignature,
        signatures: data.signatures,
        vendorField: data.vendorField,
        asset: data.asset,
        confirmations: model.block ? lastBlock.data.height - model.block.height + 1 : 0,
        timestamp: formatTimestamp(data.timestamp),
    };
};
