import { app } from "@blockpool-io/core-container";
import { Container } from "@blockpool-io/core-interfaces";
import deepmerge from "deepmerge";
import envPaths from "env-paths";
import { getCliConfig } from "../utils";

// tslint:disable-next-line:no-var-requires
const { version } = require("../../package.json");

export const setUpLite = async (options, paths: envPaths.Paths): Promise<Container.IContainer> => {
    await app.setUp(
        version,
        options,
        deepmerge(getCliConfig(options, paths), {
            options: {
                "@blockpool-io/core-blockchain": { replay: true },
            },
            include: [
                "@blockpool-io/core-event-emitter",
                "@blockpool-io/core-logger-pino",
                "@blockpool-io/core-state",
                "@blockpool-io/core-database-postgres",
                "@blockpool-io/core-blockchain",
            ],
        }),
    );

    return app;
};
