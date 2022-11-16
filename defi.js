import bn from "bignumber.js";

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
			token0: addressToken0: null,
			token1: addressToken1: null,
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
		});
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
			
			addressFactory: null,
			addressPositionManager: null,
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
	async toGetPool(tokenIdA, tokenIdB, feeRate) {
		let defi = this;
		let {util} = defi;
		let {factory} = defi;
		let {Contract} = defi;
		let {Token} = defi;
		let {Pool} = defi;
		
		let tokenA = new Token(tokenIdA);
		let tokenB = new Token(tokenIdB);
		
		await factory.toGetAbi();
		let address = await factory.toCallRead("getPool", tokenA.address, tokenB.address, cutil.asInteger(feeRate * 1e6));
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
		let [
			sqrtPriceX96,
			tick,
			observationIndex,
			observationCardinality,
			observationCardinalityNext,
			feeProtocol,
			unlocked,
		] = slot0;
		
		return new Pool({
			defi,
			address,
			contract,
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
	async toGetPosition(index) {
		let defi = this;
		
		let id = await defi.toGetPositionId(index);
		let position = await defi.toGetPositionById(id);
		
		return cutil.assign(position, {
			index,
		});
	}
	async toGetPositionById(id) {
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
		//////////// Fixed until here...
		let tokenId0 = util.tokenId(addressToken0);
		let tokenId1 = util.tokenId(addressToken1);
		let pool = await defi.toGetPool(tokenId0, tokenId1, cutil.asNumber(fee) * 1e-6);
		let {feeGrowthOutside0X128: feeGrowthOutside0X128Lower, feeGrowthOutside1X128: feeGrowthOutside1X128Lower} = await pool.contract.toCallRead("ticks", cutil.asNumber(tickLower));
		let {feeGrowthOutside0X128: feeGrowthOutside0X128Upper, feeGrowthOutside1X128: feeGrowthOutside1X128Upper} = await pool.contract.toCallRead("ticks", cutil.asNumber(tickUpper));
		
		let fee0_ = 
			bn(pool.feeGrowthGlobal0X128)
			.minus(bn(feeGrowthOutside0X128Lower))
			.minus(bn(feeGrowthOutside0X128Upper))
			.minus(bn(feeGrowthInside0LastX128))
			.div(bn(2).pow(128))
			.multipliedBy(bn(liquidity))
			.plus(bn(tokensOwed0))
			.toString();
		let fee1_ = 
			bn(pool.feeGrowthGlobal1X128)
			.minus(bn(feeGrowthOutside1X128Lower))
			.minus(bn(feeGrowthOutside1X128Upper))
			.minus(bn(feeGrowthInside1LastX128))
			.div(bn(2).pow(128))
			.multipliedBy(bn(liquidity))
			.plus(bn(tokensOwed1))
			.toString();
		
		// let fee0_ = ((pool.feeGrowthGlobal0X128 - feeGrowthOutside0X128Lower - feeGrowthOutside0X128Upper - feeGrowthInside0LastX128) / (2 ** 128)) * liquidity;
		// let fee1_ = ((pool.feeGrowthGlobal1X128 - feeGrowthOutside1X128Lower - feeGrowthOutside1X128Upper - feeGrowthInside1LastX128) / (2 ** 128)) * liquidity;
		console.log(pool.token0.id);
		console.log(pool.token0.address);
		await pool.token0.toGetAbi();
		await pool.token0.toGetDecimals();
		console.log(pool.token1.id);
		console.log(pool.token1.address);
		await pool.token1.toGetAbi();
		await pool.token1.toGetDecimals();
		let fee0 = pool.token0.unwrapNumber(fee0_);
		let fee1 = pool.token1.unwrapNumber(fee1_);
		// let amount0_ = bn(liquidity).multipliedBy(bn(price).sqrt().pow(-1).minus(bn(priceUpper).sqrt().pow(-1)));
		// let amount1_ = bn(liquidity).multipliedBy(bn(price).sqrt().pow(+1).minus(bn(priceLower).sqrt().pow(+1)));
		return new Position({
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
		});
	}
}

export {DeFi};
