module.exports = {
    cli: {
        core: {
            run: {
                plugins: {
                    include: ["@blockpool-io/core-magistrate-transactions"],
                },
            },
        },
        relay: {
            run: {
                plugins: {
                    include: ["@blockpool-io/core-magistrate-transactions"],
                },
            },
        },
        forger: {
            run: {
                plugins: {
                    include: ["@blockpool-io/core-magistrate-transactions"],
                },
            },
        },
        chain: {
            run: {
                plugins: {
                    include: ["@blockpool-io/core-magistrate-transactions"],
                },
            },
        },
        snapshot: {
            run: {
                plugins: {
                    include: ["@blockpool-io/core-magistrate-transactions"],
                },
            },
        },
    },
};
