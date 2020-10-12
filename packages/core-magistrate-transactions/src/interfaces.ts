import { Interfaces } from "@blockpool-io/core-magistrate-crypto";

export interface IBusinessWalletAttributes {
    businessAsset: Interfaces.IBusinessRegistrationAsset;
    resigned?: boolean;
    bridgechains?: Record<string, IBridgechainWalletAttributes>;
}

export interface IBridgechainWalletAttributes {
    bridgechainAsset: Interfaces.IBridgechainRegistrationAsset;
    resigned?: boolean;
}
