import { app } from "@blockpool-io/core-container";
import { flags } from "@oclif/command";
import deepmerge from "deepmerge";
import { CommandFlags } from "../../types";
import { getCliConfig } from "../../utils";
import { BaseCommand } from "../command";

export class RunCommand extends BaseCommand {
    public static description: string = "Run the forger (without pm2)";

    public static examples: string[] = [
        `Run a forger with a bip39 passphrase
$ ark forger:run --bip39="..."
`,
        `Run a forger with an encrypted bip38
$ ark forger:run --bip38="..." --password="..."
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
        ...BaseCommand.flagsForger,
        env: flags.string({
            default: "production",
        }),
    };

    public async run(): Promise<void> {
        const { flags, paths } = await this.parseWithNetwork(RunCommand);

        await this.buildApplication(
            app,
            flags,
            deepmerge(getCliConfig(flags, paths), {
                include: [
                    "@blockpool-io/core-event-emitter",
                    "@blockpool-io/core-config",
                    "@blockpool-io/core-logger",
                    "@blockpool-io/core-logger-pino",
                    "@blockpool-io/core-forger",
                ],
                options: {
                    "@blockpool-io/core-forger": await this.buildBIP38(flags),
                },
            }),
        );
    }
}
