import { app } from "@blockpool-io/core-container";
import { setUpContainer } from "../../../utils/helpers/container";

jest.setTimeout(60000);

export const setUp = async () => {
    try {
        return await setUpContainer({
            exit: "@blockpool-io/core-database-postgres",
            network: "unitnet",
        });
    } catch (error) {
        console.error(error.stack);
        return undefined;
    }
};

export const tearDown = async () => {
    await app.tearDown();
};
