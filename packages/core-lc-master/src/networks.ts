export const networks = {
    bpl: {
        mainnet: {
            chain: "bpl",
            network: "mainnet",
            plugins: {
                "@blockpool-io/core-p2p": 9030,
                "@blockpool-io/core-api": 9031
            }
        },
        testnet: {
            chain: "bpl",
            network: "testnet",
            plugins: {
                "@blockpool-io/core-p2p": 19030,
                "@blockpool-io/core-api": 19031
            }
        }
    }
};
