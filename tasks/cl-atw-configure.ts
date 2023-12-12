import { task } from "hardhat/config";
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
			chains = [250, 56, 137, 43114, 1088, 25, 42220, 42262, 1666600000, 8453, 369, 1, 1777];
			addresses = [
				""
			];
		} else {
			console.log("Configuring for TEST networks");
			chains = JSON.parse(fs.readFileSync("chains-testnet.json"));
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
		console.log('1');
		await (await atwTest.configureBridge(ethers.ZeroAddress, chains1, prices1, addresses1, confirmations1, { gasLimit: GAS_LIMIT })).wait();

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
		console.log('2');
		await (await atwTest.configureBridge(ethers.ZeroAddress, chains2, prices2, addresses2, confirmations2, { gasLimit: GAS_LIMIT })).wait();

		console.log("Chain statuses set address set!");

	});
