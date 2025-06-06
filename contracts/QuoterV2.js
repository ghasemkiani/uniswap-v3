import {cutil} from "@ghasemkiani/base";
import {Contract} from "@ghasemkiani/evm";

import abi from "./abi/QuoterV2.json" with { type: "json" };

class QuoterV2 extends Contract {
  static {
    cutil.extend(this.prototype, {
      abi,
    });
  }

  async WETH9() {
    return await this.toCallRead("WETH9");
  }
  async factory() {
    return await this.toCallRead("factory");
  }
  async quoteExactInput(path, amountIn, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "quoteExactInput", path, amountIn);
  }
  async quoteExactInputSingle({tokenIn, tokenOut, amountIn, fee, sqrtPriceLimitX96}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "quoteExactInputSingle", [tokenIn, tokenOut, amountIn, fee, sqrtPriceLimitX96]);
  }
  async quoteExactOutput(path, amountOut, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "quoteExactOutput", path, amountOut);
  }
  async quoteExactOutputSingle({tokenIn, tokenOut, amount, fee, sqrtPriceLimitX96}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "quoteExactOutputSingle", [tokenIn, tokenOut, amount, fee, sqrtPriceLimitX96]);
  }
  async uniswapV3SwapCallback(amount0Delta, amount1Delta, path) {
    let [] = await this.toCallRead("uniswapV3SwapCallback", amount0Delta, amount1Delta, path);
    return {};
  }
}

export {QuoterV2};
