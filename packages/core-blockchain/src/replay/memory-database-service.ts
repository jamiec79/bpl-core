import { DatabaseService } from "@blockpool-io/core-database";
import { State } from "@blockpool-io/core-interfaces";
import { Interfaces } from "@blockpool-io/crypto";

export class MemoryDatabaseService extends DatabaseService {
    public constructor(public walletManager: State.IWalletManager) {
        super(undefined, undefined, undefined, undefined, undefined, undefined);
        this.blocksInCurrentRound = [];
    }

    public async saveBlocks(blocks: Interfaces.IBlock[]): Promise<void> {
        return;
    }

    public async saveRound(activeDelegates: State.IWallet[]): Promise<void> {
        this.logger.info(`Saving round ${activeDelegates[0].getAttribute("delegate.round").toLocaleString()}`);
    }

    public async deleteRound(round: number): Promise<void> {
        return;
    }

    public async getForgedTransactionsIds(ids: string[]): Promise<any[]> {
        return [];
    }

    public async getBlock(id: string): Promise<Interfaces.IBlock> {
        return undefined;
    }
}
