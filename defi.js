import { cutil } from "@ghasemkiani/base";
import { Obj } from "@ghasemkiani/base";
import { d } from "@ghasemkiani/decimal";
import { chainer } from "@ghasemkiani/evm";

import abiPool from "./abi/pool.json" with { type: "json" };

class Pool extends Obj {
  static {
    cutil.extend(this.prototype, {
      defi: null,
      _tokenIdA: null,
      _tokenIdB: null,
      _tokenId0: null,
      _tokenId1: null,
      _tokenA: null,
      _tokenB: null,
      _token0: null,
      _token1: null,
      address: null,
      _contract: null,
      _price_$: null,
      // immutables
      addressFactory: null,
      addressToken0: null,
      addressToken1: null,
      fee: null,
      tickSpacing: null,
      maxLiquidityPerTick: null,
      // state
      feeGrowthGlobal0X128: null,
      feeGrowthGlobal1X128: null,
      liquidity: null,
      slot0: null,
      sqrtPriceX96: null,
      tick: null,
      observationIndex: null,
      observationCardinality: null,
      observationCardinalityNext: null,
      feeProtocol: null,
      unlocked: null,
    });
  }
  get contract() {
    let pool = this;
    if (cutil.na(pool._contract) && cutil.a(pool.address)) {
      let { address } = pool;
      let { defi } = pool;
      let { account } = defi;
      pool._contract = defi.contract({ address, account });
    }
    return pool._contract;
  }
  set contract(contract) {
    let pool = this;
    pool._contract = contract;
  }
  get tokenIdA() {
    let pool = this;
    let { defi } = pool;
    if (cutil.na(pool._tokenIdA)) {
      if (cutil.a(pool._tokenId0)) {
        pool._tokenIdA = pool.tokenId0;
      } else if (cutil.a(pool._tokenA)) {
        pool._tokenIdA = pool.tokenA.id;
      } else if (cutil.a(pool._token0)) {
        pool._tokenIdA = pool.token0.id;
      }
    }
    return pool._tokenIdA;
  }
  set tokenIdA(tokenIdA) {
    let pool = this;
    pool._tokenIdA = tokenIdA;
  }
  get tokenIdB() {
    let pool = this;
    let { defi } = pool;
    if (cutil.na(pool._tokenIdB)) {
      if (cutil.a(pool._tokenId1)) {
        pool._tokenIdB = pool.tokenId1;
      } else if (cutil.a(pool._tokenB)) {
        pool._tokenIdB = pool.tokenB.id;
      } else if (cutil.a(pool._token1)) {
        pool._tokenIdB = pool.token1.id;
      }
    }
    return pool._tokenIdB;
  }
  set tokenIdB(tokenIdB) {
    let pool = this;
    pool._tokenIdB = tokenIdB;
  }
  get tokenId0() {
    let pool = this;
    let { defi } = pool;
    if (cutil.na(pool._tokenId0)) {
      if (cutil.a(pool._tokenIdA) && cutil.a(pool._tokenIdB)) {
        let { tokenIdA, tokenIdB } = pool;
        let { tokenId0, tokenId1 } = defi.sort({ tokenIdA, tokenIdB });
        cutil.assign(pool, { tokenId0, tokenId1 });
      } else if (cutil.a(pool._token0)) {
        pool._tokenIdA = pool.token0.id;
      } else if (cutil.a(pool._tokenA)) {
        pool._tokenIdA = pool.tokenA.id;
      }
    }
    return pool._tokenId0;
  }
  set tokenId0(tokenId0) {
    let pool = this;
    pool._tokenId0 = tokenId0;
  }
  get tokenId1() {
    let pool = this;
    let { defi } = pool;
    if (cutil.na(pool._tokenId1)) {
      if (cutil.a(pool._tokenIdA) && cutil.a(pool._tokenIdB)) {
        let { tokenIdA, tokenIdB } = pool;
        let { tokenId0, tokenId1 } = defi.sort({ tokenIdA, tokenIdB });
        cutil.assign(pool, { tokenId0, tokenId1 });
      } else if (cutil.a(pool._token1)) {
        pool._tokenIdB = pool.token1.id;
      } else if (cutil.a(pool._tokenB)) {
        pool._tokenIdB = pool.tokenB.id;
      }
    }
    return pool._tokenId1;
  }
  set tokenId1(tokenId1) {
    let pool = this;
    pool._tokenId1 = tokenId1;
  }
  get forward() {
    let pool = this;
    let { defi } = pool;
    let { chain } = defi;
    let { tokenIdA, tokenId0 } = pool;
    let forward = chain.eq(
      chain.tokenAddress(tokenIdA),
      chain.tokenAddress(tokenId0),
    );
    return forward;
  }
  get tokenA() {
    let pool = this;
    if (cutil.na(pool.tokenA_) && cutil.a(pool.tokenIdA)) {
      let { defi } = pool;
      let { account } = defi;
      let { chain } = defi;
      pool.tokenA_ = defi.tkn({ id: pool.tokenIdA, account });
      if (pool.forward) {
        pool.token0 = pool.tokenA_;
      } else {
        pool.token1 = pool.tokenA_;
      }
    }
    return pool.tokenA_;
  }
  set tokenA(tokenA) {
    let pool = this;
    pool.tokenA_ = tokenA;
  }
  get tokenB() {
    let pool = this;
    if (cutil.na(pool.tokenB_) && cutil.a(pool.tokenIdB)) {
      let { defi } = pool;
      let { account } = defi;
      let { chain } = defi;
      pool.tokenB_ = defi.tkn({ id: pool.tokenIdB, account });
      if (pool.forward) {
        pool.token1 = pool.tokenB_;
      } else {
        pool.token0 = pool.tokenB_;
      }
    }
    return pool.tokenB_;
  }
  set tokenB(tokenB) {
    let pool = this;
    pool.tokenB_ = tokenB;
  }
  get token0() {
    let pool = this;
    if (cutil.na(pool.token0_) && cutil.a(pool.tokenId0)) {
      let { defi } = pool;
      let { account } = defi;
      let { chain } = defi;
      pool.token0_ = defi.tkn({ id: pool.tokenId0, account });
      if (pool.forward) {
        pool.tokenA = pool.token0_;
      } else {
        pool.tokenB = pool.token0_;
      }
    }
    return pool.token0_;
  }
  set token0(token0) {
    let pool = this;
    pool.token0_ = token0;
  }
  get token1() {
    let pool = this;
    if (cutil.na(pool.token1_) && cutil.a(pool.tokenId1)) {
      let { defi } = pool;
      let { account } = defi;
      let { chain } = defi;
      pool.token1_ = defi.tkn({ id: pool.tokenId1, account });
      if (pool.forward) {
        pool.tokenB = pool.token1_;
      } else {
        pool.tokenA = pool.token1_;
      }
    }
    return pool.token1_;
  }
  set token1(token1) {
    let pool = this;
    pool.token1_ = token1;
  }
  get feeRate() {
    return cutil.na(this.fee) ? null : this.defi.feeToRate(this.fee);
  }
  set feeRate(feeRate) {
    this.fee = cutil.na(feeRate) ? null : this.defi.rateToFee(feeRate);
  }
  get symbol() {
    let { tokenId0, tokenId1, feeRate } = this;
    return [tokenId0, tokenId1, feeRate].find((x) => cutil.na(x))
      ? null
      : `${tokenId0}/${tokenId1}@${cutil.asString(feeRate)}`;
  }
  set symbol(symbol) {
    let pool = this;
    console.log({ symbol });
    let { defi } = pool;
    if (cutil.na(symbol)) {
      pool.tokenIdA = null;
      pool.tokenIdB = null;
      pool.tokenId0 = null;
      pool.tokenId1 = null;
      pool.feeRate = null;
    } else {
      let [, tokenIdA, tokenIdB, feeRate] = /^(.*)\/(.*)@(.*)$/.exec(symbol);
      let { tokenId0, tokenId1 } = defi.sort({ tokenIdA, tokenIdB });
      cutil.assign(pool, { tokenIdA, tokenIdB, tokenId0, tokenId1, feeRate });
    }
  }
  getNearestTick(tick) {
    let { tickSpacing } = this;
    return d(tick).div(tickSpacing).round().mul(tickSpacing).toFixed(0);
  }
  get price_$() {
    return cutil.na(this.tick) ? null : d(1.0001).pow(this.tick);
  }
  get price_() {
    return this.price_$?.toString();
  }
  get price$() {
    return this.price_$?.mul(
      10 ** (this.token0.decimals - this.token1.decimals),
    );
  }
  get price() {
    return this.price$?.toNumber();
  }
  set price(price) {
    this.price$ = cutil.na(price) ? null : d(price);
  }
  set price$(price$) {
    this.price_$ = cutil.na(price$)
      ? null
      : d(price$).div(10 ** (this.token0.decimals - this.token1.decimals));
  }
  set price_$(price_$) {
    this.tick = cutil.na(price_$)
      ? null
      : cutil.asInteger(d(price_$).log(1.0001).toNumber()).toString();
  }
  set price_(price_) {
    this.price_$ = cutil.na(price_) ? null : d(price_);
  }
  async toUpdate() {
    let pool = this;
    await Promise.all([
      pool.toUpdateAddress(),
      pool.toUpdateImmutables(),
      pool.toUpdateState(),
    ]);
    return pool;
  }
  async toUpdateAddress() {
    let pool = this;
    if (cutil.na(pool.address)) {
      let { token0, token1, fee } = pool;
      let { defi } = pool;
      let { factory } = defi;
      await factory.toGetAbi();
      pool.address = await factory.toCallRead(
        "getPool",
        token0.address,
        token1.address,
        fee,
      );
      pool.contract = defi.contract({ address: pool.address, account });
    }
    return pool;
  }
  async toUpdateImmutables() {
    let pool = this;
    let { contract } = pool;
    await contract.toGetAbi(abiPool);
    let { defi } = pool;
    let { chain } = defi;
    let [
      addressFactory,
      addressToken0,
      addressToken1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    ] = await Promise.all([
      contract.toCallRead("factory"),
      contract.toCallRead("token0"),
      contract.toCallRead("token1"),
      contract.toCallRead("fee"),
      contract.toCallRead("tickSpacing"),
      contract.toCallRead("maxLiquidityPerTick"),
    ]);
    fee = d(fee).toNumber();
    tickSpacing = d(tickSpacing).toNumber();
    maxLiquidityPerTick = d(maxLiquidityPerTick).toFixed(0);
    cutil.assign(pool, {
      addressFactory,
      addressToken0,
      addressToken1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    });
    defi.addressFactory ||= addressFactory;
    pool.tokenId0 ||= chain.tokenId(addressToken0);
    pool.tokenId1 ||= chain.tokenId(addressToken1);
    try {
      await pool.token0.toGetDecimals();
    } catch (e) {
      console.log(`Error in getting decimals for ${pool.token0.address}`);
      throw e;
    }
    try {
      await pool.token1.toGetDecimals();
    } catch (e) {
      console.log(`Error in getting decimals for ${pool.token1.address}`);
      throw e;
    }
    return pool;
  }
  async toUpdateState() {
    let pool = this;
    let { contract } = pool;
    await contract.toGetAbi(abiPool);
    let { defi } = pool;
    let { chain } = defi;
    let [feeGrowthGlobal0X128, feeGrowthGlobal1X128, liquidity, slot0] =
      await Promise.all([
        contract.toCallRead("feeGrowthGlobal0X128"),
        contract.toCallRead("feeGrowthGlobal1X128"),
        contract.toCallRead("liquidity"),
        contract.toCallRead("slot0"),
      ]);
    
    feeGrowthGlobal0X128 = d(feeGrowthGlobal0X128).toFixed(0);
    feeGrowthGlobal1X128 = d(feeGrowthGlobal1X128).toFixed(0);
    liquidity = d(liquidity).toFixed(0);
    
    let {
      sqrtPriceX96,
      tick,
      observationIndex,
      observationCardinality,
      observationCardinalityNext,
      feeProtocol,
      unlocked,
    } = slot0;
    
    sqrtPriceX96 = d(sqrtPriceX96).toFixed(0);
    tick = d(tick).toFixed(0);
    observationIndex = d(observationIndex).toFixed(0);
    observationCardinality = d(observationCardinality).toFixed(0);
    observationCardinalityNext = d(observationCardinalityNext).toFixed(0);
    feeProtocol = d(feeProtocol).toFixed(0);
    
    cutil.assign(pool, {
      feeGrowthGlobal0X128,
      feeGrowthGlobal1X128,
      liquidity,
      slot0,
      sqrtPriceX96,
      tick,
      observationIndex,
      observationCardinality,
      observationCardinalityNext,
      feeProtocol,
      unlocked,
    });
    return pool;
  }
}

