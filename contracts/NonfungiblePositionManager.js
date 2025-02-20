import {cutil} from "@ghasemkiani/base";
import {Contract} from "@ghasemkiani/evm";

import abi from "./abi/NonfungiblePositionManager.json" with { type: "json" };

class NonfungiblePositionManager extends Contract {
  static {
    cutil.extend(this.prototype, {
      abi,
    });
  }

  async DOMAIN_SEPARATOR() {
    return await this.toCallRead("DOMAIN_SEPARATOR");
  }
  async PERMIT_TYPEHASH() {
    return await this.toCallRead("PERMIT_TYPEHASH");
  }
  async WETH9() {
    return await this.toCallRead("WETH9");
  }
  async approve(to, tokenId, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "approve", to, tokenId);
  }
  async balanceOf(owner) {
    return await this.toCallRead("balanceOf", owner);
  }
  async baseURI() {
    return await this.toCallRead("baseURI");
  }
  async burn(tokenId, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "burn", tokenId);
  }
  async collect({tokenId, recipient, amount0Max, amount1Max}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "collect", [tokenId, recipient, amount0Max, amount1Max]);
  }
  async createAndInitializePoolIfNecessary(token0, token1, fee, sqrtPriceX96, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "createAndInitializePoolIfNecessary", token0, token1, fee, sqrtPriceX96);
  }
  async decreaseLiquidity({tokenId, liquidity, amount0Min, amount1Min, deadline}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "decreaseLiquidity", [tokenId, liquidity, amount0Min, amount1Min, deadline]);
  }
  async factory() {
    return await this.toCallRead("factory");
  }
  async getApproved(tokenId) {
    return await this.toCallRead("getApproved", tokenId);
  }
  async increaseLiquidity({tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "increaseLiquidity", [tokenId, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline]);
  }
  async isApprovedForAll(owner, operator) {
    return await this.toCallRead("isApprovedForAll", owner, operator);
  }
  async mint({token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline}, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "mint", [token0, token1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline]);
  }
  async multicall(data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "multicall", data);
  }
  async name() {
    return await this.toCallRead("name");
  }
  async ownerOf(tokenId) {
    return await this.toCallRead("ownerOf", tokenId);
  }
  async permit(spender, tokenId, deadline, v, r, s, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "permit", spender, tokenId, deadline, v, r, s);
  }
  async positions(tokenId) {
    let [nonce, operator, token0, token1, fee, tickLower, tickUpper, liquidity, feeGrowthInside0LastX128, feeGrowthInside1LastX128, tokensOwed0, tokensOwed1] = await this.toCallRead("positions", tokenId);
    return {nonce, operator, token0, token1, fee, tickLower, tickUpper, liquidity, feeGrowthInside0LastX128, feeGrowthInside1LastX128, tokensOwed0, tokensOwed1};
  }
  async refundETH(__value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "refundETH");
  }
  async safeTransferFrom(from, to, tokenId, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "safeTransferFrom", from, to, tokenId);
  }
  async safeTransferFrom(from, to, tokenId, _data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "safeTransferFrom", from, to, tokenId, _data);
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
  async setApprovalForAll(operator, approved, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "setApprovalForAll", operator, approved);
  }
  async supportsInterface(interfaceId) {
    return await this.toCallRead("supportsInterface", interfaceId);
  }
  async sweepToken(token, amountMinimum, recipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "sweepToken", token, amountMinimum, recipient);
  }
  async symbol() {
    return await this.toCallRead("symbol");
  }
  async tokenByIndex(index) {
    return await this.toCallRead("tokenByIndex", index);
  }
  async tokenOfOwnerByIndex(owner, index) {
    return await this.toCallRead("tokenOfOwnerByIndex", owner, index);
  }
  async tokenURI(tokenId) {
    return await this.toCallRead("tokenURI", tokenId);
  }
  async totalSupply() {
    return await this.toCallRead("totalSupply");
  }
  async transferFrom(from, to, tokenId, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "transferFrom", from, to, tokenId);
  }
  async uniswapV3MintCallback(amount0Owed, amount1Owed, data, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "uniswapV3MintCallback", amount0Owed, amount1Owed, data);
  }
  async unwrapWETH9(amountMinimum, recipient, __value__ = 0) {
    return await this.toCallWriteWithValue(__value__, "unwrapWETH9", amountMinimum, recipient);
  }
}

export {NonfungiblePositionManager};
