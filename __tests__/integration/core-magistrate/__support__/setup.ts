import { app } from "@blockpool-io/core-container";
import { asValue } from "awilix";
import { defaults as defaultsBlockchain } from "../../../../packages/core-blockchain/src/defaults";
import { defaults as defaultsPool } from "../../../../packages/core-transaction-pool/src/defaults";
import { registerWithContainer, setUpContainer } from "../../../utils/helpers/container";
import { transactionPoolConfig } from "../fixtures/transaction-pool";
jest.setTimeout(60000);

export const setUp = async () => {
    try {
        return await setUpContainer({
            exit: "@blockpool-io/core-blockchain",
            exclude: ["@blockpool-io/core-transaction-pool"],
            network: "unitnet",
        });
    } catch (error) {
        console.error(error.stack);
        return undefined;
    }
};

export const setUpFull = async () => {
    process.env.CORE_RESET_DATABASE = "1";

    try {
        await setUpContainer({
            exit: "@blockpool-io/core-transaction-pool",
            exclude: ["@blockpool-io/core-transaction-pool"],
            network: "unitnet",
        });

        app.register("pkg.transaction-pool.opts", asValue(defaultsPool));

        await registerWithContainer(
            require("../../../../packages/core-transaction-pool/src/plugin").plugin,
            transactionPoolConfig,
        );

        app.register("pkg.blockchain.opts", asValue(defaultsBlockchain));

        await registerWithContainer(require("@blockpool-io/core-blockchain").plugin, {});

        return app;
    } catch (error) {
        console.error(error.stack);
        return undefined;
    }
};

export const tearDown = async () => {
    await app.tearDown();
};

export const tearDownFull = async () => {
    await require("../../../../packages/core-transaction-pool/src/plugin").plugin.deregister(
        app,
        transactionPoolConfig,
    );
    await require("@blockpool-io/core-blockchain").plugin.deregister(app, {});

    await app.tearDown();
};
