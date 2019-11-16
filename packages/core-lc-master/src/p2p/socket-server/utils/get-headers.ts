import { app } from "../../../container";
import { Blockchain } from "../../../interfaces";

export const getHeaders = () => {
    const headers = {
        version: app.getVersion(),
        port: app.resolveOptions("p2p").port,
        height: undefined,
    };

    if (app.has("blockchain")) {
        const lastBlock = app.resolvePlugin<Blockchain.IBlockchain>("blockchain").getLastBlock();

        if (lastBlock) {
            headers.height = lastBlock.data.height;
        }
    }

    return headers;
};
