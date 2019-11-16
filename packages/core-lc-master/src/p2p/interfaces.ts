import { P2P } from "../interfaces";

export interface IPeerData {
    ip: string;
    ports: P2P.IPeerPorts;
    version: string;
}

export interface IPeerConfig {
    version: string;
    network: {
        version: string;
        name: string;
        nethash: string;
        explorer: string;
        token: {
            name: string;
            symbol: string;
        };
    };
    plugins: P2P.IPeerPlugins;
}

export interface IPeerPingResponse {
    state: P2P.IPeerState;
    config: IPeerConfig;
}