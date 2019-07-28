import "jest-extended";

import { Utils } from "@blockpool-io/crypto";
import { TransactionTypes } from "../../../../../../packages/crypto/src/enums";
import { feeManager } from "../../../../../../packages/crypto/src/managers/fee";
import { BuilderFactory } from "../../../../../../packages/crypto/src/transactions";
import { IPFSBuilder } from "../../../../../../packages/crypto/src/transactions/builders/transactions/ipfs";
import { transactionBuilder } from "./__shared__/transaction-builder";

let builder: IPFSBuilder;

beforeEach(() => {
    builder = BuilderFactory.ipfs();
});

describe("IPFS Transaction", () => {
    transactionBuilder(() => builder);

    it("should have its specific properties", () => {
        expect(builder).toHaveProperty("data.type", TransactionTypes.Ipfs);
        expect(builder).toHaveProperty("data.fee", feeManager.get(TransactionTypes.Ipfs));
        expect(builder).toHaveProperty("data.amount", Utils.BigNumber.make(0));
        expect(builder).toHaveProperty("data.asset", {});
    });

    it("establishes the IPFS asset", () => {
        builder.ipfsAsset("QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9w");
        expect(builder.data.asset.ipfs).toBe("QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9w");
    });
});
