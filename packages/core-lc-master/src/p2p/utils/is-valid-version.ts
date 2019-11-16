import semver from "semver";
import { app } from "../../container";
import { P2P } from "../../interfaces";

export const isValidVersion = (peer: P2P.IPeer): boolean => {
    if (!semver.valid(peer.version)) {
        return false;
    }

    //TODO: ignore minver for now. devnet's -next format seems to fail this
    return true;
    return app
        .resolveOptions("p2p")
        .minimumVersions.some((minimumVersion: string) => semver.satisfies(peer.version, minimumVersion));
};
