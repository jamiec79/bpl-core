import { app } from "@blockpool-io/core-container";
import { State } from "@blockpool-io/core-interfaces";
import { Managers } from "@blockpool-io/crypto";

export const getMaxTransactionBytes = (): number => {
    const height = app
        .resolvePlugin<State.IStateService>("state")
        .getStore()
        .getLastHeight();
    const maxPayload = Managers.configManager.getMilestone(height).block.maxPayload;

    return maxPayload - 10 * 1024; // max block payload minus 10KB to have some margin for block header size
};
