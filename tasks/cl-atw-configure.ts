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

		let prices:any = [];
		let confirmations:any = [];
		for(let x=0; x < chains.length; x++) {
			prices.push(0);
			confirmations.push(1);
		} 

		await (await atwTest.configureBridge(ethers.ZeroAddress, chains, prices, addresses, confirmations, { gasLimit: GAS_LIMIT })).wait();
		
		console.log("Chain statuses set address set!");

	});
