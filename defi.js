import d from "decimal.js";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {chainer} from "@ghasemkiani/evm";

import abiPool from "./abi/pool.json" assert {type: "json"};

const PRECISION = 100;
if (d.precision < PRECISION) {
	d.set({precision: PRECISION});
}

class Pool extends Obj {
	static {
		cutil.extend(this.prototype, {
			defi: null,
			tokenIdA: null,
			tokenIdB: null,
			tokenA: null,
			tokenB: null,
			token0: null,
			token1: null,
			tokenId0: null,
			tokenId1: null,
			address: null,
			contract: null,
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
	get feeRate() {
		return cutil.isNil(this.fee) ? null : this.defi.feeToRate(this.fee);
	}
	set feeRate(feeRate) {
		this.fee = cutil.isNil(feeRate) ? null : this.defi.rateToFee(feeRate);
	}
	get symbol() {
		let {tokenId0, tokenId1, feeRate} = this;
		return [tokenId0, tokenId1, feeRate].find(x => cutil.isNil(x)) ? null : `${tokenId0}/${tokenId1}@${cutil.asString(feeRate)}`;
	}
	set symbol(symbol) {
		if (cutil.isNil(symbol)) {
			this.tokenId0 = null;
			this.tokenId1 = null;
			this.feeRate = null;
		} else {
			let [, tokenId0, tokenId1, feeRate] = /^(.*)\/(.*)@(.*)$/.exec(symbol);
			this.tokenId0 = tokenId0;
			this.tokenId1 = tokenId1;
			this.feeRate = feeRate;
		}
	}
	getNearestTick(tick) {
		let {tickSpacing} = this;
		return d(tick).div(tickSpacing).round().mul(tickSpacing).toFixed(0);
	}
	get price_$() {
		return d(1.0001).pow(this.tick);
	}
	get price_() {
		return this.price_$.toString();
	}
	get price$() {
		return this.price_$.mul(10 ** (this.token0.decimals - this.token1.decimals));
	}
	get price() {
		return this.price$.toNumber();
	}
}

class Position extends Obj {
	static {
		cutil.extend(this.prototype, {
			defi: null,
			pool: null,
			index: null,
			id: null,
			
			nonce: null,
			operator: null,
			addressToken0: null,
			addressToken1: null,
			fee: null,
			tickLower: null,
			tickUpper: null,
			liquidity: null,
			feeGrowthInside0LastX128: null,
			feeGrowthInside1LastX128: null,
			tokensOwed0: null,
			tokensOwed1: null,
			
			feeGrowthOutside0X128Lower: null,
			feeGrowthOutside1X128Lower: null,
			feeGrowthOutside0X128Upper: null,
			feeGrowthOutside1X128Upper: null,
		});
	}
	get tickWidth() {
		return d(this.tickUpper).minus(d(this.tickLower)).toNumber();
	}
	get max0_$() {
		return d(this.liquidity).mul(d(1.0001).pow(this.tickLower * -0.5).minus(d(1.0001).pow(this.tickUpper * -0.5)));
	}
	get max1_$() {
		return d(this.liquidity).mul(d(1.0001).pow(this.tickUpper * +0.5).minus(d(1.0001).pow(this.tickLower * +0.5)));
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
		return this.priceLower_$.mul(10 ** (this.pool.token0.decimals - this.pool.token1.decimals));
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
		return this.priceUpper_$.mul(10 ** (this.pool.token0.decimals - this.pool.token1.decimals));
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
			feeGrowthInside0X128$ = d(this.feeGrowthOutside0X128Lower).minus(d(this.feeGrowthOutside0X128Upper));
		} else if (d(this.pool.tick).gte(d(this.tickUpper))) {
			feeGrowthInside0X128$ = d(this.feeGrowthOutside0X128Upper).minus(d(this.feeGrowthOutside0X128Lower));
		} else {
			feeGrowthInside0X128$ = d(this.pool.feeGrowthGlobal0X128).minus(d(this.feeGrowthOutside0X128Lower)).minus(d(this.feeGrowthOutside0X128Upper));
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
			feeGrowthInside1X128$ = d(this.feeGrowthOutside1X128Lower).minus(d(this.feeGrowthOutside1X128Upper));
		} else if (d(this.pool.tick).gte(d(this.tickUpper))) {
			feeGrowthInside1X128$ = d(this.feeGrowthOutside1X128Upper).minus(d(this.feeGrowthOutside1X128Lower));
		} else {
			feeGrowthInside1X128$ = d(this.pool.feeGrowthGlobal1X128).minus(d(this.feeGrowthOutside1X128Lower)).minus(d(this.feeGrowthOutside1X128Upper));
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
		return d(1.0001).pow(tick * -0.5).minus(d(1.0001).pow(tickUpper * -0.5));
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
		return d(1.0001).pow(tick * +0.5).minus(d(1.0001).pow(tickLower * +0.5));
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
	get rr$() {
		return d.max(this.r0$.div(this.r1$), this.r1$.div(this.r0$));
	}
	get rr() {
		return this.rr$.toNumber();
	}
	async toCollect(recipient = null) {
		let position = this;
		let {defi} = position;
		let {chain} = defi;
		let {web3} = chain;
		let {id} = position;
		let {pool} = position;
		let {positionManager} = defi;
		let {account} = defi;
		let {address} = account;
		
		await positionManager.toGetAbi();
		let {abi} = positionManager;
		
		let tokenId = id.toString();
		if (!recipient) {
			recipient = address;
		}
		let amount0Max = d(2).pow(128).minus(1).toFixed(0);
		let amount1Max = d(2).pow(128).minus(1).toFixed(0);
		let result = await positionManager.toCallWrite("collect", [tokenId, recipient, amount0Max, amount1Max]);
		// console.log(JSON.stringify(result, null, "\t"));
		let collected0_ = null;
		let collected1_ = null;
		let collected0 = null;
		let collected1 = null;
		let itemEvent = abi.find(({type, name}) => type === "event" && name === "Collect");
		let dataEvent = web3.eth.abi.encodeEventSignature(itemEvent);
		let {logs} = result;
		let log = logs.find(({topics: [d, i]}) => d === dataEvent && parseInt(i) === parseInt(tokenId));
		if (log) {
			let {data: dataLog} = log;
			// first item is index_topic_1
			let decoded = web3.eth.abi.decodeParameters(itemEvent.inputs.map(({type}) => type).slice(1), dataLog);
			collected0_ = decoded[1];
			collected1_ = decoded[2];
			if (pool) {
				await pool.token0.toGetAbi();
				await pool.token0.toGetDecimals();
				await pool.token1.toGetAbi();
				await pool.token1.toGetDecimals();
				collected0 = pool.token0.unwrapNumber(collected0_);
				collected1 = pool.token1.unwrapNumber(collected1_);
				
			}
		}
		return {
			collected0_,
			collected1_,
			collected0,
			collected1,
		};
	}
	async toDecreaseLiquidity(ratio = 1, dontUnwrap = false) {
		let position = this;
		let {liquidity} = position;
		if (d(liquidity).gt(0)) {
			let calls = [];
			
			let {id: tokenId, amount0_, amount1_} = position;
			let {defi} = position;
			let {chain} = defi;
			let {account} = defi;
			let {address} = account;
			let recipient = address;
			let {positionManager} = defi;
			await positionManager.toGetAbi();
			let {abi} = positionManager;
			
			liquidity = d(liquidity).mul(ratio).toFixed(0);
			let amount0Min = d(amount0_).mul(ratio).mul(0.9).toFixed(0);
			let amount1Min = d(amount1_).mul(ratio).mul(0.9).toFixed(0);
			let deadline = defi.deadline();
			console.log(JSON.stringify({method: "decreaseLiquidity", params: {tokenId, liquidity, amount0Min, amount1Min, deadline}}));
			calls.push(positionManager.callData("decreaseLiquidity", [tokenId, liquidity, amount0Min, amount1Min, deadline]));
			
			let amount0Max = d(2).pow(128).minus(1).toFixed(0);
			let amount1Max = d(2).pow(128).minus(1).toFixed(0);
			calls.push(positionManager.callData("collect", [tokenId, dontUnwrap ? recipient : chain.addressZero, amount0Max, amount1Max]));
			
			if (!dontUnwrap) {
				let addressWTok = await defi.toGetWTokAddress();
				for (let [addr, fee_] of[
						[position.pool.token0.address, position.fee0_],
						[position.pool.token1.address, position.fee1_],
					]) {
					let amountMinimum = d(fee_).mul(0.999).toFixed(0);
					if (chain.eq(addr, addressWTok)) {
						calls.push(positionManager.callData("unwrapWETH9", amountMinimum, recipient));
					} else {
						calls.push(positionManager.callData("sweepToken", addr, amountMinimum, recipient));
					}
				}
			}
			
			let data = positionManager.callData("multicall", calls);
			let {hash} = await positionManager.toSendData(data);
			
			console.log(`decreaseLiquidity:\n${hash}`);
		}
	}
	async toProportionalize({amnt0_, amnt1_, priceExternal, pathInfos}) {
		let position = this;
		let {defi, amount0_$, amount1_$, pool: {price_$, feeRate, tokenId0, tokenId1, token0: {decimals: decimals0}, token1: {decimals: decimals1}}} = position;
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
			d(
				amnt1_$.mul(amount0_$)
			).minus(
				amnt0_$.mul(amount1_$)
			)
		).div(d(
			d(
				amount1_$
			).plus(
				price_$.mul(amount0_$)
			)
		));
		let delta1_$ = delta0_$.mul(price_$).mul(-1);
		let isForward = delta0_$.lt(0);
		let routes, route;
		if (isForward) {
			let amountIn_ = delta0_$.mul(-1).toFixed(0);
			// console.log({pathInfos, amountIn_, priceExternal});
			routes = await defi.toQuoteRoutes({pathInfos, amountIn_, priceExternal});
			route = routes[0];
			delta1_$ = d(route.amountOut_);
		} else {
			pathInfos = pathInfos.map(pathInfo => pathInfo.reverse());
			let amountIn_ = delta1_$.mul(-1).toFixed(0);
			// console.log({pathInfos, amountIn_, priceExternal: d(priceExternal).pow(-1).toNumber()});
			routes = await defi.toQuoteRoutes({pathInfos, amountIn_, priceExternal: d(priceExternal).pow(-1).toNumber()});
			route = routes[0];
			delta0_$ = d(route.amountOut_);
		}
		let delta0_ = delta0_$.abs().toFixed(0);
		let delta1_ = delta1_$.abs().toFixed(0);
		let amt0_ = amnt0_$.plus(delta0_$).toFixed(0);
		let amt1_ = amnt1_$.plus(delta1_$).toFixed(0);
		return {amt0_, amt1_, delta0_, delta1_, isForward, route, routes, priceExternal};
	}
}

class DeFi extends cutil.mixin(Obj, chainer) {
	static {
		cutil.extend(this.prototype, {
			infos: {
				"": {
					"UniswapV3Factory": "0x1F98431c8aD98523631AE4a59f267346ea31F984",
					"Multicall2": "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
					"ProxyAdmin": "0xB753548F6E010e7e680BA186F9Ca1BdAB2E90cf2",
					"TickLens": "0xbfd8137f7d1516D3ea5cA83523914859ec47F573",
					"Quoter": "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
					"SwapRouter": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
					"SwapRouter2": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
					"NFTDescriptor": "0x42B24A95702b9986e82d421cC3568932790A48Ec",
					"NonfungibleTokenPositionDescriptor": "0x91ae842A5Ffd8d12023116943e72A606179294f3",
					"TransparentUpgradeableProxy": "0xEe6A57eC80ea46401049E92587E52f5Ec1c24785",
					"NonfungiblePositionManager": "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
					"V3Migrator": "0xA5644E29708357803b5A882D272c41cC0dF92B34",
				},
				"celo": {
					"UniswapV3Factory": "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc",
					"Multicall2": "0x633987602DE5C4F337e3DbF265303A1080324204",
					"ProxyAdmin": "0xc1b262Dd7643D4B7cA9e51631bBd900a564BF49A",
					"TickLens": "0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D",
					"Quoter": "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8",
					"SwapRouter": "0x5615CDAb10dc425a742d643d949a7F474C01abc4",
					"NFTDescriptor": "0xa9Fd765d85938D278cb0b108DbE4BF7186831186",
					"NonfungibleTokenPositionDescriptor": "0x644023b316bB65175C347DE903B60a756F6dd554",
					"TransparentUpgradeableProxy": "0x505B43c452AA4443e0a6B84bb37771494633Fde9",
					"NonfungiblePositionManager": "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A",
					"V3Migrator": "0x3cFd4d48EDfDCC53D3f173F596f621064614C582",
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
			tolerance: 0.01,
			
			_reserveBalances: null,
			deadlineMins: 30,
		});
	}
	deadline(now) {
		let defi = this;
		if (cutil.isNil(now)) {
			now = Date.now();
		}
		return Math.floor(new Date(now).getTime() / 1000 + 60 * defi.deadlineMins);
	}
	get info() {
		if (!this._info) {
			this._info = cutil.clone(this.infos[this.chain.symbol] || this.infos[""]);
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
		return this.info["SwapRouter2"];
	}
	set addressRouter2(addressRouter2) {
		this.info["SwapRouter2"] = addressRouter2;
	}
	get factory() {
		let defi = this;
		if (!defi._factory) {
			let {account, addressFactory: address} = defi;
			defi._factory = defi.contract({address, account});
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
			let {account, addressPositionManager: address} = defi;
			defi._positionManager = defi.contract({address, account});
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
			let {account, addressQuoter: address} = defi;
			defi._quoter = defi.contract({address, account});
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
			let {account, addressRouter2: address} = defi;
			defi._router2 = defi.contract({address, account});
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
				[this.chain.tok]: 0.25,
			};
		}
		return this._reserveBalances;
	}
	set reserveBalances(reserveBalances) {
		this._reserveBalances = reserveBalances;
	}
	get reserveTokBalance() {
		return this.reserveBalances[this.chain.tok];
	}
	set reserveTokBalance(reserveTokBalance) {
		this.reserveBalances[this.chain.tok] = reserveTokBalance;
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
		let {account} = defi;
		let {chain} = defi;
		if (cutil.isString(arg)) {
			arg = {id: arg};
		}
		arg = {account, ...cutil.asObject(arg)};
		let {id: tokenId} = arg;
		if (!tokenId) {
			tokenId = chain.tokenId(arg.address);
		}
		return (tokenId in defi.tokens) ? defi.tokens[tokenId] : (defi.tokens[tokenId] = super.token(arg));
	}
	pool(arg) {
		let defi = this;
		arg = {defi, ...cutil.asObject(arg)};
		return new Pool(arg);
	}
	position(arg) {
		let defi = this;
		arg = {defi, ...cutil.asObject(arg)};
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
			...pools.map(pool => `${cutil.asInteger(pool.fee).toString(16).toLowerCase().padStart(6, "0")}${pool.tokenB.address.toLowerCase().substring(2)}`),
		].join("");
		return p;
	}
	pathFromTokenIdsAndFees(data) {
		let defi = this;
		let {chain} = defi;
		
		let p = chain.tokenAddress(data[0]).toLowerCase();
		let n = cutil.asInteger(data.length / 2);
		for (let i = 0; i < n; i++) {
			p += cutil.asInteger(defi.rateToFee(data[2 * i + 1])).toString(16).toLowerCase().padStart(6, "0");
			p += chain.tokenAddress(data[2 * i + 2]).toLowerCase().substring(2);
		}
		return p;
	}
	async toGetWTokAddress() {
		let defi = this;
		let {positionManager} = defi;
		await positionManager.toGetAbi();
		let address = await positionManager.toCallRead("WETH9");
		return address;
	}
	async toGetPositionCount() {
		let defi = this;
		let {positionManager} = defi;
		let {account} = positionManager;
		let {address} = account;
		
		await positionManager.toGetAbi();
		let balance = await positionManager.toCallRead("balanceOf", address);
		balance = cutil.asNumber(balance);
		return balance;
	}
	async toGetPositionId(index) {
		let defi = this;
		let {positionManager} = defi;
		let {account} = defi;
		let {address} = account;
		
		await positionManager.toGetAbi();
		let id = await positionManager.toCallRead("tokenOfOwnerByIndex", address, index);
		return id;
	}
	async toGetTickSpacingForFeeRate(feeRate) {
		let defi = this;
		let {factory} = defi;
		await factory.toGetAbi();
		let tickSpacing = await factory.toCallRead("feeAmountTickSpacing", defi.rateToFee(feeRate));
		return cutil.asNumber(tickSpacing);
	}
	async toGetNearestTick(tick, feeRate) {
		let defi = this;
		let tickSpacing = await defi.toGetTickSpacingForFeeRate(feeRate);
		return d(tick).div(tickSpacing).round().mul(tickSpacing).toFixed(0);
	}
	async toGetPoolAddress(tokenIdA, tokenIdB, feeRate) {
		let defi = this;
		let {account} = defi;
		let {factory} = defi;
		
		let tokenA = defi.token({id: tokenIdA, account});
		let tokenB = defi.token({id: tokenIdB, account});
		
		await factory.toGetAbi();
		
		let address = await factory.toCallRead("getPool", tokenA.address, tokenB.address, defi.rateToFee(feeRate));
		return address;
	}
	async toGetPool(tokenIdA, tokenIdB, feeRate) {
		let defi = this;
		let {account} = defi;
		let {Pool} = defi;
		
		let tokenA = defi.token({id: tokenIdA, account});
		let tokenB = defi.token({id: tokenIdB, account});
		
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
		let {account} = defi;
		let {Pool} = defi;
		let {chain} = defi;
		
		let contract = defi.contract({address, account});
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
		let {
			sqrtPriceX96,
			tick,
			observationIndex,
			observationCardinality,
			observationCardinalityNext,
			feeProtocol,
			unlocked,
		} = slot0;
		
		let token0 = defi.token({account, address: addressToken0});
		let token1 = defi.token({account, address: addressToken1});
		let tokenId0 = token0.id;
		let tokenId1 = token1.id;
		
		try {
			await token0.toGetDecimals();
		} catch(e) {
			console.log(`Error in getting decimals for ${token0.address}`);
			throw e;
		}
		try {
			await token1.toGetDecimals();
		} catch(e) {
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
		let {account} = defi;
		let {factory} = defi;
		
		let tokenA = defi.token({id: tokenIdA, account});
		let tokenB = defi.token({id: tokenIdB, account});
		
		await factory.toGetAbi();
		let address = await factory.toCallRead("createPool", tokenA.address, tokenB.address, defi.rateToFee(feeRate));
		
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
		let {Position} = defi;
		let {chain} = defi;
		let {positionManager} = defi;
		
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
		let {feeGrowthOutside0X128: feeGrowthOutside0X128Lower, feeGrowthOutside1X128: feeGrowthOutside1X128Lower} = await pool.contract.toCallRead("ticks", cutil.asNumber(tickLower));
		let {feeGrowthOutside0X128: feeGrowthOutside0X128Upper, feeGrowthOutside1X128: feeGrowthOutside1X128Upper} = await pool.contract.toCallRead("ticks", cutil.asNumber(tickUpper));
		
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
	async toGetPositions(tokenIdA, tokenIdB, feeRate, maxCount = 0, maxSearchCount = 0) {
		let defi = this;
		let {chain} = defi;
		let pool = await defi.toGetPool(tokenIdA, tokenIdB, feeRate);
		let {address: addressPool} = pool;
		let positionCount = await defi.toGetPositionCount();
		maxSearchCount ||= positionCount;
		let result = [];
		for (let i = 0; i < maxSearchCount; i++) {
			let index = positionCount - 1 - i;
			let position = await defi.toGetPositionAt(index);
			if (chain.eq(position.pool.address, addressPool)) {
				result.push(position);
				if (result.length === maxCount) {
					break;
				}
			}
		}
		return result;
	}
	async toMintPosition({tokenIdA, tokenIdB, feeRate, priceLower, priceUpper, tickLower, tickUpper, tickWidth, amountA, amountB, amountA_, amountB_, totalA, totalB, totalA_, totalB_, recipient, dontWrap = false}) {
		let defi = this;
		let {chain} = defi;
		let {positionManager} = defi;
		let {account} = defi;
		let {address} = account;
		
		await positionManager.toGetAbi();
		
		let calls = [];
		
		let pool = await defi.toGetPool(tokenIdA, tokenIdB, feeRate);
		let [amount0, amount1, amount0_, amount1_, total0, total1, total0_, total1_] = chain.eq(pool.tokenA.address, pool.token0.address) ?
			[amountA, amountB, amountA_, amountB_, totalA, totalB, totalA_, totalB_] :
			[amountB, amountA, amountB_, amountA_, totalB, totalA, totalB_, totalA_];
		let {addressToken0, addressToken1, token0: {id: tokenId0, decimals: decimals0}, token1: {id: tokenId1, decimals: decimals1}, fee, price, tick} = pool;
		if (cutil.isNilOrEmptyString(tickLower) && !cutil.isNilOrEmptyString(priceLower)) {
			tickLower = d(priceLower).mul(10 ** (decimals1 - decimals0)).log().div(d(1.0001).log()).toFixed(0);
		}
		if (cutil.isNilOrEmptyString(tickUpper) && !cutil.isNilOrEmptyString(priceUpper)) {
			tickUpper = d(priceUpper).mul(10 ** (decimals1 - decimals0)).log().div(d(1.0001).log()).toFixed(0);
		}
		if (!cutil.isNilOrEmptyString(tickWidth)) {
			if (cutil.isNilOrEmptyString(tickLower) && !cutil.isNilOrEmptyString(tickUpper)) {
				tickLower = d(tickUpper).minus(tickWidth).toFixed(0);
			} else if (cutil.isNilOrEmptyString(tickUpper) && !cutil.isNilOrEmptyString(tickLower)) {
				tickUpper = d(tickLower).plus(tickWidth).toFixed(0);
			} else if (cutil.isNilOrEmptyString(tickLower) && cutil.isNilOrEmptyString(tickUpper)) {
				tickLower = d(tick).minus(d(tickWidth).div(2)).toFixed(0);
				tickUpper = d(tick).plus(d(tickWidth).div(2)).toFixed(0);
			}
		}
		
		tickLower = pool.getNearestTick(tickLower);
		tickUpper = pool.getNearestTick(tickUpper);
		console.log({tickLower, tick, tickUpper});
		
		console.log({priceLower, price, priceUpper});
		priceLower = d(1.0001).pow(tickLower).div(10 ** (decimals1 - decimals0)).toNumber();
		priceUpper = d(1.0001).pow(tickUpper).div(10 ** (decimals1 - decimals0)).toNumber();
		console.log({priceLower, priceUpper});
		
		if (cutil.isNilOrEmptyString(amount0_) && !cutil.isNilOrEmptyString(amount0)) {
			amount0_ = d(amount0).mul(10 ** decimals0).toFixed(0);
		}
		if (cutil.isNilOrEmptyString(amount1_) && !cutil.isNilOrEmptyString(amount1)) {
			amount1_ = d(amount1).mul(10 ** decimals1).toFixed(0);
		}
		if (cutil.isNilOrEmptyString(total0_) && !cutil.isNilOrEmptyString(total0)) {
			total0_ = d(total0).mul(10 ** decimals0).toFixed(0);
		}
		if (cutil.isNilOrEmptyString(total1_) && !cutil.isNilOrEmptyString(total1)) {
			total1_ = d(total1).mul(10 ** decimals1).toFixed(0);
		}
		
		let price_$ = d(price).div(10 ** (decimals1 - decimals0));
		let tck = d(tick).lt(tickLower) ? tickLower : d(tick).gt(tickUpper) ? tickUpper : tick;
		// amount1_:amount0_
		let ratio_$ = d(1.0001).pow(tck * +0.5).minus(d(1.0001).pow(tickLower * +0.5)).div(d(1.0001).pow(tck * -0.5).minus(d(1.0001).pow(tickUpper * -0.5)));
		
		if (!cutil.isNilOrEmptyString(amount0_) && cutil.isNilOrEmptyString(amount1_)) {
			amount1_ = d(amount0_).mul(ratio_$).toFixed(0);
		} else if (cutil.isNilOrEmptyString(amount0_) && !cutil.isNilOrEmptyString(amount1_)) {
			amount0_ = d(amount1_).div(ratio_$).toFixed(0);
		} else if (cutil.isNilOrEmptyString(amount0_) && cutil.isNilOrEmptyString(amount1_)) {
			if (!cutil.isNilOrEmptyString(total0_)) {
				amount0_ = d(total0_).div(d(1).plus(ratio_$.div(price_$))).toFixed(0);
				amount1_ = d(amount0_).mul(ratio_$).toFixed(0);
				
				console.log(`check:`);
				console.log(`ratio:`);
				console.log(d(amount1_).div(amount0_).toFixed(6));
				console.log(ratio_$.toFixed(6));
				console.log(`total:`);
				console.log(d(amount0_).plus(d(amount1_).div(price_$)).toFixed(6));
				console.log(d(total0_).toFixed(6));
				
			} else if (!cutil.isNilOrEmptyString(total1_)) {
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
		
		console.log({amount0_, amount1_});
		
		for (let [token, amount_] of [
			[pool.token0, amount0_],
			[pool.token1, amount1_],
		]) {
			let allowance_ = await token.toGetAllowance_(account.address, positionManager.address);
			if (d(allowance_).lt(amount_)) {
				await token.toApprove_(positionManager.address, d(2).pow(256).minus(1).toFixed(0));
			}
		}
		
		let amount0Desired = amount0_;
		let amount1Desired = amount1_;
		let amount0Min = d(amount0Desired).mul(1 - defi.tolerance).toFixed(0);
		let amount1Min = d(amount1Desired).mul(1 - defi.tolerance).toFixed(0);
		if (cutil.isNilOrEmptyString(recipient)) {
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
			method: "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
			params: [[addressToken0, addressToken1, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline]],
		});
		if (chain.isWTok(addressToken0) || chain.isWTok(addressToken1)) {
			calls.push({method: "refundETH", params: []});
		}
		let method;
		let params;
		if (calls.length === 1) {
			({method, params} = calls[0]);
		} else {
			method = "multicall(bytes[])";
			params = [calls.map(({method, params}) => positionManager.callData(method, ...params))];
		}
		let data = positionManager.callData(method, ...params);
		let receipt = await positionManager.toSendData(data, value);
		let resProcessTxMint = await defi.toProcessTxMint({receipt});
		let {hash, tokenId, liquidity} = resProcessTxMint;
		({amount0_, amount1_} = resProcessTxMint);
		amount0 = d(amount0_).div(10 ** decimals0).toNumber();
		amount1 = d(amount1_).div(10 ** decimals1).toNumber();
		console.log({hash, tokenId, tickLower, tickUpper, liquidity, tokenId0, tokenId1, amount0, amount1, amount0_, amount1_});
		return {receipt, hash, tokenId, liquidity, tickLower, tickUpper, tokenId0, tokenId1, amount0, amount1, amount0_, amount1_};
	}
	async toQuote({pathInfo, amountIn, amountIn_, amountOut, amountOut_, priceExternal}) {
		let defi = this;
		let {quoter} = defi;
		
		await quoter.toGetAbi();
		let path = defi.pathFromTokenIdsAndFees(pathInfo);
		let tokenIn = defi.token(pathInfo[0]);
		let tokenOut = defi.token(pathInfo[pathInfo.length - 1]);
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
		let slippage = 1 - (price / priceExternal);
		return {amountIn, amountIn_, amountOut, amountOut_, price, slippage};
	}
	async toSwap({pathInfo, amountIn, amountIn_, amountOut, amountOut_, priceExternal, dontWrap}) {
		let defi = this;
		let {chain} = defi;
		let {account} = defi;
		let {address} = account;
		let {router2} = defi;
		
		let isForward = amountIn || amountIn_;
		
		let method;
		let params;
		let value = 0;
		
		let amountMinimum;
		
		await router2.toGetAbi();
		let path = defi.pathFromTokenIdsAndFees(pathInfo);
		let tokenIn = defi.token(pathInfo[0]);
		let tokenOut = defi.token(pathInfo[pathInfo.length - 1]);
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
		let priceExternal_$ = d(priceExternal).mul(d(10).pow(tokenOut.decimals - tokenIn.decimals));
		if (amountIn_) {
			let amountOutMinimum_ = d(amountIn_).mul(priceExternal_$).mul(d(1 - defi.tolerance)).toFixed(0);
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
			let amountInMaximum_ = d(amountOut_).div(priceExternal_$).mul(d(1 + defi.tolerance)).toFixed(0);
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
			let {event: {name}, address} = log.dec;
			if (name === "Transfer") {
				let {decoded: {from, to, value}} = log.dec;
				if (from && to && value) {
					let tokenId = chain.tokenId(address);
					let token = defi.token(tokenId);
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
				let {decoded: {wad}} = log.dec;
				let token = defi.wtoken();
				let wad_ = wad;
				wad = await token.toUnwrapNumber(wad_);
				tokenIdIn = chain.wtok;
				amountIn_ = wad_;
				amountIn = wad;
			} else if (name === "Withdrawal" && chain.isWTok(address)) {
				let {decoded: {wad}} = log.dec;
				let token = defi.wtoken();
				let wad_ = wad;
				wad = await token.toUnwrapNumber(wad_);
				tokenIdOut = chain.wtok;
				amountOut_ = wad_;
				amountOut = wad;
			}
		}
		return {receipt, tokenIdIn, tokenIdOut, amountIn, amountIn_, amountOut, amountOut_};
	}
	async toProcessTxMint({hash, tx, receipt, recipient}) {
		let defi = this;
		let {chain} = defi;
		let {account} = defi;
		let {address} = account;
		let {positionManager} = defi;
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
		({blockNumber} = (tx || receipt));
		if (cutil.isNil(blockNumber)) {
			throw new Error(`Transaction is pending.`);
		}
		let tokenId;
		let liquidity;
		let amount0_;
		let amount1_;
		for (let log of receipt.logs) {
			log.dec = await defi.toDecodeLog(log);
			let {event: {name}, address, decoded} = log.dec;
			if (chain.eq(address, positionManager.address) && name === "Transfer") {
				let {from, to} = decoded;
				if (chain.eq(from, chain.addressZero) && chain.eq(to, recipient)) {
					({tokenId} = decoded);
				}
			}
			if (chain.eq(address, positionManager.address) && name === "IncreaseLiquidity") {
				let {tokenId: id} = decoded;
				if (tokenId === id) {
					({liquidity} = decoded);
					({amount0: amount0_} = decoded);
					({amount1: amount1_} = decoded);
				}
			}
		}
		return {hash, tx, receipt, tokenId, liquidity, amount0_, amount1_};
	}
	async toProcessSwapTx(hash) {
		let defi = this;
		let {chain} = defi;
		let {web3} = chain;
		let tx = await web3.eth.getTransaction(hash);
		if (!tx) {
			throw new Error(`Transaction not found.`);
		}
		let {blockNumber} = tx;
		if (cutil.isNil(blockNumber)) {
			throw new Error(`Transaction is pending.`);
		}
		let receipt = await web3.eth.getTransactionReceipt(hash);
		let tokenIdIn;
		let tokenIdOut;
		let amountIn;
		let amountOut;
		for (let log of cutil.asArray(receipt.logs)) {
			try {
				log.dec = await defi.toDecodeLog(log);
				let {event: {name}, address} = log.dec;
				if (name === "Transfer") {
					let {decoded: {from, to, value}} = log.dec;
					if (from && to && value) {
						let tokenId = chain.tokenId(address);
						let token = defi.token(tokenId);
						value = await token.toUnwrapNumber(value);
						if (chain.eq(from, defi.account.address)) {
							tokenIdIn = tokenId;
							amountIn = value;
						} else if (chain.eq(to, defi.account.address)) {
							tokenIdOut = tokenId;
							amountOut = value;
						}
					}
				} else if (name === "Deposit" && chain.isWTok(address)) {
					let {decoded: {wad}} = log.dec;
					let token = defi.wtoken();
					wad = await token.toUnwrapNumber(wad);
					tokenIdIn = chain.wtok;
					amountIn = wad;
				} else if (name === "Withdrawal" && chain.isWTok(address)) {
					let {decoded: {wad}} = log.dec;
					let token = defi.wtoken();
					wad = await token.toUnwrapNumber(wad);
					tokenIdOut = chain.wtok;
					amountOut = wad;
				}
			} catch(e) {
				console.log(`Error in defi.toProcessSwapTx:\n${JSON.stringify(log, null, "\t")}`);
				console.log(e.message);
			}
		}
		return {tx, receipt, tokenIdIn, tokenIdOut, amountIn, amountOut};
	}
	async toQuoteRoutes({pathInfos, amountIn, amountIn_, amountOut, amountOut_, priceExternal}) {
		let defi = this;
		let {account} = defi;
		let {address} = account;
		let {quoter} = defi;
		
		await quoter.toGetAbi();
		
		let pathInfo = pathInfos[0];
		let tokenIn = defi.token(pathInfo[0]);
		let tokenOut = defi.token(pathInfo[pathInfo.length - 1]);
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
		
		let routes = pathInfos.map(pathInfo => ({pathInfo}));
		
		for (let route of routes) {
			let {pathInfo} = route;
			let path = defi.pathFromTokenIdsAndFees(pathInfo);
			if (isForward) {
				amountOut_ = await quoter.toCallRead("quoteExactInput", path, amountIn_);
				amountOut = tokenOut.unwrapNumber(amountOut_);
			} else {
				// ??????
				pathInfo = pathInfo.reverse();
				path = defi.pathFromTokenIdsAndFees(pathInfo);
				amountIn_ = await quoter.toCallRead("quoteExactOutput", path, amountOut_);
				amountIn = tokenIn.unwrapNumber(amountIn_);
			}
			
			let price = amountOut / amountIn;
			let slippage = 1 - (price / priceExternal);
			cutil.assign(route, {path, amountIn, amountIn_, amountOut, amountOut_, price, slippage});
		}
		
		routes.sort(({slippage: a}, {slippage: b}) => a - b);
		return routes;
	}
}

export {DeFi};
