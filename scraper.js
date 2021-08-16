//	@ghasemkiani/uniswap-v3/scraper

import puppeteer from "puppeteer-core";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base"
import {Account as AccountEth} from "@ghasemkiani/ethereum";

class Scraper extends Obj {
	async toGetPositionBalances(id) {
		let url = `https://app.uniswap.org/#/pool/${id}?r=${cutil.srand(6)}`;
		let browser = await puppeteer.launch({
			headless: true,
			executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
		});
		let page = await browser.newPage();
		await page.goto(url);
		return await page.evaluate(async ({x}) => {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						let slots = Array.from(document.querySelectorAll(".sc-kpOJdX.eVDhEX.css-r99fas")).map(el => el.innerText);
						
						let tokenId1 = slots[1].trim().split(/\s+/)[0] || "WBTC";
						let tokenId2 = slots[3].trim().split(/\s+/)[0] || "ETH";
						
						let balance1 = Number(slots[2]);
						let reward1 = Number(slots[6]);
						
						let balance2 = Number(slots[4]);
						let reward2 = Number(slots[8]);
						
						let total1 = balance1 + reward1;
						let total2 = balance2 + reward2;
						
						let pct1;
						let pct2;
						try {
							pct1 = parseFloat(document.querySelector(".sc-kpOJdX.eVDhEX.css-1o79l0z").innerText);
						} catch(e) {
							pct1 = 0;
						}
						try {
							pct2 = parseFloat(document.querySelector(".sc-kpOJdX.jLZfGp.css-1s94otz").innerText);
						} catch(e) {
							pct2 = 0;
						}
						
						resolve({
							balance: {
								[tokenId1]: balance1,
								[tokenId2]: balance2,
							},
							reward: {
								[tokenId1]: reward1,
								[tokenId2]: reward2,
							},
							total: {
								[tokenId1]: total1,
								[tokenId2]: total2,
							},
							[tokenId1]: total1,
							[tokenId2]: total2,
							pct1,
							pct2,
						});
					} catch(e) {
						reject(e);
					}
				}, 8000);
			});
		}, {x: 0});
	}
}
cutil.extend(Scraper.prototype, {
	//
});

export {Scraper};
