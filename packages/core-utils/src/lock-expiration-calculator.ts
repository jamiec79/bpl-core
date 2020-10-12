import { app } from "@blockpool-io/core-container";
import { State } from "@blockpool-io/core-interfaces";
import { Enums, Interfaces } from "@blockpool-io/crypto";

export const calculateLockExpirationStatus = (expiration: Interfaces.IHtlcExpiration): boolean => {
    const lastBlock: Interfaces.IBlock = app
        .resolvePlugin<State.IStateService>("state")
        .getStore()
        .getLastBlock();

    return (
        (expiration.type === Enums.HtlcLockExpirationType.EpochTimestamp &&
            expiration.value <= lastBlock.data.timestamp) ||
        (expiration.type === Enums.HtlcLockExpirationType.BlockHeight && expiration.value <= lastBlock.data.height)
    );
};
