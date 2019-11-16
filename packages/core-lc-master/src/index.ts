import fs from "fs";
import { app } from "./container";
import { networks } from "./networks";

const version: string = "2.5.26";

let chain: string = "bpl";
let network: string  = "testnet";
if(process.argv.length == 3)
{
    const split = process.argv[2].split(":");
    chain = split[0];
    network = split[1];
}

app.setUp(
    version,
    networks[chain][network],
    {
        options: {
            "ark-state": {
                storage: {
                    maxLastBlocks: 100,
                }
            }
        }
    });