class Position extends Obj {
  static {
    cutil.extend(this.prototype, {
      defi: null,
      _pool: null,
      index: null,
      id: null,

      nonce: null,
      operator: null,
      addressToken0: null,
      addressToken1: null,
      fee: null,
      _tickLower: null,
      _tickUpper: null,
      _liquidity: null,
      feeGrowthInside0LastX128: null,
      feeGrowthInside1LastX128: null,
      tokensOwed0: null,
      tokensOwed1: null,

      feeGrowthOutside0X128Lower: null,
      feeGrowthOutside1X128Lower: null,
      feeGrowthOutside0X128Upper: null,
      feeGrowthOutside1X128Upper: null,

      _tickWidth: null,
      _max0_$: null,
      _max1_$: null,
      _amount0_$: null,
      _amount1_$: null,
    });
  }
  get pool() {
    let position = this;
    if (cutil.na(position._pool)) {
      let { defi } = position;
      position._pool = defi.pool();
    }
    return position._pool;
  }
  set pool(pool) {
    let position = this;
    position._pool = pool;
  }
  get addressPool() {
    let position = this;
    return position.pool.address;
  }
  set addressPool(addressPool) {
    let position = this;
    position.pool.address = addressPool;
  }
  get liquidity() {
    let position = this;
    return position._liquidity;
  }
  set liquidity(liquidity) {
    let position = this;
    position._liquidity = liquidity;
  }
  get tickLower() {
    let position = this;
    if (
      cutil.na(position._tickLower) &&
      cutil.a(position._tickUpper) &&
      cutil.a(position._tickWidth)
    ) {
      position._tickLower = position.tickUpper - position.tickWidth;
    }
    return position._tickLower;
  }
  set tickLower(tickLower) {
    let position = this;
    if (cutil.a(tickLower)) {
      tickLower = cutil.asNumber(tickLower);
    }
    position._tickLower = tickLower;
  }
  get tickUpper() {
    let position = this;
    if (
      cutil.na(position._tickUpper) &&
      cutil.a(position._tickUpper) &&
      cutil.a(position._tickWidth)
    ) {
      position._tickUpper = position.tickLower + position.tickWidth;
    }
    return position._tickUpper;
  }
  set tickUpper(tickUpper) {
    let position = this;
    if (cutil.a(tickUpper)) {
      tickUpper = cutil.asNumber(tickUpper);
    }
    position._tickUpper = tickUpper;
  }
  get tickWidth() {
    let position = this;
    if (
      cutil.na(position._tickWidth) &&
      cutil.a(position._tickLower) &&
      cutil.a(position._tickUpper)
    ) {
      position._tickWidth = position.tickUpper - position.tickLower;
    }
    return position._tickWidth;
  }
  set tickWidth(tickWidth) {
    let position = this;
    if (cutil.a(tickWidth)) {
      tickWidth = cutil.asNumber(tickWidth);
    }
    position._tickWidth = tickWidth;
  }
  set max0_$(max0_$) {
    let position = this;
    position._max0_$ = max0_$;
  }
  set max1_$(max1_$) {
    let position = this;
    position._max1_$ = max1_$;
  }
  set amount0_$(amount0_$) {
    let position = this;
    position._amount0_$ = amount0_$;
  }
  set amount1_$(amount1_$) {
    let position = this;
    position._amount1_$ = amount1_$;
  }
  set max0_(max0_) {
    let position = this;
    position._max0_$ = cutil.na(max0_) ? null : d(max0_);
  }
  set max1_(max1_) {
    let position = this;
    position._max1_$ = cutil.na(max1_) ? null : d(max1_);
  }
  set amount0_(amount0_) {
    let position = this;
    position._amount0_$ = cutil.na(amount0_) ? null : d(amount0_);
  }
  set amount1_(amount1_) {
    let position = this;
    position._amount1_$ = cutil.na(amount1_) ? null : d(amount1_);
  }
  set max0$(max0$) {
    let position = this;
    position._max0_$ = cutil.na(max0$)
      ? null
      : d(max0$).mul(10 ** position.pool.token0.decimals);
  }
  set max1$(max1$) {
    let position = this;
    position._max1_$ = cutil.na(max1$)
      ? null
      : d(max1$).mul(10 ** position.pool.token1.decimals);
  }
  set amount0$(amount0$) {
    let position = this;
    position._amount0_$ = cutil.na(amount0$)
      ? null
      : d(amount0$).mul(10 ** position.pool.token0.decimals);
  }
  set amount1$(amount1$) {
    let position = this;
    position._amount1_$ = cutil.na(amount1$)
      ? null
      : d(amount1$).mul(10 ** position.pool.token1.decimals);
  }
  set max0(max0) {
    let position = this;
    position.max0$ = cutil.na(max0) ? null : d(max0);
  }
  set max1(max1) {
    let position = this;
    position.max1$ = cutil.na(max1) ? null : d(max1);
  }
  set amount0(amount0) {
    let position = this;
    position.amount0$ = cutil.na(amount0) ? null : d(amount0);
  }
  set amount1(amount1) {
    let position = this;
    position.amount1$ = cutil.na(amount1) ? null : d(amount1);
  }
  get max0_$() {
    return d(this.liquidity).mul(
      d(1.0001)
        .pow(this.tickLower * -0.5)
        .minus(d(1.0001).pow(this.tickUpper * -0.5)),
    );
  }
  get max1_$() {
    return d(this.liquidity).mul(
      d(1.0001)
        .pow(this.tickUpper * +0.5)
        .minus(d(1.0001).pow(this.tickLower * +0.5)),
    );
  }
  get max0$() {
    return this.max0_$.div(10 ** this.pool.token0.decimals);
  }
  get max1$() {
    return this.max1_$.div(10 ** this.pool.token1.decimals);
  }
  get max0_() {
    return this.max0_$.toFixed(0);
  }
  get max1_() {
    return this.max1_$.toFixed(0);
  }
  get max0() {
    return this.max0$.toNumber();
  }
  get max1() {
    return this.max1$.toNumber();
  }
  get amount0_$() {
    return d(this.liquidity).mul(this.m0$);
  }
  get amount1_$() {
    return d(this.liquidity).mul(this.m1$);
  }
  get amount0$() {
    return this.amount0_$.div(10 ** this.pool.token0.decimals);
  }
  get amount1$() {
    return this.amount1_$.div(10 ** this.pool.token1.decimals);
  }
  get amount0_() {
    return this.amount0_$.toFixed(0);
  }
  get amount1_() {
    return this.amount1_$.toFixed(0);
  }
  get amount0() {
    return this.amount0$.toNumber();
  }
  get amount1() {
    return this.amount1$.toNumber();
  }
  get priceLower_$() {
    return d(1.0001).pow(this.tickLower);
  }
  get priceLower_() {
    return this.priceLower_$.toString();
  }
  get priceLower$() {
    return this.priceLower_$.mul(
      10 ** (this.pool.token0.decimals - this.pool.token1.decimals),
    );
  }
  get priceLower() {
    return this.priceLower$.toNumber();
  }
  get priceUpper_$() {
    return d(1.0001).pow(this.tickUpper);
  }
  get priceUpper_() {
    return this.priceUpper_$.toString();
  }
  get priceUpper$() {
    return this.priceUpper_$.mul(
      10 ** (this.pool.token0.decimals - this.pool.token1.decimals),
    );
  }
  get priceUpper() {
    return this.priceUpper$.toNumber();
  }
  get min0_$() {
    return this.max1_$.div(this.priceUpper_$);
  }
  get min0_() {
    return this.min0_$.toString();
  }
  get min0$() {
    return this.min0_$.div(10 ** this.pool.token0.decimals);
  }
  get min0() {
    return this.min0$.toNumber();
  }
  get min1_$() {
    return this.max0_$.mul(this.priceLower_$);
  }
  get min1_() {
    return this.min1_$.toString();
  }
  get min1$() {
    return this.min1_$.div(10 ** this.pool.token1.decimals);
  }
  get min1() {
    return this.min1$.toNumber();
  }
  get fee0_$() {
    let feeGrowthInside0X128$;
    if (d(this.pool.tick).lt(d(this.tickLower))) {
      feeGrowthInside0X128$ = d(this.feeGrowthOutside0X128Lower).minus(
        d(this.feeGrowthOutside0X128Upper),
      );
    } else if (d(this.pool.tick).gte(d(this.tickUpper))) {
      feeGrowthInside0X128$ = d(this.feeGrowthOutside0X128Upper).minus(
        d(this.feeGrowthOutside0X128Lower),
      );
    } else {
      feeGrowthInside0X128$ = d(this.pool.feeGrowthGlobal0X128)
        .minus(d(this.feeGrowthOutside0X128Lower))
        .minus(d(this.feeGrowthOutside0X128Upper));
    }
    if (feeGrowthInside0X128$.lt(0)) {
      feeGrowthInside0X128$ = feeGrowthInside0X128$.plus(d(2).pow(256));
    }
    return feeGrowthInside0X128$
      .minus(d(this.feeGrowthInside0LastX128))
      .mul(d(this.liquidity))
      .div(d(2).pow(128))
      .plus(d(this.tokensOwed0));
  }
  get fee1_$() {
    let feeGrowthInside1X128$;
    if (d(this.pool.tick).lt(d(this.tickLower))) {
      feeGrowthInside1X128$ = d(this.feeGrowthOutside1X128Lower).minus(
        d(this.feeGrowthOutside1X128Upper),
      );
    } else if (d(this.pool.tick).gte(d(this.tickUpper))) {
      feeGrowthInside1X128$ = d(this.feeGrowthOutside1X128Upper).minus(
        d(this.feeGrowthOutside1X128Lower),
      );
    } else {
      feeGrowthInside1X128$ = d(this.pool.feeGrowthGlobal1X128)
        .minus(d(this.feeGrowthOutside1X128Lower))
        .minus(d(this.feeGrowthOutside1X128Upper));
    }
    if (feeGrowthInside1X128$.lt(0)) {
      feeGrowthInside1X128$ = feeGrowthInside1X128$.plus(d(2).pow(256));
    }
    return feeGrowthInside1X128$
      .minus(d(this.feeGrowthInside1LastX128))
      .mul(d(this.liquidity))
      .div(d(2).pow(128))
      .plus(d(this.tokensOwed1));
  }
  get fee0$() {
    return this.fee0_$.div(10 ** this.pool.token0.decimals);
  }
  get fee1$() {
    return this.fee1_$.div(10 ** this.pool.token1.decimals);
  }
  get fee0_() {
    return this.fee0_$.toFixed(0);
  }
  get fee1_() {
    return this.fee1_$.toFixed(0);
  }
  get fee0() {
    return this.fee0$.toNumber();
  }
  get fee1() {
    return this.fee1$.toNumber();
  }
  get total0_$() {
    return this.amount0_$.plus(this.amount1_$.div(this.pool.price_$));
  }
  get total0_() {
    return this.total0_$.toFixed(0);
  }
  get total0$() {
    return this.total0_$.div(10 ** this.pool.token0.decimals);
  }
  get total0() {
    return this.total0$.toNumber();
  }
  get total1_$() {
    return this.amount1_$.plus(this.amount0_$.mul(this.pool.price_$));
  }
  get total1_() {
    return this.total1_$.toFixed(1);
  }
  get total1$() {
    return this.total1_$.div(10 ** this.pool.token1.decimals);
  }
  get total1() {
    return this.total1$.toNumber();
  }
  get m0$() {
    let tick = this.pool.tick;
    let tickUpper = this.tickUpper;
    if (d(tick).gt(d(tickUpper))) {
      tick = tickUpper;
    }
    let tickLower = this.tickLower;
    if (d(tick).lt(d(tickLower))) {
      tick = tickLower;
    }
    return d(1.0001)
      .pow(tick * -0.5)
      .minus(d(1.0001).pow(tickUpper * -0.5));
  }
  get m1$() {
    let tick = this.pool.tick;
    let tickUpper = this.tickUpper;
    if (d(tick).gt(d(tickUpper))) {
      tick = tickUpper;
    }
    let tickLower = this.tickLower;
    if (d(tick).lt(d(tickLower))) {
      tick = tickLower;
    }
    return d(1.0001)
      .pow(tick * +0.5)
      .minus(d(1.0001).pow(tickLower * +0.5));
  }
  get r0$() {
    return this.m0$.div(this.m0$.plus(this.m1$.div(this.pool.price_$)));
  }
  get r0() {
    return this.r0$.toNumber();
  }
  get r1$() {
    return this.m1$.div(this.m1$.plus(this.m0$.mul(this.pool.price_$)));
  }
  get r1() {
    return this.r1$.toNumber();
  }
  get ratio$() {
    return this.amount1_$.div(this.amount0_$);
  }
  get ratio() {
    return this.ratio$.toNumber();
  }
  get rr0$() {
    return this.r0$.div(this.r1$);
  }
  get rr0() {
    return this.rr0$.toNumber();
  }
  get rr1$() {
    return this.r1$.div(this.r0$);
  }
  get rr1() {
    return this.rr1$.toNumber();
  }
  get rr$() {
    return d.max(this.rr0$, this.rr1$);
  }
  get rr() {
    return this.rr$.toNumber();
  }
  async toUpdateId() {
    let position = this;
    if (cutil.na(position.id)) {
      if (cutil.na(position.index)) {
        let { defi } = position;
        let { index } = position;
        let { positionManager } = defi;
        let { account } = defi;
        let { address } = account;

        await positionManager.toGetAbi();
        position.id = await positionManager.toCallRead(
          "tokenOfOwnerByIndex",
          address,
          index,
        );
        position.id = d(position.id).toFixed(0);
      }
    }
    return position;
  }
  async toUpdate() {
    let position = this;
    let { defi } = position;
    let { chain } = defi;
    let { positionManager } = defi;

    await positionManager.toGetAbi();

    await position.toUpdateId();
    let { id } = position;

    let {
      nonce,
      operator,
      token0: addressToken0,
      token1: addressToken1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tokensOwed0,
      tokensOwed1,
    } = await positionManager.toCallRead("positions", id);
    let tokenId0 = chain.tokenId(addressToken0);
    let tokenId1 = chain.tokenId(addressToken1);

    let pool = await defi.pool({ tokenId0, tokenId1, fee });
    await pool.toUpdate();

    let {
      feeGrowthOutside0X128: feeGrowthOutside0X128Lower,
      feeGrowthOutside1X128: feeGrowthOutside1X128Lower,
    } = await pool.contract.toCallRead("ticks", cutil.asNumber(tickLower));
    let {
      feeGrowthOutside0X128: feeGrowthOutside0X128Upper,
      feeGrowthOutside1X128: feeGrowthOutside1X128Upper,
    } = await pool.contract.toCallRead("ticks", cutil.asNumber(tickUpper));

    cutil.assign(position, {
      id,
      nonce,
      operator,
      addressToken0,
      addressToken1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      feeGrowthOutside0X128Lower,
      feeGrowthOutside0X128Upper,
      feeGrowthOutside1X128Lower,
      feeGrowthOutside1X128Upper,
      tokensOwed0,
      tokensOwed1,
      pool,
    });
  }
  async toCollect({
    recipient = null,
    dontUnwrap = false,
    onlyData = false,
    verbose = false,
  }) {
    let position = this;
    let { defi } = position;
    let { chain } = defi;

    let { id } = position;
    let { pool } = position;
    let { token0, token1 } = pool;
    let { positionManager } = defi;
    let { account } = defi;
    let { address } = account;

    await positionManager.toGetAbi();

    let calls = [];

    if (!recipient) {
      recipient = address;
    }
    let tokenId = d(position.id).toFixed(0);
    let amount0Max = d(2).pow(128).minus(1).toFixed(0);
    let amount1Max = d(2).pow(128).minus(1).toFixed(0);

    if (verbose) {
      console.log(
        JSON.stringify(
          {
            method: "collect",
            params: {
              params: {
                tokenId,
                recipient: dontUnwrap ? recipient : chain.addressZero,
                amount0Max,
                amount1Max,
              },
            },
          },
          null,
          "\t",
        ),
      );
    }
    calls.push(
      positionManager.callData("collect((uint256,address,uint128,uint128))", [
        tokenId,
        dontUnwrap ? recipient : chain.addressZero,
        amount0Max,
        amount1Max,
      ]),
    );

    let {
      fee0: amount0,
      fee1: amount1,
      fee0_: amount0_,
      fee1_: amount1_,
    } = position;
    let amountMinimum0_ = d(amount0_).mul(0.999).toFixed(0);
    let amountMinimum1_ = d(amount1_).mul(0.999).toFixed(0);

    let addressWTok = await defi.toGetWTokAddress();
    for (let [addressToken, amountMinimum] of [
      [token0.address, amountMinimum0_],
      [token1.address, amountMinimum1_],
    ]) {
      if (chain.eq(addressToken, addressWTok) && !dontUnwrap) {
        if (verbose) {
          console.log(
            JSON.stringify(
              {
                method: "unwrapWETH9",
                params: { amountMinimum, recipient },
              },
              null,
              "\t",
            ),
          );
        }
        calls.push(
          positionManager.callData(
            "unwrapWETH9(uint256,address)",
            amountMinimum,
            recipient,
          ),
        );
      } else {
        if (verbose) {
          console.log(
            JSON.stringify(
              {
                method: "sweepToken",
                params: { addressToken, amountMinimum, recipient },
              },
              null,
              "\t",
            ),
          );
        }
        calls.push(
          positionManager.callData(
            "sweepToken(address,uint256,address)",
            addressToken,
            amountMinimum,
            recipient,
          ),
        );
      }
    }

    let data = positionManager.callData("multicall", calls);
    let result = {
      amount0,
      amount0_,
      amount1,
      amount1_,
      amountMinimum0_,
      amountMinimum1_,
      calls,
      data,
    };

    if (!onlyData) {
      let receipt = await positionManager.toSendData(data);
      cutil.assign(result, { receipt });
      for (let log of cutil.asArray(receipt.logs)) {
        log.dec = await defi.toDecodeLog(log);
        let {
          event: { name },
          address,
          decoded,
        } = log.dec;
        if (name === "Collect" && chain.eq(address, positionManager.address)) {
          let {
            tokenId,
            recipient,
            amount0: amount0_,
            amount1: amount1_,
          } = decoded;
          let amount0 = token0.unwrapNumber(amount0_);
          let amount1 = token1.unwrapNumber(amount1_);
          cutil.assign(result, { amount0, amount0_, amount1, amount1_ });
        }
      }
    }

    return result;
  }
  async toIncreaseLiquidity({
    amount0,
    amount1,
    amount0_,
    amount1_,
    total0,
    total1,
    total0_,
    total1_,
    liquidity,
    ratio,
    dontUnwrap = false,
    verbose = false,
  }) {
    let position = this;
    let { id: tokenId } = position;
    let { defi } = position;
    let { chain } = defi;
    let { account } = defi;
    let { positionManager } = defi;
    await positionManager.toGetAbi();
    let { pool } = position;
    let { token0 } = pool;
    let { token1 } = pool;
    let { id: tokenId0, address: addressToken0, decimals: decimals0 } = token0;
    let { id: tokenId1, address: addressToken1, decimals: decimals1 } = token1;

    let result = {};

    // amount0 -> amount0_
    // amount1 -> amount1_
    if (cutil.na(amount0_) && !cutil.na(amount0)) {
      amount0_ = await token0.toWrapNumber(amount0);
    }
    if (cutil.na(amount1_) && !cutil.na(amount1)) {
      amount1_ = await token1.toWrapNumber(amount1);
    }

    // amount0_ <= 0
    // amount1_ <= 0
    if (!cutil.na(amount0_) && d(amount0_).lte(0)) {
      if (d(amount0_).eq(0)) {
        let reserveBalance = defi.reserveBalances[tokenId0] || 0;
        let reserveBalance_ = await token0.toWrapNumber(reserveBalance);
        amount0_ = d(reserveBalance_).mul(-1).toFixed(0);
      }
      let balance0_ =
        !dontUnwrap && chain.isWTok(addressToken0)
          ? await account.toGetBalance_()
          : await account.toGetTokenBalance_(tokenId0);
      amount0_ = d(balance0_).plus(amount0_).toFixed(0);
    }
    if (!cutil.na(amount1_) && d(amount1_).lte(0)) {
      if (d(amount1_).eq(0)) {
        let reserveBalance = defi.reserveBalances[tokenId1] || 0;
        let reserveBalance_ = await token0.toWrapNumber(reserveBalance);
        amount1_ = d(reserveBalance_).mul(-1).toFixed(0);
      }
      let balance1_ =
        !dontUnwrap && chain.isWTok(addressToken1)
          ? await account.toGetBalance_()
          : await account.toGetTokenBalance_(tokenId1);
      amount1_ = d(balance1_).plus(amount1_).toFixed(0);
    }

    // total0 -> total0_
    // total1 -> total1_
    if (cutil.na(total0_) && !cutil.na(total0)) {
      total0_ = await token0.toWrapNumber(total0);
    }
    if (cutil.na(total1_) && !cutil.na(total1)) {
      total1_ = await token1.toWrapNumber(total1);
    }

    let { tick } = pool;
    let { price } = pool;
    let { tickLower, tickUpper } = position;
    let price_$ = d(price).div(10 ** (decimals1 - decimals0));
    let tck = d(tick).lt(tickLower)
      ? tickLower
      : d(tick).gt(tickUpper)
        ? tickUpper
        : tick;
    // amount1_:amount0_
    let ratio_$ = d(1.0001)
      .pow(tck * +0.5)
      .minus(d(1.0001).pow(tickLower * +0.5))
      .div(
        d(1.0001)
          .pow(tck * -0.5)
          .minus(d(1.0001).pow(tickUpper * -0.5)),
      );

    if (!cutil.na(amount0_) && cutil.na(amount1_)) {
      // amount0_ -> amount1_
      amount1_ = d(amount0_).mul(ratio_$).toFixed(0);
    } else if (cutil.na(amount0_) && !cutil.na(amount1_)) {
      // amount1_ -> amount0_
      amount0_ = d(amount1_).div(ratio_$).toFixed(0);
    } else if (cutil.na(amount0_) && cutil.na(amount1_)) {
      if (!cutil.na(total0_)) {
        // total0_ -> amount0_, amount1_
        if (ratio_$.eq(Infinity)) {
          amount0_ = d(0).toFixed(0);
          amount1_ = d(total0_).mul(price_$).toFixed(0);
        } else {
          amount0_ = d(total0_)
            .div(d(1).plus(ratio_$.div(price_$)))
            .toFixed(0);
          amount1_ = d(amount0_).mul(ratio_$).toFixed(0);
        }
      } else if (!cutil.na(total1_)) {
        // total1_ -> amount0_, amount1_
        if (ratio_$.eq(0)) {
          amount0_ = d(total1_).div(price_$).toFixed(0);
          amount1_ = d(0).toFixed(0);
        } else {
          amount0_ = d(total1_).div(ratio_$.plus(price_$)).toFixed(0);
          amount1_ = d(amount0_).mul(ratio_$).toFixed(0);
        }
      }
    }

    if (!cutil.na(ratio) || !cutil.na(liquidity)) {
      let r$ = !cutil.na(ratio) ? d(r) : d(liquidity).div(position.liquidity);
      amount0_ = r$.mul(position.amount0_);
      amount1_ = r$.mul(position.amount1_);
    }

    if (verbose) {
      console.log({ amount0_, amount1_ });
    }

    for (let [token, amount_] of [
      [token0, amount0_],
      [token1, amount1_],
    ]) {
      if (!chain.isWTok(token) || dontUnwrap) {
        let allowance_ = await token.toGetAllowance_(
          account.address,
          positionManager.address,
        );
        if (d(allowance_).lt(amount_)) {
          if (verbose) {
            console.log(`Approving ${token.id}`);
          }
          await token.toApprove_(
            positionManager.address,
            d(2).pow(256).minus(1).toFixed(0),
          );
        }
      }
    }

    let amount0Desired = d(amount0_).toFixed(0);
    let amount1Desired = d(amount1_).toFixed(0);

    let { tolerance } = defi;
    let amount0Min = d(amount0Desired)
      .mul(1 - tolerance)
      .toFixed(0);
    let amount1Min = d(amount1Desired)
      .mul(1 - tolerance)
      .toFixed(0);

    if (d(amount0Min).lt(d(0))) {
      amount0Min = d(0).toFixed(0);
    }
    if (d(amount1Min).lt(d(0))) {
      amount1Min = d(0).toFixed(0);
    }

    let value = d(0).toFixed(0);
    if (!dontUnwrap && chain.isWTok(token0)) {
      value = amount0Desired;
    } else if (!dontUnwrap && chain.isWTok(token1)) {
      value = amount1Desired;
    }
    let deadline = defi.deadline();

    if (verbose) {
      console.log(
        JSON.stringify(
          {
            mathod: "increaseLiquidity",
            params: {
              params: {
                tokenId,
                amount0Desired,
                amount1Desired,
                amount0Min,
                amount1Min,
                deadline,
              },
            },
          },
          null,
          "\t",
        ),
      );
    }
    let calls = [];
    calls.push(
      positionManager.callData("increaseLiquidity", [
        tokenId,
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min,
        deadline,
      ]),
    );
    calls.push(positionManager.callData("refundETH"));

    let data = positionManager.callData("multicall", calls);
    let receipt = await positionManager.toSendData(data, value);

    cutil.assign(result, { receipt });

    for (let log of cutil.asArray(receipt.logs)) {
      log.dec = await defi.toDecodeLog(log);
      let {
        event: { name },
        address,
      } = log.dec;
      if (name === "IncreaseLiquidity") {
        let {
          decoded: { tokenId, liquidity, amount0: amount0_, amount1: amount1_ },
        } = log.dec;
        if (cutil.asInteger(tokenId) === cutil.asInteger(position.id)) {
          let amount0 = await token0.toUnwrapNumber(amount0_);
          let amount1 = await token1.toUnwrapNumber(amount1_);
          cutil.assign(result, {
            liquidity,
            amount0,
            amount1,
            amount0_,
            amount1_,
          });
        }
      }
    }
    return result;
  }
  async toDecreaseLiquidity({ ratio = 1, dontUnwrap = false }) {
    let position = this;
    let result;
    if (d(position.liquidity).gt(0)) {
      let calls = [];

      let { id: tokenId, amount0_, amount1_ } = position;
      let { defi } = position;
      let { chain } = defi;
      let { account } = defi;
      let { address } = account;
      let recipient = address;
      let { positionManager } = defi;
      await positionManager.toGetAbi();
      let { abi } = positionManager;

      let liquidity = d(position.liquidity).mul(ratio).toFixed(0);
      let amount0Min = d(amount0_).mul(ratio).mul(0.9).toFixed(0);
      let amount1Min = d(amount1_).mul(ratio).mul(0.9).toFixed(0);
      // ... not needed
      amount0Min = "0";
      amount1Min = "0";
      let deadline = defi.deadline();
      console.log(
        JSON.stringify({
          method: "decreaseLiquidity",
          params: { tokenId, liquidity, amount0Min, amount1Min, deadline },
        }),
      );
      calls.push(
        positionManager.callData("decreaseLiquidity", [
          tokenId,
          liquidity,
          amount0Min,
          amount1Min,
          deadline,
        ]),
      );

      let amount0Max = d(2).pow(128).minus(1).toFixed(0);
      let amount1Max = d(2).pow(128).minus(1).toFixed(0);
      calls.push(
        positionManager.callData("collect", [
          tokenId,
          dontUnwrap ? recipient : chain.addressZero,
          amount0Max,
          amount1Max,
        ]),
      );

      if (!dontUnwrap) {
        let addressWTok = await defi.toGetWTokAddress();
        for (let [addr, fee_] of [
          [position.pool.token0.address, position.fee0_],
          [position.pool.token1.address, position.fee1_],
        ]) {
          let amountMinimum = d(fee_).mul(0.999).toFixed(0);
          if (chain.eq(addr, addressWTok)) {
            calls.push(
              positionManager.callData("unwrapWETH9", amountMinimum, recipient),
            );
          } else {
            calls.push(
              positionManager.callData(
                "sweepToken",
                addr,
                amountMinimum,
                recipient,
              ),
            );
          }
        }
      }

      let data = positionManager.callData("multicall", calls);
      let receipt = await positionManager.toSendData(data);

      result = { receipt };

      for (let log of cutil.asArray(receipt.logs)) {
        log.dec = await defi.toDecodeLog(log);
        let {
          event: { name },
          address,
        } = log.dec;
        if (name === "DecreaseLiquidity") {
          let {
            decoded: {
              tokenId,
              liquidity,
              amount0: amount0_,
              amount1: amount1_,
            },
          } = log.dec;
          if (cutil.asInteger(tokenId) === cutil.asInteger(position.id)) {
            let amount0 = await position.pool.token0.toUnwrapNumber(amount0_);
            let amount1 = await position.pool.token1.toUnwrapNumber(amount1_);
            cutil.assign(result, {
              liquidity,
              amount0,
              amount1,
              amount0_,
              amount1_,
            });
          }
        }
      }
    }
    return result;
  }
  async toProportionalize({ amnt0_, amnt1_, priceExternal, pathInfos }) {
    let position = this;
    let {
      defi,
      amount0_$,
      amount1_$,
      pool: {
        price_$,
        feeRate,
        tokenId0,
        tokenId1,
        token0: { decimals: decimals0 },
        token1: { decimals: decimals1 },
      },
    } = position;
    let amnt0_$ = d(amnt0_);
    let amnt1_$ = d(amnt1_);
    if (priceExternal) {
      price_$ = d(priceExternal).mul(d(10).pow(decimals1 - decimals0));
    } else {
      priceExternal = price_$.div(d(10).pow(decimals1 - decimals0)).toNumber();
    }
    if (!pathInfos) {
      pathInfos = [[tokenId0, feeRate, tokenId1]];
    }
    let delta0_$ = d(
      d(amnt1_$.mul(amount0_$)).minus(amnt0_$.mul(amount1_$)),
    ).div(d(d(amount1_$).plus(price_$.mul(amount0_$))));
    let delta1_$ = delta0_$.mul(price_$).mul(-1);
    let isForward = delta0_$.lt(0);
    let routes, route;
    if (isForward) {
      let amountIn_ = delta0_$.mul(-1).toFixed(0);
      // console.log({pathInfos, amountIn_, priceExternal});
      routes = await defi.toQuoteRoutes({
        pathInfos,
        amountIn_,
        priceExternal,
      });
      route = routes[0];
      delta1_$ = d(route.amountOut_);
    } else {
      pathInfos = pathInfos.map((pathInfo) => pathInfo.reverse());
      let amountIn_ = delta1_$.mul(-1).toFixed(0);
      // console.log({pathInfos, amountIn_, priceExternal: d(priceExternal).pow(-1).toNumber()});
      routes = await defi.toQuoteRoutes({
        pathInfos,
        amountIn_,
        priceExternal: d(priceExternal).pow(-1).toNumber(),
      });
      route = routes[0];
      delta0_$ = d(route.amountOut_);
    }
    let delta0_ = delta0_$.abs().toFixed(0);
    let delta1_ = delta1_$.abs().toFixed(0);
    let amt0_ = amnt0_$.plus(delta0_$).toFixed(0);
    let amt1_ = amnt1_$.plus(delta1_$).toFixed(0);
    return {
      amt0_,
      amt1_,
      delta0_,
      delta1_,
      isForward,
      route,
      routes,
      priceExternal,
    };
  }
}

