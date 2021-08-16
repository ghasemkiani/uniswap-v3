//	@ghasemkiani/uniswap-v3/defi

import {cutil} from "@ghasemkiani/base";
import {util as utilEth} from "@ghasemkiani/ethereum";
import {Account} from "@ghasemkiani/ethereum";
import {Contract} from "@ghasemkiani/ethereum";
import {iwdefi} from "@ghasemkiani/ethereum";
import {DeFi as DeFiEth} from "@ghasemkiani/ethereum";
import {Token} from "@ghasemkiani/ethereum";

const SOLIDITY_MAXINT = (2n ** 256n - 1n).toString();

class Pair extends cutil.mixin(Contract, iwdefi) {
	
}
cutil.extend(Pair.prototype, {
	factory: null,
	address1: null,
	address2: null,
	feeRate: null,
});

class Factory extends cutil.mixin(Contract, iwdefi) {
	get pairs() {
		if(!this._pairs) {
			this._pairs = [];
		}
		return this._pairs;
	}
	set pairs(pairs) {
		this._pairs = pairs;
	}
	async toGetPair(address1, address2, feeRate = 0.003) {
		let factory = this;
		let {defi} = factory;
		let rate = (feeRate * 1e6).toFixed(0);
		let address = await factory.toCallRead("getPool", address1, address2, rate);
		let pair = new Pair({address, defi, factory, address1, address2, feeRate});
		return pair;
	}
}
cutil.extend(Factory.prototype, {
	_pairs: null,
});

class Router extends cutil.mixin(Contract, iwdefi) {
	
}
cutil.extend(Router.prototype, {
	_pairs: null,
});

class Position extends cutil.mixin(Contract, iwdefi) {
	
}
cutil.extend(Position.prototype, {
	_pairs: null,
});

class DeFi extends DeFiEth {
	get factory() {
		if(!this._factory) {
			let defi = this;
			let {account} = this;
			let address = this.addresses.factory;
			this._factory = new Factory({defi, account, address});
		}
		return this._factory;
	}
	set factory(factory) {
		this._factory = factory;
	}
	get router() {
		if(!this._router) {
			let defi = this;
			let {account} = this;
			let address = this.addresses.router;
			this._router = new Router({defi, account, address});
		}
		return this._router;
	}
	set router(router) {
		this._router = router;
	}
	get position() {
		if(!this._position) {
			let defi = this;
			let {account} = this;
			let address = this.addresses.position;
			this._position = new Position({defi, account, address});
		}
		return this._position;
	}
	set position(position) {
		this._position = position;
	}
	async toGetPair(tokenId1, tokenId2, feeRate = 0.003) {
		let defi = this;
		let {factory} = defi;
		return await factory.toGetPair(defi.token(tokenId1).address, defi.token(tokenId2).address, feeRate);
	}
}
cutil.extend(DeFi.prototype, {
	_factory: null,
	_router: null,
	_position: null,
	addresses: {
		"factory": "0x1F98431c8aD98523631AE4a59f267346ea31F984",
		"router": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
		"position": "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
	},
	slippage: 0.005,
	deadlineMins: 120,
});

export {DeFi};
