import { Container as container, EventEmitter, Logger } from "../interfaces";
import { createContainer, Resolver } from "awilix";
import { configManager } from "./config";
import { PluginRegistrar } from "./registrars/plugin";

export class Container implements container.IContainer {
    public options: Record<string, any>;
    public plugins: PluginRegistrar;
    public version: string;
    public shuttingDown: boolean;
    public isReady: boolean = false;
    public variables: Record<string, any>;
    public config: any;
    public nanoConfig: any;

    private name: string;
    private readonly container = createContainer();

    /**
     * Set up the app.
     * @param  {String} version
     * @return {void}
     */
    public async setUp(
        version: string,
        variables: Record<string, any>,
        options: Record<string, any> = {}
    ): Promise<void> {
        // Register any exit signal handling
        this.registerExitHandler(["SIGINT", "exit"]);

        // Set options and variables
        this.options = options;

        this.variables = variables;

        this.setVersion(version);

        // Setup the configuration
        this.config = await configManager.setUp(variables);

        // TODO: Move this out eventually - not really the responsibility of the container
        this.plugins = new PluginRegistrar(this, options);
        await this.plugins.setUp();

        this.isReady = true;
    }

    public getConfig() {
        return this.config;
    }

    public getNanoConfig() {
        return this.nanoConfig;
    }

    public async tearDown(): Promise<void> {
        /*
        if (!this.options.skipPlugins) {
            await this.plugins.tearDown();
        }
        */

        this.isReady = false;
    }

    public register<T>(name: string, resolver: Resolver<T>) {
        try {
            this.container.register(name, resolver);
            return this;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public resolve<T = any>(key: string): T {
        try {
            return this.container.resolve<T>(key);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public resolvePlugin<T = any>(key: string): T {
        try {
            return this.container.resolve<container.IPluginConfig<T>>(key).plugin;
        } catch (err) {
            return undefined;
        }
    }
    public resolveOptions(key) {
        return this.container.resolve<container.IPluginConfig<any>>(`pkg.${key}.opts`);
    }

    public has(key: string) {
        try {
            this.container.resolve(key);

            return true;
        } catch (err) {
            return false;
        }
    }

    public forceExit(message: string, error?: Error) {
        this.exit(1, message, error);
    }

    public exit(exitCode: number, message: string, error?: Error): void {
        this.shuttingDown = true;

        /*
        const logger = this.resolvePlugin<Logger.ILogger>("logger");
        logger.error(message);

        if (error) {
            logger.error(error.stack);
        }
        */

        process.exit(exitCode);
    }

    public getVersion(): string {
        return this.version;
    }

    public setVersion(version: string): void {
        this.version = version;
    }

    public getName(): string {
        return this.name;
    }

    private registerExitHandler(exitEvents: string[]): void {
        const handleExit = async () => {
            if (this.shuttingDown) {
                return;
            }

            this.shuttingDown = true;

            if (this.isReady) {
                /*
                const logger: Logger.ILogger = this.resolvePlugin<Logger.ILogger>("logger");
                if (logger) {
                    logger.suppressConsoleOutput(this.silentShutdown);
                    logger.info("Core is trying to gracefully shut down to avoid data corruption");
                }

                try {
                    // Notify plugins about shutdown
                    this.resolvePlugin<EventEmitter.EventEmitter>("event-emitter").emit("shutdown");

                    // Wait for event to be emitted and give time to finish
                    await delay(1000);
                } catch (error) {
                    // tslint:disable-next-line:no-console
                    console.error(error.stack);
                }

                await this.plugins.tearDown();
                */
            }

            process.exit();
        };

        // Handle exit events
        for (const eventType of exitEvents) {
            process.on(eventType as any, handleExit);
        }
    }
}