class DeFi extends cutil.mixin(Obj, chainer) {
  static {
    cutil.extend(this.prototype, {
      _defid: null,
      infos: {
        "": {
          UniswapV3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
          Multicall2: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
          ProxyAdmin: "0xB753548F6E010e7e680BA186F9Ca1BdAB2E90cf2",
          TickLens: "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
          Quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
          SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
          SwapRouter02: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
          NFTDescriptor: "0x42B24A95702b9986e82d421cC3568932790A48Ec",
          NonfungibleTokenPositionDescriptor:
            "0x91ae842A5Ffd8d12023116943e72A606179294f3",
          TransparentUpgradeableProxy:
            "0xEe6A57eC80ea46401049E92587E52f5Ec1c24785",
          NonfungiblePositionManager:
            "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
          V3Migrator: "0xA5644E29708357803b5A882D272c41cC0dF92B34",
        },
        bsc: {
          UniswapV3Factory: "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
          NonfungiblePositionManager:
            "0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613",
          UniversalRouter: "0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897",
          Permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
          Forwarder: "0x059FFAFdC6eF594230dE44F824E2bD0A51CA5dED",
          ForwarderFactory: "0xFfa397285Ce46FB78C588a9e993286AaC68c37cD",
          Multicall2: "",
          ProxyAdmin: "0xC9A7f5b73E853664044ab31936D0E6583d8b1c79",
          TickLens: "0xD9270014D396281579760619CCf4c3af0501A47C",
          Quoter: "0x2dfE5D70641f626C7B1CE3eA74BDc2522557655d",
          QuoterV2: "0x78D78E420Da98ad378D7799bE8f4AF69033EB077",
          SwapRouter: "0x8ddA5A831C1BaFFc646C8D0351A59709367D7865",
          SwapRouter02: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2",
          NFTDescriptor: "0x10009Bc2247c6D1F75913baE9124a278186D481d",
          NonfungibleTokenPositionDescriptor: "",
          TransparentUpgradeableProxy:
            "0xAec98e489AE35F243eB63452f6ad233A6c97eE97",
          V3Migrator: "0x32681814957e0C13117ddc0c2aba232b5c9e760f",
          UniswapInterfaceMulticall:
            "0x963Df249eD09c358A4819E39d9Cd5736c3087184",
          UniswapWormholeMessageReceiver:
            "0x341c1511141022cf8eE20824Ae0fFA3491F1302b",
        },
        avax: {
          UniswapV3Factory: "0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD",
          NonfungiblePositionManager:
            "0x655C406EBFa14EE2006250925e54ec43AD184f8B",
          QuoterV2: "0xbe0F5544EC67e9B3b2D979aaA43f18Fd87E6257F",
          SwapRouter02: "0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE",
          UniswapInterfaceMulticall: "0x0139141Cd4Ee88dF3Cdb65881D411bAE271Ef0C2",
          ProxyAdmin: "0x9AdA7D7879214073F40183F3410F2b3f088c6381",
          TickLens: "0xEB9fFC8bf81b4fFd11fb6A63a6B0f098c6e21950",
        },
        celo: {
          UniswapV3Factory: "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc",
          Multicall2: "0x633987602DE5C4F337e3DbF265303A1080324204",
          ProxyAdmin: "0xc1b262Dd7643D4B7cA9e51631bBd900a564BF49A",
          TickLens: "0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D",
          Quoter: "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8",
          SwapRouter: "0x5615CDAb10dc425a742d643d949a7F474C01abc4",
          NFTDescriptor: "0xa9Fd765d85938D278cb0b108DbE4BF7186831186",
          NonfungibleTokenPositionDescriptor:
            "0x644023b316bB65175C347DE903B60a756F6dd554",
          TransparentUpgradeableProxy:
            "0x505B43c452AA4443e0a6B84bb37771494633Fde9",
          NonfungiblePositionManager:
            "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A",
          V3Migrator: "0x3cFd4d48EDfDCC53D3f173F596f621064614C582",
        },
        pcs: {
          PancakeV3Factory: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
          PancakeV3PoolDeployer: "0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9",
          "SwapRouter (v3)": "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
          V3Migrator: "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2",
          NonfungiblePositionManager:
            "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
          MixedRouteQuoterV1: "0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86",
          QuoterV2: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
          Quoter: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997", // QuoterV2...
          TickLens: "0x9a489505a00cE272eAa5e07Dba6491314CaE3796",
          TokenValidator: "0x864ED564875BdDD6F421e226494a0E7c071C06f8",
          PancakeInterfaceMulticall:
            "0xac1cE734566f390A94b00eb9bf561c2625BF44ea",
          SmartRouterV3: "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4",

          UniswapV3Factory: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
        },
        bsc1: {
          PancakeV3Factory: "0xd5363C30A47b4e4BdDfa5be8Ab7d3afFA9B493E7",
        },
      },
      _info: null,

      Pool,
      Position,

      _tokens: null,
      account: null,
      _factory: null,
      _positionManager: null,
      _quoter: null,
      _router2: null,

      FEE_RATE_K: 1e6,
      tolerance: 0.003,

      _reserveBalances: null,
      deadlineMins: 30,
    });
  }
  get defid() {
    return cutil.a(this._defid) ? this._defid : this.chain.symbol;
  }
  set defid(defid) {
    this._defid = defid;
  }
  deadline(now) {
    let defi = this;
    if (cutil.na(now)) {
      now = Date.now();
    }
    return Math.floor(new Date(now).getTime() / 1000 + 60 * defi.deadlineMins);
  }
  get info() {
    if (!this._info) {
      this._info = cutil.clone(this.infos[this.defid] || this.infos[""]);
    }
    return this._info;
  }
  set info(info) {
    this._info = info;
  }
  get addressFactory() {
    return this.info["UniswapV3Factory"];
  }
  set addressFactory(addressFactory) {
    this.info["UniswapV3Factory"] = addressFactory;
  }
  get addressPositionManager() {
    return this.info["NonfungiblePositionManager"];
  }
  set addressPositionManager(addressPositionManager) {
    this.info["NonfungiblePositionManager"] = addressPositionManager;
  }
  get addressQuoter() {
    return this.info["Quoter"];
  }
  set addressQuoter(addressQuoter) {
    this.info["Quoter"] = addressQuoter;
  }
  get addressRouter2() {
    return this.info["SwapRouter02"];
  }
  set addressRouter2(addressRouter2) {
    this.info["SwapRouter02"] = addressRouter2;
  }
  get factory() {
    let defi = this;
    if (!defi._factory) {
      let { account, addressFactory: address } = defi;
      defi._factory = defi.contract({ address, account });
    }
    return defi._factory;
  }
  set factory(factory) {
    let defi = this;
    defi._factory = factory;
  }
  get positionManager() {
    let defi = this;
    if (!defi._positionManager) {
      let { account, addressPositionManager: address } = defi;
      defi._positionManager = defi.contract({ address, account });
    }
    return defi._positionManager;
  }
  set positionManager(positionManager) {
    let defi = this;
    defi._positionManager = positionManager;
  }
  get quoter() {
    let defi = this;
    if (!defi._quoter) {
      let { account, addressQuoter: address } = defi;
      defi._quoter = defi.contract({ address, account });
    }
    return defi._quoter;
  }
  set quoter(quoter) {
    let defi = this;
    defi._quoter = quoter;
  }
  get router2() {
    let defi = this;
    if (!defi._router2) {
      let { account, addressRouter2: address } = defi;
      defi._router2 = defi.contract({ address, account });
    }
    return defi._router2;
  }
  set router2(router2) {
    let defi = this;
    defi._router2 = router2;
  }
  get reserveBalances() {
    if (!this._reserveBalances) {
      this._reserveBalances = {
        [this.chain.wtok]: 0.25,
      };
    }
    return this._reserveBalances;
  }
  set reserveBalances(reserveBalances) {
    this._reserveBalances = reserveBalances;
  }
  get reserveTokBalance() {
    return this.reserveBalances[this.chain.wtok];
  }
  set reserveTokBalance(reserveTokBalance) {
    this.reserveBalances[this.chain.wtok] = reserveTokBalance;
  }
  reserveBalance(tokenId) {
    return this.reserveBalances[tokenId] || 0;
  }
  get tokens() {
    if (!this._tokens) {
      this._tokens = {};
    }
    return this._tokens;
  }
  set tokens(tokens) {
    this._tokens = tokens;
  }
  token(arg) {
    let defi = this;
    let { account } = defi;
    let { chain } = defi;
    if (cutil.isString(arg)) {
      arg = { id: arg };
    }
    arg = { account, ...cutil.asObject(arg) };
    let { id: tokenId } = arg;
    if (!tokenId) {
      tokenId = chain.tokenId(arg.address);
    }
    return tokenId in defi.tokens
      ? defi.tokens[tokenId]
      : (defi.tokens[tokenId] = super.token(arg));
  }
  pool(arg) {
    let defi = this;
    let { Pool } = defi;
    arg = { defi, ...cutil.asObject(arg) };
    return new Pool(arg);
  }
  position(arg) {
    let defi = this;
    let { Position } = defi;
    arg = { defi, ...cutil.asObject(arg) };
    return new Position(arg);
  }
  feeToRate(fee) {
    return cutil.asNumber(fee) / this.FEE_RATE_K;
  }
  rateToFee(rate) {
    return cutil.asInteger(rate * this.FEE_RATE_K);
  }
  pathFromPools(pools) {
    let p = [
      "0x",
      pools[0].tokenA.address.toLowerCase().substring(2),
      ...pools.map(
        (pool) =>
          `${cutil.asInteger(pool.fee).toString(16).toLowerCase().padStart(6, "0")}${pool.tokenB.address.toLowerCase().substring(2)}`,
      ),
    ].join("");
    return p;
  }
  pathFromTokenIdsAndFees(data) {
    let defi = this;
    let { chain } = defi;

    let p = chain.tokenAddress(data[0]).toLowerCase();
    let n = cutil.asInteger(data.length / 2);
    for (let i = 0; i < n; i++) {
      p += cutil
        .asInteger(defi.rateToFee(data[2 * i + 1]))
        .toString(16)
        .toLowerCase()
        .padStart(6, "0");
      p += chain
        .tokenAddress(data[2 * i + 2])
        .toLowerCase()
        .substring(2);
    }
    return p;
  }
  async toGetWTokAddress() {
    let defi = this;
    let { positionManager } = defi;
    await positionManager.toGetAbi();
    let address = await positionManager.toCallRead("WETH9");
    return address;
  }
  async toGetPositionCount() {
    let defi = this;
    let { positionManager } = defi;
    let { account } = positionManager;
    let { address } = account;

    await positionManager.toGetAbi();
    let balance = await positionManager.toCallRead("balanceOf", address);
    balance = cutil.asNumber(balance);
    return balance;
  }
  async toGetPositionId(index) {
    let defi = this;
    let { positionManager } = defi;
    let { account } = defi;
    let { address } = account;

    await positionManager.toGetAbi();
    let id = await positionManager.toCallRead(
      "tokenOfOwnerByIndex",
      address,
      index,
    );
    return id;
  }
  async toGetTickSpacingForFeeRate(feeRate) {
    let defi = this;
    let { factory } = defi;
    await factory.toGetAbi();
    let tickSpacing = await factory.toCallRead(
      "feeAmountTickSpacing",
      defi.rateToFee(feeRate),
    );
    return cutil.asNumber(tickSpacing);
  }
  async toGetNearestTick(tick, feeRate) {
    let defi = this;
    let tickSpacing = await defi.toGetTickSpacingForFeeRate(feeRate);
    return d(tick).div(tickSpacing).round().mul(tickSpacing).toFixed(0);
  }
  async toGetPoolAddress(tokenIdA, tokenIdB, feeRate) {
    let defi = this;
    let { account } = defi;
    let { factory } = defi;

    let tokenA = defi.tkn({ id: tokenIdA, account });
    let tokenB = defi.tkn({ id: tokenIdB, account });

    await factory.toGetAbi();

    let address = await factory.toCallRead(
      "getPool",
      tokenA.address,
      tokenB.address,
      defi.rateToFee(feeRate),
    );
    return address;
  }
  async toGetPool(tokenIdA, tokenIdB, feeRate) {
    let defi = this;
    let { Pool } = defi;
    let { account } = defi;

    let tokenA = defi.tkn({ id: tokenIdA, account });
    let tokenB = defi.tkn({ id: tokenIdB, account });

    let address = await defi.toGetPoolAddress(tokenIdA, tokenIdB, feeRate);

    let pool = await defi.toGetPoolByAddress(address);

    return cutil.assign(pool, {
      tokenIdA,
      tokenIdB,
      feeRate,
      tokenA,
      tokenB,
    });
  }
  async toGetPoolByAddress(address) {
    let defi = this;
    let { Pool } = defi;
    let { chain } = defi;
    let { account } = defi;

    let contract = defi.contract({ address, account });
    await contract.toGetAbi(abiPool);

    let [
      // immutables
      addressFactory,
      addressToken0,
      addressToken1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
      // state
      feeGrowthGlobal0X128,
      feeGrowthGlobal1X128,
      liquidity,
      slot0,
    ] = await Promise.all([
      contract.toCallRead("factory"),
      contract.toCallRead("token0"),
      contract.toCallRead("token1"),
      contract.toCallRead("fee"),
      contract.toCallRead("tickSpacing"),
      contract.toCallRead("maxLiquidityPerTick"),
      contract.toCallRead("feeGrowthGlobal0X128"),
      contract.toCallRead("feeGrowthGlobal1X128"),
      contract.toCallRead("liquidity"),
      contract.toCallRead("slot0"),
    ]);
    
    maxLiquidityPerTick = d(maxLiquidityPerTick).toFixed(0);
    feeGrowthGlobal0X128 = d(feeGrowthGlobal0X128).toFixed(0);
    feeGrowthGlobal1X128 = d(feeGrowthGlobal1X128).toFixed(0);
    liquidity = d(liquidity).toFixed(0);
    
    let {
      sqrtPriceX96,
      tick,
      observationIndex,
      observationCardinality,
      observationCardinalityNext,
      feeProtocol,
      unlocked,
    } = slot0;
    
    sqrtPriceX96 = d(sqrtPriceX96).toFixed(0);
    tick = d(tick).toFixed(0);
    observationIndex = d(observationIndex).toFixed(0);
    observationCardinality = d(observationCardinality).toFixed(0);
    observationCardinalityNext = d(observationCardinalityNext).toFixed(0);
    feeProtocol = d(feeProtocol).toFixed(0);

    let token0 = defi.tkn({ account, address: addressToken0 });
    let token1 = defi.tkn({ account, address: addressToken1 });
    let tokenId0 = token0.id;
    let tokenId1 = token1.id;

    try {
      await token0.toGetDecimals();
    } catch (e) {
      console.log(`Error in getting decimals for ${token0.address}`);
      throw e;
    }
    try {
      await token1.toGetDecimals();
    } catch (e) {
      console.log(`Error in getting decimals for ${token1.address}`);
      throw e;
    }

    return new Pool({
      defi,
      address,
      contract,
      token0,
      token1,
      tokenId0,
      tokenId1,
      // immutables
      addressFactory,
      addressToken0,
      addressToken1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
      // state
      feeGrowthGlobal0X128,
      feeGrowthGlobal1X128,
      liquidity,
      slot0,
      sqrtPriceX96,
      tick,
      observationIndex,
      observationCardinality,
      observationCardinalityNext,
      feeProtocol,
      unlocked,
    });
  }
  async toCreatePool(tokenIdA, tokenIdB, feeRate) {
    let defi = this;
    let { account } = defi;
    let { factory } = defi;

    let tokenA = defi.tkn({ id: tokenIdA, account });
    let tokenB = defi.tkn({ id: tokenIdB, account });

    await factory.toGetAbi();
    let address = await factory.toCallRead(
      "createPool",
      tokenA.address,
      tokenB.address,
      defi.rateToFee(feeRate),
    );

    return address;
  }
  async toGetPositionAt(index) {
    let defi = this;

    let id = await defi.toGetPositionId(index);
    let position = await defi.toGetPosition(id);

    return cutil.assign(position, {
      index,
    });
  }
  async toGetPosition(id) {
    let defi = this;
    let { Position } = defi;
    let { chain } = defi;
    let { positionManager } = defi;

    await positionManager.toGetAbi();

    let {
      nonce,
      operator,
      token0: addressToken0,
      token1: addressToken1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tokensOwed0,
      tokensOwed1,
    } = await positionManager.toCallRead("positions", id);
    let tokenId0 = chain.tokenId(addressToken0);
    let tokenId1 = chain.tokenId(addressToken1);

    let pool = await defi.toGetPool(tokenId0, tokenId1, defi.feeToRate(fee));
    let {
      feeGrowthOutside0X128: feeGrowthOutside0X128Lower,
      feeGrowthOutside1X128: feeGrowthOutside1X128Lower,
    } = await pool.contract.toCallRead("ticks", cutil.asNumber(tickLower));
    let {
      feeGrowthOutside0X128: feeGrowthOutside0X128Upper,
      feeGrowthOutside1X128: feeGrowthOutside1X128Upper,
    } = await pool.contract.toCallRead("ticks", cutil.asNumber(tickUpper));

    // console.log(`${"feeGrowthGlobal0X128".padEnd(30)}\t${pool.feeGrowthGlobal0X128.padStart(80)}`);
    // console.log(`${"feeGrowthOutside0X128Lower".padEnd(30)}\t${feeGrowthOutside0X128Lower.padStart(80)}`);
    // console.log(`${"feeGrowthOutside0X128Upper".padEnd(30)}\t${feeGrowthOutside0X128Upper.padStart(80)}`);
    // console.log(`${"feeGrowthInside0LastX128".padEnd(30)}\t${feeGrowthInside0LastX128.padStart(80)}`);
    // console.log(`${"liquidity".padEnd(30)}\t${liquidity.padStart(80)}`);
    // console.log(`${"tokensOwed0".padEnd(30)}\t${tokensOwed0.padStart(80)}`);

    // console.log(`${"feeGrowthGlobal1X128".padEnd(30)}\t${pool.feeGrowthGlobal1X128.padStart(80)}`);
    // console.log(`${"feeGrowthOutside1X128Lower".padEnd(30)}\t${feeGrowthOutside1X128Lower.padStart(80)}`);
    // console.log(`${"feeGrowthOutside1X128Upper".padEnd(30)}\t${feeGrowthOutside1X128Upper.padStart(80)}`);
    // console.log(`${"feeGrowthInside1LastX128".padEnd(30)}\t${feeGrowthInside1LastX128.padStart(80)}`);
    // console.log(`${"liquidity".padEnd(30)}\t${liquidity.padStart(80)}`);
    // console.log(`${"tokensOwed1".padEnd(30)}\t${tokensOwed1.padStart(80)}`);

    await pool.token0.toGetAbi();
    await pool.token0.toGetDecimals();
    await pool.token1.toGetAbi();
    await pool.token1.toGetDecimals();

    return new Position({
      defi,
      id,
      nonce,
      operator,
      addressToken0,
      addressToken1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      feeGrowthOutside0X128Lower,
      feeGrowthOutside0X128Upper,
      feeGrowthOutside1X128Lower,
      feeGrowthOutside1X128Upper,
      tokensOwed0,
      tokensOwed1,
      pool,
    });
  }
  async toGetPositions({
    tokenIdA,
    tokenIdB,
    feeRate,
    maxCount = 0,
    maxSearchCount = 0,
  }) {
    let defi = this;
    let { chain } = defi;
    let pool;
    if (tokenIdA && tokenIdB && !cutil.na(feeRate)) {
      pool = await defi.toGetPool(tokenIdA, tokenIdB, feeRate);
    }
    let positionCount = await defi.toGetPositionCount();
    maxSearchCount ||= positionCount;
    let result = [];
    for (let i = 0; i < maxSearchCount; i++) {
      let index = positionCount - 1 - i;
      let position = await defi.toGetPositionAt(index);
      if (!pool || chain.eq(position.pool.address, pool.address)) {
        result.push(position);
        if (result.length === maxCount) {
          break;
        }
      }
    }
    return result;
  }
  async toMintPosition({
    tokenIdA,
    tokenIdB,
    feeRate,
    priceLower,
    priceUpper,
    diffTickLower,
    diffTickUpper,
    tickLower,
    tickUpper,
    tickWidth,
    amountA,
    amountB,
    amountA_,
    amountB_,
    totalA,
    totalB,
    totalA_,
    totalB_,
    recipient,
    dontWrap = false,
    toAsk = null,
  }) {
    let defi = this;
    let { chain } = defi;
    let { positionManager } = defi;
    let { account } = defi;
    let { address } = account;

    await positionManager.toGetAbi();

    let calls = [];

    let pool = await defi.toGetPool(tokenIdA, tokenIdB, feeRate);
    let [
      amount0,
      amount1,
      amount0_,
      amount1_,
      total0,
      total1,
      total0_,
      total1_,
    ] = chain.eq(pool.tokenA.address, pool.token0.address)
      ? [amountA, amountB, amountA_, amountB_, totalA, totalB, totalA_, totalB_]
      : [
          amountB,
          amountA,
          amountB_,
          amountA_,
          totalB,
          totalA,
          totalB_,
          totalA_,
        ];
    let {
      addressToken0,
      addressToken1,
      token0: { id: tokenId0, decimals: decimals0 },
      token1: { id: tokenId1, decimals: decimals1 },
      fee,
      price,
      tick,
    } = pool;
    if (cutil.a(diffTickLower)) {
      tickLower = d(tick).plus(diffTickLower).toFixed(0);
    }
    if (cutil.a(diffTickUpper)) {
      tickUpper = d(tick).plus(diffTickUpper).toFixed(0);
    }
    if (cutil.na(tickLower) && !cutil.na(priceLower)) {
      tickLower = d(priceLower)
        .mul(10 ** (decimals1 - decimals0))
        .log()
        .div(d(1.0001).log())
        .toFixed(0);
    }
    if (cutil.na(tickUpper) && !cutil.na(priceUpper)) {
      tickUpper = d(priceUpper)
        .mul(10 ** (decimals1 - decimals0))
        .log()
        .div(d(1.0001).log())
        .toFixed(0);
    }
    if (!cutil.na(tickWidth)) {
      if (cutil.na(tickLower) && !cutil.na(tickUpper)) {
        tickLower = d(tickUpper).minus(tickWidth).toFixed(0);
      } else if (cutil.na(tickUpper) && !cutil.na(tickLower)) {
        tickUpper = d(tickLower).plus(tickWidth).toFixed(0);
      } else if (cutil.na(tickLower) && cutil.na(tickUpper)) {
        tickLower = d(tick).minus(d(tickWidth).div(2)).toFixed(0);
        tickUpper = d(tick).plus(d(tickWidth).div(2)).toFixed(0);
      }
    }

    tickLower = pool.getNearestTick(tickLower);
    tickUpper = pool.getNearestTick(tickUpper);
    console.log({ tickLower, tick, tickUpper });

    console.log({ priceLower, price, priceUpper });
    priceLower = d(1.0001)
      .pow(tickLower)
      .div(10 ** (decimals1 - decimals0))
      .toNumber();
    priceUpper = d(1.0001)
      .pow(tickUpper)
      .div(10 ** (decimals1 - decimals0))
      .toNumber();
    console.log({ priceLower, priceUpper });

    if (cutil.na(amount0_) && !cutil.na(amount0)) {
      amount0_ = d(amount0)
        .mul(10 ** decimals0)
        .toFixed(0);
    }
    if (cutil.na(amount1_) && !cutil.na(amount1)) {
      amount1_ = d(amount1)
        .mul(10 ** decimals1)
        .toFixed(0);
    }

    if (!cutil.na(amount0_) && d(amount0_).lte(0)) {
      let balance0_ =
        !dontWrap && chain.isWTok(addressToken0)
          ? await account.toGetBalance_()
          : await account.toGetTokenBalance_(tokenId0);
      amount0_ = d(balance0_).plus(amount0_).toFixed(0);
    }
    if (!cutil.na(amount1_) && d(amount1_).lte(0)) {
      let balance1_ =
        !dontWrap && chain.isWTok(addressToken1)
          ? await account.toGetBalance_()
          : await account.toGetTokenBalance_(tokenId1);
      amount1_ = d(balance1_).plus(amount1_).toFixed(0);
    }

    if (cutil.na(total0_) && !cutil.na(total0)) {
      total0_ = d(total0)
        .mul(10 ** decimals0)
        .toFixed(0);
    }
    if (cutil.na(total1_) && !cutil.na(total1)) {
      total1_ = d(total1)
        .mul(10 ** decimals1)
        .toFixed(0);
    }

    let price_$ = d(price).div(10 ** (decimals1 - decimals0));
    let tck = d(tick).lt(tickLower)
      ? tickLower
      : d(tick).gt(tickUpper)
        ? tickUpper
        : tick;
    // amount1_:amount0_
    let ratio_$ = d(1.0001)
      .pow(tck * +0.5)
      .minus(d(1.0001).pow(tickLower * +0.5))
      .div(
        d(1.0001)
          .pow(tck * -0.5)
          .minus(d(1.0001).pow(tickUpper * -0.5)),
      );

    if (!cutil.na(amount0_) && cutil.na(amount1_)) {
      amount1_ = ratio_$.eq(Infinity)
        ? "0"
        : d(amount0_).mul(ratio_$).toFixed(0);
    } else if (cutil.na(amount0_) && !cutil.na(amount1_)) {
      amount0_ = ratio_$.eq(0) ? "0" : d(amount1_).div(ratio_$).toFixed(0);
    } else if (cutil.na(amount0_) && cutil.na(amount1_)) {
      if (!cutil.na(total0_)) {
        amount0_ = d(total0_)
          .div(d(1).plus(ratio_$.div(price_$)))
          .toFixed(0);
        amount1_ = d(amount0_).mul(ratio_$).toFixed(0);

        console.log(`check:`);
        console.log(`ratio:`);
        console.log(d(amount1_).div(amount0_).toFixed(6));
        console.log(ratio_$.toFixed(6));
        console.log(`total:`);
        console.log(d(amount0_).plus(d(amount1_).div(price_$)).toFixed(6));
        console.log(d(total0_).toFixed(6));
      } else if (!cutil.na(total1_)) {
        amount0_ = d(total1_).div(ratio_$.plus(price_$)).toFixed(0);
        amount1_ = d(amount0_).mul(ratio_$).toFixed(0);
      } else if (ratio_$.eq(0)) {
        amount0_ = d(1).div(defi.tolerance).toFixed(0);
        amount1_ = d(0).toFixed(0);
      } else if (ratio_$.eq(Infinity)) {
        amount0_ = d(0).toFixed(0);
        amount1_ = d(1).div(defi.tolerance).toFixed(0);
      } else if (ratio_$.gt(1)) {
        amount0_ = d(1).div(defi.tolerance).toFixed(0);
        amount1_ = d(amount0_).mul(ratio_$).toFixed(0);
      } else {
        amount1_ = d(1).div(defi.tolerance).toFixed(0);
        amount0_ = d(amount1_).div(ratio_$).toFixed(0);
      }
    }

    console.log({ amount0_, amount1_ });
    console.log({ amount0, amount1 });

    for (let [token, amount_] of [
      [pool.token0, amount0_],
      [pool.token1, amount1_],
    ]) {
      let allowance_ = await token.toGetAllowance_(
        account.address,
        positionManager.address,
      );
      if (d(allowance_).lt(amount_)) {
        await token.toApprove_(
          positionManager.address,
          d(2).pow(256).minus(1).toFixed(0),
        );
      }
    }

    let amount0Desired = amount0_;
    let amount1Desired = amount1_;
    let amount0Min = d(amount0Desired)
      .mul(1 - defi.tolerance)
      .toFixed(0);
    let amount1Min = d(amount1Desired)
      .mul(1 - defi.tolerance)
      .toFixed(0);
    if (cutil.na(recipient)) {
      recipient = address;
    }
    let deadline = defi.deadline();
    let value = "0";
    if (!dontWrap && chain.isWTok(addressToken0)) {
      value = amount0Desired;
    } else if (!dontWrap && chain.isWTok(addressToken1)) {
      value = amount1Desired;
    }
    calls.push({
      method:
        "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
      params: [
        [
          addressToken0,
          addressToken1,
          fee,
          tickLower,
          tickUpper,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
          recipient,
          deadline,
        ],
      ],
    });
    console.log(
      JSON.stringify(
        {
          method:
            "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
          params: [
            [
              addressToken0,
              addressToken1,
              fee,
              tickLower,
              tickUpper,
              amount0Desired,
              amount1Desired,
              amount0Min,
              amount1Min,
              recipient,
              deadline,
            ],
          ],
        },
        null,
        "\t",
      ),
    );
    if (chain.isWTok(addressToken0) || chain.isWTok(addressToken1)) {
      calls.push({ method: "refundETH", params: [] });
    }
    let method;
    let params;
    if (calls.length === 1) {
      ({ method, params } = calls[0]);
    } else {
      method = "multicall(bytes[])";
      params = [
        calls.map(({ method, params }) =>
          positionManager.callData(method, ...params),
        ),
      ];
    }
    let data = positionManager.callData(method, ...params);
    if (cutil.a(toAsk)) {
      let result = await toAsk();
      if (!result) {
        throw new Error(`Cancelled by user!`);
      }
    }
    let receipt = await positionManager.toSendData(data, value);
    let resProcessTxMint = await defi.toProcessTxMint({ receipt });
    let { hash, tokenId, liquidity } = resProcessTxMint;
    ({ amount0_, amount1_ } = resProcessTxMint);
    amount0 = d(amount0_)
      .div(10 ** decimals0)
      .toNumber();
    amount1 = d(amount1_)
      .div(10 ** decimals1)
      .toNumber();
    console.log({
      hash,
      tokenId,
      tickLower,
      tickUpper,
      liquidity,
      tokenId0,
      tokenId1,
      amount0,
      amount1,
      amount0_,
      amount1_,
    });
    return {
      receipt,
      hash,
      tokenId,
      liquidity,
      tickLower,
      tickUpper,
      tokenId0,
      tokenId1,
      amount0,
      amount1,
      amount0_,
      amount1_,
    };
  }
  async toQuote({
    pathInfo,
    amountIn,
    amountIn_,
    amountOut,
    amountOut_,
    priceExternal,
  }) {
    let defi = this;
    let { quoter } = defi;

    await quoter.toGetAbi();
    let path = defi.pathFromTokenIdsAndFees(pathInfo);
    let tokenIn = defi.tkn(pathInfo[0]);
    let tokenOut = defi.tkn(pathInfo[pathInfo.length - 1]);
    await tokenIn.toGetAbi();
    await tokenIn.toGetDecimals();
    await tokenOut.toGetAbi();
    await tokenOut.toGetDecimals();
    if (amountIn && !amountIn_) {
      amountIn_ = tokenIn.wrapNumber(amountIn);
    } else if (amountIn_ && !amountIn) {
      amountIn = tokenIn.unwrapNumber(amountIn_);
    }
    if (amountOut && !amountOut_) {
      amountOut_ = tokenOut.wrapNumber(amountOut);
    } else if (amountOut_ && !amountOut) {
      amountOut = tokenOut.unwrapNumber(amountOut_);
    }
    if (amountIn_) {
      amountOut_ = await quoter.toCallRead("quoteExactInput", path, amountIn_);
      amountOut = tokenOut.unwrapNumber(amountOut_);
    } else if (amountOut_) {
      amountIn_ = await quoter.toCallRead("quoteExactOutput", path, amountOut_);
      amountIn = tokenOut.unwrapNumber(amountIn_);
    }

    let price = amountOut / amountIn;
    let slippage = 1 - price / priceExternal;
    return { amountIn, amountIn_, amountOut, amountOut_, price, slippage };
  }
  async toSwap({
    pathInfo,
    amountIn,
    amountIn_,
    amountOut,
    amountOut_,
    priceExternal,
    dontWrap,
  }) {
    let defi = this;
    let { chain } = defi;
    let { account } = defi;
    let { address } = account;
    let { router2 } = defi;
    console.log(`defi.tolerance: ${defi.tolerance}`);

    let isForward = amountIn || amountIn_;

    let method;
    let params;
    let value = 0;

    let amountMinimum;

    await router2.toGetAbi();
    let path = defi.pathFromTokenIdsAndFees(pathInfo);
    let tokenIn = defi.tkn(pathInfo[0]);
    let tokenOut = defi.tkn(pathInfo[pathInfo.length - 1]);
    if (!isForward) {
      [tokenIn, tokenOut] = [tokenOut, tokenIn];
    }
    await tokenIn.toGetAbi();
    await tokenIn.toGetDecimals();
    await tokenOut.toGetAbi();
    await tokenOut.toGetDecimals();
    if (amountIn && !amountIn_) {
      amountIn_ = tokenIn.wrapNumber(amountIn);
    } else if (amountIn_ && !amountIn) {
      amountIn = tokenIn.unwrapNumber(amountIn_);
    }
    if (amountOut && !amountOut_) {
      amountOut_ = tokenOut.wrapNumber(amountOut);
    } else if (amountOut_ && !amountOut) {
      amountOut = tokenOut.unwrapNumber(amountOut_);
    }
    let recipient = address;
    let priceExternal_$ = d(priceExternal).mul(
      d(10).pow(tokenOut.decimals - tokenIn.decimals),
    );
    if (amountIn_) {
      let amountOutMinimum_ = d(amountIn_)
        .mul(priceExternal_$)
        .mul(d(1 - defi.tolerance))
        .toFixed(0);
      if (!dontWrap && chain.isWTok(tokenIn)) {
        value = amountIn_;
      }
      method = "exactInput";
      params = [[path, recipient, amountIn_, amountOutMinimum_]];
      if (!dontWrap && chain.isWTok(tokenOut)) {
        amountMinimum = amountOutMinimum_;
        params[0][1] = chain.addressTwo;
      }
    } else if (amountOut_) {
      let amountInMaximum_ = d(amountOut_)
        .div(priceExternal_$)
        .mul(d(1 + defi.tolerance))
        .toFixed(0);
      if (!dontWrap && chain.isWTok(tokenIn)) {
        value = amountInMaximum_;
      }
      method = "exactOutput";
      params = [[path, recipient, amountOut_, amountInMaximum_]];
      if (!dontWrap && chain.isWTok(tokenOut)) {
        amountMinimum = amountOut_;
        params[0][1] = chain.addressTwo;
      }
    }

    if (!chain.isWTok(tokenIn) || !dontWrap) {
      let amount_ =
        amountIn_ ||
        d(amountOut_)
          .div(priceExternal_$)
          .mul(d(1 + defi.tolerance))
          .toFixed(0);
      let allowance_ = await tokenIn.toGetAllowance_(
        account.address,
        router2.address,
      );
      if (d(allowance_).lt(amount_)) {
        console.log(`Approving ${tokenIn.id}`);
        await tokenIn.toApprove_(
          router2.address,
          d(2).pow(256).minus(1).toFixed(0),
        );
      }
    }

    if (!dontWrap && chain.isWTok(tokenOut)) {
      let calls = [];

      calls.push(router2.callData(method, ...params));
      calls.push(router2.callData("unwrapWETH9", amountMinimum, recipient));

      method = "multicall(bytes[])";
      params = [calls];
    }

    let data = router2.callData(method, ...params);
    let receipt = await router2.toSendData(data, value);

    let tokenIdIn;
    let tokenIdOut;
    for (let log of cutil.asArray(receipt.logs)) {
      log.dec = await defi.toDecodeLog(log);
      let {
        event: { name },
        address,
      } = log.dec;
      if (name === "Transfer") {
        let {
          decoded: { from, to, value },
        } = log.dec;
        if (from && to && value) {
          let tokenId = chain.tokenId(address);
          let token = defi.tkn(tokenId);
          let value_ = value;
          value = await token.toUnwrapNumber(value_);
          if (chain.eq(from, defi.account.address)) {
            tokenIdIn = tokenId;
            amountIn_ = value_;
            amountIn = value;
          } else if (chain.eq(to, defi.account.address)) {
            tokenIdOut = tokenId;
            amountOut_ = value_;
            amountOut = value;
          }
        }
      } else if (name === "Deposit" && chain.isWTok(address)) {
        let {
          decoded: { wad },
        } = log.dec;
        let token = defi.wtoken();
        let wad_ = wad;
        wad = await token.toUnwrapNumber(wad_);
        tokenIdIn = chain.wtok;
        amountIn_ = wad_;
        amountIn = wad;
      } else if (name === "Withdrawal" && chain.isWTok(address)) {
        let {
          decoded: { wad },
        } = log.dec;
        let token = defi.wtoken();
        let wad_ = wad;
        wad = await token.toUnwrapNumber(wad_);
        tokenIdOut = chain.wtok;
        amountOut_ = wad_;
        amountOut = wad;
      }
    }
    return {
      receipt,
      tokenIdIn,
      tokenIdOut,
      amountIn,
      amountIn_,
      amountOut,
      amountOut_,
    };
  }
  async toProcessTxMint({ hash, tx, receipt, recipient }) {
    let defi = this;
    let { chain } = defi;
    let { account } = defi;
    let { address } = account;
    let { positionManager } = defi;
    await positionManager.toGetAbi();
    let blockNumber;
    if (!recipient) {
      recipient = address;
    }
    if (!hash) {
      hash = tx?.hash || receipt.logs?.[0]?.transactionHash;
    }
    if (!tx) {
      tx = await chain.toGetTransaction(hash);
    }
    if (!tx) {
      throw new Error(`Transaction not found.`);
    }
    if (!receipt) {
      receipt = await chain.toGetTransactionReceipt(hash);
    }
    if (!receipt) {
      throw new Error(`Transaction is pending.`);
    }
    ({ blockNumber } = tx || receipt);
    if (cutil.na(blockNumber)) {
      throw new Error(`Transaction is pending.`);
    }
    let tokenId;
    let liquidity;
    let amount0_;
    let amount1_;
    for (let log of receipt.logs) {
      log.dec = await defi.toDecodeLog(log);
      let {
        event: { name },
        address,
        decoded,
      } = log.dec;
      if (chain.eq(address, positionManager.address) && name === "Transfer") {
        let { from, to } = decoded;
        if (chain.eq(from, chain.addressZero) && chain.eq(to, recipient)) {
          ({ tokenId } = decoded);
        }
      }
      if (
        chain.eq(address, positionManager.address) &&
        name === "IncreaseLiquidity"
      ) {
        let { tokenId: id } = decoded;
        if (tokenId === id) {
          ({ liquidity } = decoded);
          ({ amount0: amount0_ } = decoded);
          ({ amount1: amount1_ } = decoded);
        }
      }
    }
    return { hash, tx, receipt, tokenId, liquidity, amount0_, amount1_ };
  }
  async toProcessSwapTx({ hash, tx, receipt }) {
    let defi = this;
    let { chain } = defi;
    if (!tx) {
      tx = await web3.eth.getTransaction(hash);
      if (!tx) {
        throw new Error(`Transaction not found.`);
      }
    }
    // console.log(JSON.stringify(tx, null, "\t"));
    let { blockNumber } = tx;
    if (cutil.na(blockNumber)) {
      throw new Error(`Transaction is pending.`);
    }
    if (!receipt) {
      receipt = await chain.toGetTransactionReceipt(hash);
    }
    // console.log(JSON.stringify(receipt, null, "\t"));
    let tokenIdIn;
    let tokenIdOut;
    let amountIn;
    let amountOut;
    for (let log of cutil.asArray(receipt.logs)) {
      try {
        log.dec = await defi.toDecodeLog(log);
        // console.log(JSON.stringify(log, null, "\t"));
        let {
          event: { name },
          address,
        } = log.dec;
        if (name === "Transfer") {
          let {
            decoded: { from, to, value },
          } = log.dec;
          if (from && to && value) {
            let tokenId = chain.tokenId(address);
            let token = defi.tkn(tokenId);
            value = await token.toUnwrapNumber(value);
            if (chain.eq(from, defi.account.address)) {
              tokenIdIn = tokenId;
              amountIn = value;
            } else if (chain.eq(to, defi.account.address)) {
              tokenIdOut = tokenId;
              amountOut = value;
            } else if (
              chain.eq(from, chain.addressZero) &&
              chain.eq(to, tx.to)
            ) {
              // arbitrum, etc
              tokenIdIn = chain.wtok;
              amountIn = value;
            }
          }
        } else if (name === "Deposit" && chain.isWTok(address)) {
          let {
            decoded: { wad },
          } = log.dec;
          let token = defi.wtoken();
          wad = await token.toUnwrapNumber(wad);
          tokenIdIn = chain.wtok;
          amountIn = wad;
        } else if (name === "Withdrawal" && chain.isWTok(address)) {
          let {
            decoded: { wad },
          } = log.dec;
          let token = defi.wtoken();
          wad = await token.toUnwrapNumber(wad);
          tokenIdOut = chain.wtok;
          amountOut = wad;
        }
      } catch (e) {
        /*
        console.log(
          `Error in defi.toProcessSwapTx:\n${JSON.stringify(log, null, "\t")}`,
        );
        */
        console.log(e.message);
      }
    }
    return { tx, receipt, tokenIdIn, tokenIdOut, amountIn, amountOut };
  }
  async toQuoteRoutes({
    pathInfos,
    amountIn,
    amountIn_,
    amountOut,
    amountOut_,
    priceExternal,
  }) {
    let defi = this;
    let { account } = defi;
    let { address } = account;
    let { quoter } = defi;

    await quoter.toGetAbi();

    let pathInfo = pathInfos[0];
    let tokenIn = defi.tkn(pathInfo[0]);
    let tokenOut = defi.tkn(pathInfo[pathInfo.length - 1]);
    await tokenIn.toGetAbi();
    await tokenIn.toGetDecimals();
    await tokenOut.toGetAbi();
    await tokenOut.toGetDecimals();
    // let priceExternal_ = d(priceExternal).mul(d(10).pow(tokenOut.decimals - tokenIn.decimals));
    if (amountIn && !amountIn_) {
      amountIn_ = tokenIn.wrapNumber(amountIn);
    } else if (amountIn_ && !amountIn) {
      amountIn = tokenIn.unwrapNumber(amountIn_);
    }
    if (amountOut && !amountOut_) {
      amountOut_ = tokenOut.wrapNumber(amountOut);
    } else if (amountOut_ && !amountOut) {
      amountOut = tokenOut.unwrapNumber(amountOut_);
    }
    let isForward = !!amountIn_;
    let routes = pathInfos.map((pathInfo) => ({ pathInfo }));

    for (let route of routes) {
      try {
        let { pathInfo } = route;
        let path = defi.pathFromTokenIdsAndFees(pathInfo);
        if (isForward) {
          amountOut_ = await quoter.toCallRead(
            "quoteExactInput",
            path,
            amountIn_,
          );
          // QuoterV2
          if (cutil.isObject(amountOut_)) {
            amountOut_ = amountOut_["amountOut"];
          }
          amountOut = tokenOut.unwrapNumber(amountOut_);
        } else {
          // ??????
          pathInfo = pathInfo.reverse();
          path = defi.pathFromTokenIdsAndFees(pathInfo);
          amountIn_ = await quoter.toCallRead(
            "quoteExactOutput",
            path,
            amountOut_,
          );
          // QuoterV2
          if (cutil.isObject(amountIn_)) {
            amountIn_ = amountIn_["amountIn"];
          }
          amountIn = tokenIn.unwrapNumber(amountIn_);
        }

        let price = amountOut / amountIn;
        let slippage = 1 - price / priceExternal;
        cutil.assign(route, {
          path,
          amountIn,
          amountIn_,
          amountOut,
          amountOut_,
          price,
          slippage,
        });
      } catch (e) {
        // console.log(e);
        // low liquidity paths cause errors
        console.log(`Error in quoting path '${route.pathInfo.join(":")}'`);
      }
    }
    routes = routes.filter(({ path }) => !!path);
    routes.sort(({ slippage: a }, { slippage: b }) => a - b);
    return routes;
  }
  sort({ tokenIdA, tokenIdB }) {
    let defi = this;
    let { chain } = defi;
    let forward = chain.lt(
      chain.tokenAddress(tokenIdA),
      chain.tokenAddress(tokenIdB),
    );
    let [tokenId0, tokenId1] = forward
      ? [tokenIdA, tokenIdB]
      : [tokenIdB, tokenIdA];
    return { tokenId0, tokenId1, forward };
  }
}

export { DeFi };
