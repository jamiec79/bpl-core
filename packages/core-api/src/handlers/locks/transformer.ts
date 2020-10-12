import { formatTimestamp } from "@blockpool-io/core-utils";
import { Interfaces } from "@blockpool-io/crypto";

export const transformLock = (lock: Interfaces.IHtlcLock) => {
    return {
        ...lock,
        amount: lock.amount.toFixed(),
        timestamp: formatTimestamp(lock.timestamp),
    };
};
