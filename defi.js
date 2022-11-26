import bn from "bignumber.js";
import d from "decimal.js";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";

class Pool extends Obj {
	static {
		cutil.extend(this.prototype, {
			defi: null,
			tokenIdA: null,
			tokenIdB: null,
			feeRate: null,
			tokenA: null,
			tokenB: null,
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
			
			price: null,
		});
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
			
			fee0_: null,
			fee1_: null,
			fee0: null,
			fee1: null,
			
			priceLower: null,
			priceUpper: null,
			
			amount0_: null,
			amount1_: null,
			amount0: null,
			amount1: null,
			
			max0_: null,
			max1_: null,
			max0: null,
			max1: null,
		});
	}
	async toCollect(recipient = null) {
		let position = this;
		let {defi} = position;
		let {util} = defi;
		let {web3} = util;
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
		let amount0Max = bn(2).pow(128).minus(1).toFixed(0);
		let amount1Max = bn(2).pow(128).minus(1).toFixed(0);
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
}

class DeFi extends Obj {
	static {
		cutil.extend(this.prototype, {
			util: null,
			Util: null,
			Account: null,
			Contract: null,
			Token: null,
			
			Pool,
			Position,
			
			account: null,
			_factory: null,
			_positionManager: null,
			_quoter: null,
			_router2: null,
			
			addressFactory: null,
			addressPositionManager: null,
			addressQuoter: null,
			addressRouter2: null,
			
			FEE_RATE_K: 1e6,
		});
	}
	get factory() {
		let defi = this;
		if (!defi._factory) {
			let {Contract, account, addressFactory: address} = defi;
			defi._factory = new Contract({address, account});
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
			let {Contract, account, addressPositionManager: address} = defi;
			defi._positionManager = new Contract({address, account});
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
			let {Contract, account, addressQuoter: address} = defi;
			defi._quoter = new Contract({address, account});
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
			let {Contract, account, addressRouter2: address} = defi;
			defi._router2 = new Contract({address, account});
		}
		return defi._router2;
	}
	set router2(router2) {
		let defi = this;
		defi._router2 = router2;
	}
	feeToRate(fee) {
		return cutil.asNumber(fee) / this.FEE_RATE_K;
	}
	rateToFee(rate) {
		return cutil.asInteger(rate * this.FEE_RATE_K);
	}
	path(pools) {
		return [
			"0x",
			pools[0].tokenA.address.toLowerCase().substring(2),
			...pools.map(pool => `${cutil.asInteger(pool.fee).toString(16).padStart(6, "0")}${pool.tokenB.address.toLowerCase().substring(2)}`),
		].join("");
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
	async toGetPool(tokenIdA, tokenIdB, feeRate) {
		let defi = this;
		let {account} = defi;
		let {factory} = defi;
		let {Token} = defi;
		let {Pool} = defi;
		
		let tokenA = new Token({id: tokenIdA, account});
		let tokenB = new Token({id: tokenIdB, account});
		
		await factory.toGetAbi();
		let address = await factory.toCallRead("getPool", tokenA.address, tokenB.address, defi.rateToFee(feeRate));
		let pool = await defi.toGetPoolByAddress(address);
		
		return cutil.assign(pool, {
			tokenIdA,
			tokenIdB,
			feeRate,
			tokenA,
			tokenB,
		});
	}
	async toCreatePool(tokenIdA, tokenIdB, feeRate) {
		let defi = this;
		let {account} = defi;
		let {factory} = defi;
		
		let tokenA = new Token({id: tokenIdA, account});
		let tokenB = new Token({id: tokenIdB, account});
		
		await factory.toGetAbi();
		let address = await factory.toCallRead("createPool", tokenA.address, tokenB.address, defi.rateToFee(feeRate));
		
		return address;
	}
	async toGetPoolByAddress(address) {
		let defi = this;
		let {account} = defi;
		let {Pool} = defi;
		let {util} = defi;
		let {Contract} = defi;
		let {Token} = defi;
		
		let contract = new Contract({address});
		await contract.toGetAbi();
		
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
		
		let token0 = new Token({account, address: addressToken0, id: util.tokenId(addressToken0)});
		let token1 = new Token({account, address: addressToken1, id: util.tokenId(addressToken1)});
		
		await token0.toGetAbi();
		await token1.toGetAbi();
		await token0.toGetDecimals();
		await token1.toGetDecimals();
		
		let price = d(1.0001).pow(tick).mul(10 ** (token0.decimals - token1.decimals)).toString();
		
		return new Pool({
			defi,
			address,
			contract,
			token0,
			token1,
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
			
			price,
		});
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
		let {util} = defi;
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
		
		let tokenId0 = util.tokenId(addressToken0);
		let tokenId1 = util.tokenId(addressToken1);
		let pool = await defi.toGetPool(tokenId0, tokenId1, defi.feeToRate(fee));
		let {feeGrowthOutside0X128: feeGrowthOutside0X128Lower, feeGrowthOutside1X128: feeGrowthOutside1X128Lower} = await pool.contract.toCallRead("ticks", cutil.asNumber(tickLower));
		let {feeGrowthOutside0X128: feeGrowthOutside0X128Upper, feeGrowthOutside1X128: feeGrowthOutside1X128Upper} = await pool.contract.toCallRead("ticks", cutil.asNumber(tickUpper));
		
		/*
		console.log(`${"feeGrowthGlobal0X128".padEnd(30)}\t${pool.feeGrowthGlobal0X128.padStart(80)}`);
		console.log(`${"feeGrowthOutside0X128Lower".padEnd(30)}\t${feeGrowthOutside0X128Lower.padStart(80)}`);
		console.log(`${"feeGrowthOutside0X128Upper".padEnd(30)}\t${feeGrowthOutside0X128Upper.padStart(80)}`);
		console.log(`${"feeGrowthInside0LastX128".padEnd(30)}\t${feeGrowthInside0LastX128.padStart(80)}`);
		console.log(`${"liquidity".padEnd(30)}\t${liquidity.padStart(80)}`);
		console.log(`${"tokensOwed0".padEnd(30)}\t${tokensOwed0.padStart(80)}`);
		
		console.log(`${"feeGrowthGlobal1X128".padEnd(30)}\t${pool.feeGrowthGlobal1X128.padStart(80)}`);
		console.log(`${"feeGrowthOutside1X128Lower".padEnd(30)}\t${feeGrowthOutside1X128Lower.padStart(80)}`);
		console.log(`${"feeGrowthOutside1X128Upper".padEnd(30)}\t${feeGrowthOutside1X128Upper.padStart(80)}`);
		console.log(`${"feeGrowthInside1LastX128".padEnd(30)}\t${feeGrowthInside1LastX128.padStart(80)}`);
		console.log(`${"liquidity".padEnd(30)}\t${liquidity.padStart(80)}`);
		console.log(`${"tokensOwed1".padEnd(30)}\t${tokensOwed1.padStart(80)}`);
		*/
		
		let fee0_ = 
			bn(pool.feeGrowthGlobal0X128)
			.minus(bn(feeGrowthOutside0X128Lower))
			.minus(bn(feeGrowthOutside0X128Upper))
			.minus(bn(feeGrowthInside0LastX128))
			.multipliedBy(bn(liquidity))
			.div(bn(2).pow(128))
			.plus(bn(tokensOwed0))
			.toString();
		let fee1_ = 
			bn(pool.feeGrowthGlobal1X128)
			.minus(bn(feeGrowthOutside1X128Lower))
			.minus(bn(feeGrowthOutside1X128Upper))
			.minus(bn(feeGrowthInside1LastX128))
			.multipliedBy(bn(liquidity))
			.div(bn(2).pow(128))
			.plus(bn(tokensOwed1))
			.toString();
		
		await pool.token0.toGetAbi();
		await pool.token0.toGetDecimals();
		await pool.token1.toGetAbi();
		await pool.token1.toGetDecimals();
		let fee0 = pool.token0.unwrapNumber(fee0_);
		let fee1 = pool.token1.unwrapNumber(fee1_);
		
		let priceLower = d(1.0001).pow(tickLower).mul(10 ** (pool.token0.decimals - pool.token1.decimals)).toString();
		let priceUpper = d(1.0001).pow(tickUpper).mul(10 ** (pool.token0.decimals - pool.token1.decimals)).toString();
		
		let amount0_ = d(liquidity).mul(d(1.0001).pow(pool.tick * -0.5).minus(d(1.0001).pow(tickUpper * -0.5))).toFixed(0);
		let amount1_ = d(liquidity).mul(d(1.0001).pow(pool.tick * +0.5).minus(d(1.0001).pow(tickLower * +0.5))).toFixed(0);
		
		let amount0 = pool.token0.unwrapNumber(amount0_);
		let amount1 = pool.token1.unwrapNumber(amount1_);
		
		let max0_ = d(liquidity).mul(d(1.0001).pow(tickLower * -0.5).minus(d(1.0001).pow(tickUpper * -0.5))).toFixed(0);
		let max1_ = d(liquidity).mul(d(1.0001).pow(tickUpper * +0.5).minus(d(1.0001).pow(tickLower * +0.5))).toFixed(0);
		
		let max0 = pool.token0.unwrapNumber(max0_);
		let max1 = pool.token1.unwrapNumber(max1_);
		
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
			tokensOwed0,
			tokensOwed1,
			pool,
			fee0_,
			fee1_,
			fee0,
			fee1,
			priceLower,
			priceUpper,
			amount0_,
			amount1_,
			amount0,
			amount1,
			max0_,
			max1_,
			max0,
			max1,
		});
	}
	async toGetPositions(tokenIdA, tokenIdB, feeRate, maxCount = 0, maxSearchCount = 0) {
		let defi = this;
		let {util} = defi;
		let pool = await defi.toGetPool(tokenIdA, tokenIdB, feeRate);
		let {address: addressPool} = pool;
		let positionCount = await defi.toGetPositionCount();
		maxSearchCount ||= positionCount;
		let result = [];
		for (let i = 0; i < maxSearchCount; i++) {
			let index = positionCount - 1 - i;
			let position = await defi.toGetPositionAt(index);
			if (util.eq(position.pool.address, addressPool)) {
				result.push(position);
				if (result.length === maxCount) {
					break;
				}
			}
		}
		return result;
	}
}

export {DeFi};

// https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html
// https://docs.web3js.org/api
