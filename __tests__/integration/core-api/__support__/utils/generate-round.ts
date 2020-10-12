import { Wallets } from "@blockpool-io/core-state";
import { Utils } from "@blockpool-io/crypto";
import { Identities } from "@blockpool-io/crypto/src";

export const generateRound = (delegates, round) => {
    return delegates.map(delegate =>
        Object.assign(new Wallets.Wallet(Identities.Address.fromPublicKey(delegate)), {
            attributes: {
                delegate: {
                    round,
                    voteBalance: Utils.BigNumber.make("245098000000000"),
                },
            },
            publicKey: delegate,
        }),
    );
};
