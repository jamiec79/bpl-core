import { app } from "@blockpool-io/core-container";
import { Managers } from "@blockpool-io/crypto";
import { plugin } from "../../../../packages/core-database-postgres/src/plugin";
import { plugin as pluginDatabase } from "../../../../packages/core-database/src/plugin";
import { registerWithContainer, setUpContainer } from "../../../utils/helpers/container";

jest.setTimeout(60000);

export const setUp = async () => {
    await setUpContainer({
        exit: "@blockpool-io/core-database-postgres",
        exclude: ["@blockpool-io/core-database-postgres"],
    });

    process.env.CORE_RESET_DATABASE = "1";

    Managers.configManager.getMilestone().aip11 = false;

    await registerWithContainer(pluginDatabase);

    await registerWithContainer(plugin, {
        connection: {
            host: "localhost",
            port: 5432,
            database: "bpl_unitnet",
            user: "bpl",
            password: "password",
        },
    });
};

export const tearDown = async () => {
    await app.tearDown();

    await plugin.deregister(app);
};
