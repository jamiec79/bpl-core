import { app } from "../../../container";
import { Logger } from "../../../interfaces";
import { Interfaces } from "@blockpool-io/crypto";
import { Blockchain } from "../../blockchain";
import { BlockProcessorResult } from "../block-processor";

export abstract class BlockHandler {
    protected readonly logger: Logger.ILogger = app.resolvePlugin<Logger.ILogger>("logger");

    public constructor(protected readonly blockchain: Blockchain, protected readonly block: Interfaces.IBlock) {}

    public async execute(): Promise<BlockProcessorResult> {
        this.blockchain.resetLastDownloadedBlock();

        return BlockProcessorResult.Rejected;
    }
}
