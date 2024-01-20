import { task } from "hardhat/config";
const chainsConfig = require('@cryptolink/contracts/config/chains');

const fs = require('fs');

// bugfix for metis + ethers6
const GAS_LIMIT = 0x500000;

task("cl-atw-configure", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		console.log("Configuring ATWTest");

		let chains:any;
		let addresses:any;
		if (hre.network.live) {
			console.log("Configuring for LIVE networks");
			chains = JSON.parse(fs.readFileSync("chains-mainnet.json"));
			addresses = JSON.parse(fs.readFileSync("addresses-mainnet.json"));
		} else {
			console.log("Configuring for TEST networks");
			chains = JSON.parse(fs.readFileSync("temp-testnet.json"));
			addresses = JSON.parse(fs.readFileSync("addresses-testnet.json"));
		}

		const atwTest = await ethers.getContract("ATWTest");

		let prices1:any = [];
		let confirmations1:any = [];
		let chains1:any = [];
		let addresses1:any = [];
		for(let x=0; (x < chains.length && x < 20); x++) {
			prices1.push(0);
			confirmations1.push(1);
			chains1.push(chains[x]);
			addresses1.push(addresses[x]);
		}
		if(prices1.length > 0) {
			console.log('setting first set of contract addresses .. CLT message address:', chainsConfig[hre.network.config.chainId].message);
			await (await atwTest.configureClient(chainsConfig[hre.network.config.chainId].message, chains1, addresses1, confirmations1, { gasLimit: GAS_LIMIT })).wait();
		}

		let prices2:any = [];
		let confirmations2:any = [];
		let chains2:any = [];
		let addresses2: any = [];
		for(let x=20; x < chains.length; x++) {
			prices2.push(0);
			confirmations2.push(1);
			chains2.push(chains[x]);
			addresses2.push(addresses[x]);
		}
		if(prices2.length > 0) {
			console.log('setting second set of contract addresses .. CLT message address:', chainsConfig[hre.network.config.chainId].message);
			await (await atwTest.configureClient(chainsConfig[hre.network.config.chainId].message, chains2, addresses2, confirmations2, { gasLimit: GAS_LIMIT })).wait();
		}

		console.log("Chain statuses set address set!");
	});
