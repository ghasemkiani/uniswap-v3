import {cutil} from "@ghasemkiani/base";
import {Contract} from "@ghasemkiani/evm";

import abi from "./abi/UniswapV3Factory.json" with { type: "json" };

class UniswapV3Factory extends Contract {
  static {
    cutil.extend(this.prototype, {
      abi,
    });
  }

  async createPool(tokenA, tokenB, fee, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "createPool", tokenA, tokenB, fee);
  }
  async enableFeeAmount(fee, tickSpacing, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "enableFeeAmount", fee, tickSpacing);
  }
  async feeAmountTickSpacing(nfhpoywy) {
    return await this.toCallRead("feeAmountTickSpacing", nfhpoywy);
  }
  async getPool(ckspqdej, xsgkswxl, egqyfvjo) {
    return await this.toCallRead("getPool", ckspqdej, xsgkswxl, egqyfvjo);
  }
  async owner() {
    return await this.toCallRead("owner");
  }
  async parameters() {
    let [factory, token0, token1, fee, tickSpacing] = await this.toCallRead("parameters");
    return {factory, token0, token1, fee, tickSpacing};
  }
  async setOwner(_owner, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "setOwner", _owner);
  }
}

export {UniswapV3Factory};
