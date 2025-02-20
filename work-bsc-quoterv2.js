import { cutil } from "@ghasemkiani/base";
import { Chain } from "@ghasemkiani/evm";

import { QuoterV2 } from "./contracts/QuoterV2.js";

Chain.set("bsc");

let address = "0x78D78E420Da98ad378D7799bE8f4AF69033EB077";
// let address = "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997";
let quoterv2 = new QuoterV2({address});
let result = await quoterv2.factory();
console.log(result);
