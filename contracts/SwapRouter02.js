import {cutil} from "@ghasemkiani/base";
import {Contract} from "@ghasemkiani/evm";

import abi from "./abi/SwapRouter02.json" with { type: "json" };

class SwapRouter02 extends Contract {
  static {
    cutil.extend(this.prototype, {
      abi,
    });
  }

  async WETH9() {
    return await this.toCallRead("WETH9");
  }
  async approveMax(token, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "approveMax", token);
  }
  async approveMaxMinusOne(token, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "approveMaxMinusOne", token);
  }
  async approveZeroThenMax(token, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "approveZeroThenMax", token);
  }
  async approveZeroThenMaxMinusOne(token, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "approveZeroThenMaxMinusOne", token);
  }
  async callPositionManager(data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "callPositionManager", data);
  }
  async checkOracleSlippage(paths, amounts, maximumTickDivergence, secondsAgo) {
    let [] = await this.toCallRead("checkOracleSlippage", paths, amounts, maximumTickDivergence, secondsAgo);
    return {};
  }
  async checkOracleSlippage(path, maximumTickDivergence, secondsAgo) {
    let [] = await this.toCallRead("checkOracleSlippage", path, maximumTickDivergence, secondsAgo);
    return {};
  }
  async exactInput({path, recipient, amountIn, amountOutMinimum}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "exactInput", [path, recipient, amountIn, amountOutMinimum]);
  }
  async exactInputSingle({tokenIn, tokenOut, fee, recipient, amountIn, amountOutMinimum, sqrtPriceLimitX96}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "exactInputSingle", [tokenIn, tokenOut, fee, recipient, amountIn, amountOutMinimum, sqrtPriceLimitX96]);
  }
  async exactOutput({path, recipient, amountOut, amountInMaximum}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "exactOutput", [path, recipient, amountOut, amountInMaximum]);
  }
  async exactOutputSingle({tokenIn, tokenOut, fee, recipient, amountOut, amountInMaximum, sqrtPriceLimitX96}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "exactOutputSingle", [tokenIn, tokenOut, fee, recipient, amountOut, amountInMaximum, sqrtPriceLimitX96]);
  }
  async factory() {
    return await this.toCallRead("factory");
  }
  async factoryV2() {
    return await this.toCallRead("factoryV2");
  }
  async getApprovalType(token, amount, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "getApprovalType", token, amount);
  }
  async increaseLiquidity({token0, token1, tokenId, amount0Min, amount1Min}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "increaseLiquidity", [token0, token1, tokenId, amount0Min, amount1Min]);
  }
  async mint({token0, token1, fee, tickLower, tickUpper, amount0Min, amount1Min, recipient}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "mint", [token0, token1, fee, tickLower, tickUpper, amount0Min, amount1Min, recipient]);
  }
  async multicall(previousBlockhash, data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "multicall", previousBlockhash, data);
  }
  async multicall(deadline, data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "multicall", deadline, data);
  }
  async multicall(data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "multicall", data);
  }
  async positionManager() {
    return await this.toCallRead("positionManager");
  }
  async pull(token, value, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "pull", token, value);
  }
  async refundETH(__value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "refundETH");
  }
  async selfPermit(token, value, deadline, v, r, s, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "selfPermit", token, value, deadline, v, r, s);
  }
  async selfPermitAllowed(token, nonce, expiry, v, r, s, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "selfPermitAllowed", token, nonce, expiry, v, r, s);
  }
  async selfPermitAllowedIfNecessary(token, nonce, expiry, v, r, s, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "selfPermitAllowedIfNecessary", token, nonce, expiry, v, r, s);
  }
  async selfPermitIfNecessary(token, value, deadline, v, r, s, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "selfPermitIfNecessary", token, value, deadline, v, r, s);
  }
  async swapExactTokensForTokens(amountIn, amountOutMin, path, to, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "swapExactTokensForTokens", amountIn, amountOutMin, path, to);
  }
  async swapTokensForExactTokens(amountOut, amountInMax, path, to, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "swapTokensForExactTokens", amountOut, amountInMax, path, to);
  }
  async sweepToken(token, amountMinimum, recipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "sweepToken", token, amountMinimum, recipient);
  }
  async sweepToken(token, amountMinimum, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "sweepToken", token, amountMinimum);
  }
  async sweepTokenWithFee(token, amountMinimum, feeBips, feeRecipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "sweepTokenWithFee", token, amountMinimum, feeBips, feeRecipient);
  }
  async sweepTokenWithFee(token, amountMinimum, recipient, feeBips, feeRecipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "sweepTokenWithFee", token, amountMinimum, recipient, feeBips, feeRecipient);
  }
  async uniswapV3SwapCallback(amount0Delta, amount1Delta, _data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "uniswapV3SwapCallback", amount0Delta, amount1Delta, _data);
  }
  async unwrapWETH9(amountMinimum, recipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "unwrapWETH9", amountMinimum, recipient);
  }
  async unwrapWETH9(amountMinimum, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "unwrapWETH9", amountMinimum);
  }
  async unwrapWETH9WithFee(amountMinimum, recipient, feeBips, feeRecipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "unwrapWETH9WithFee", amountMinimum, recipient, feeBips, feeRecipient);
  }
  async unwrapWETH9WithFee(amountMinimum, feeBips, feeRecipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "unwrapWETH9WithFee", amountMinimum, feeBips, feeRecipient);
  }
  async wrapETH(value, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "wrapETH", value);
  }
}

export {SwapRouter02};
