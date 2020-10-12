import { Handlers } from "@blockpool-io/core-transactions";
import { Managers } from "@blockpool-io/crypto";

export abstract class MagistrateTransactionHandler extends Handlers.TransactionHandler {
    public async isActivated(): Promise<boolean> {
        return Managers.configManager.getMilestone().aip11 === true;
    }
}
