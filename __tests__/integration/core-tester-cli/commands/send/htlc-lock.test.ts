import "jest-extended";

import { httpie } from "@blockpool-io/core-utils";
import { Enums, Managers } from "@blockpool-io/crypto";
import nock from "nock";
import { HtlcLockCommand } from "../../../../../packages/core-tester-cli/src/commands/send/htlc-lock";
import { htlcSecretHashHex } from "../../../../utils/fixtures";
import { bplToSatoshi, captureTransactions, toFlags } from "../../shared";
import { nodeStatusResponse } from "./fixtures";

beforeEach(() => {
    // Just passthru. We'll test the Command class logic in its own test file more thoroughly
    nock("http://localhost:4003")
        .get("/api/node/configuration")
        .thrice()
        .reply(200, { data: { constants: {} } });

    nock("http://localhost:4003")
        .get("/api/node/configuration/crypto")
        .thrice()
        .reply(200, { data: Managers.configManager.getPreset("unitnet") });

    nock("http://localhost:4003")
        .get("/api/node/status")
        .thrice()
        .reply(200, nodeStatusResponse);

    jest.spyOn(httpie, "get");
    jest.spyOn(httpie, "post");
});

afterEach(() => {
    nock.cleanAll();
    jest.restoreAllMocks();
});

describe("Commands - Htlc lock", () => {
    it("should apply htlc lock transactions", async () => {
        const opts = {
            number: 1,
            htlcLockFee: 0.2,
            amount: 12,
        };

        const expectedTransactions = [];
        captureTransactions(nock, expectedTransactions);

        await HtlcLockCommand.run(toFlags(opts));

        expect(httpie.post).toHaveBeenCalledTimes(2);

        expectedTransactions
            .filter(tx => tx.type === Enums.TransactionType.HtlcLock)
            .map(tx => {
                expect(tx.fee).toEqual(bplToSatoshi(opts.htlcLockFee));
                expect(tx.asset.lock.secretHash).toEqual(htlcSecretHashHex);
            });
    });

    it("should apply htlc lock transactions with default fee when none specified", async () => {
        const opts = {
            number: 1,
            amount: 12,
        };

        const expectedTransactions = [];
        captureTransactions(nock, expectedTransactions);

        await HtlcLockCommand.run(toFlags(opts));

        expect(httpie.post).toHaveBeenCalledTimes(2);

        expectedTransactions
            .filter(tx => tx.type === Enums.TransactionType.HtlcLock)
            .map(tx => {
                expect(tx.fee).toEqual(bplToSatoshi(0.1));
                expect(tx.asset.lock.secretHash).toEqual(htlcSecretHashHex);
            });
    });
});
