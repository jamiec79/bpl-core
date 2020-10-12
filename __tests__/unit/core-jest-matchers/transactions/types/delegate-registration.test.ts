import "../../../../../packages/core-jest-matchers/src/transactions/types/delegate-registration";

import { Enums } from "@blockpool-io/crypto";
const { TransactionType } = Enums;

describe(".toBeDelegateRegistrationType", () => {
    test("passes when given a delegate transaction", () => {
        expect({
            type: TransactionType.DelegateRegistration,
        }).toBeDelegateRegistrationType();
    });

    test("fails when given a non-delegate transaction", () => {
        expect(expect({ type: "invalid" }).toBeDelegateRegistrationType).toThrowError(
            "Expected value to be a valid DELEGATE transaction.",
        );
    });
});
