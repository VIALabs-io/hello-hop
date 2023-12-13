import { task } from "hardhat/config";

// bugfix for metis + ethers6
const GAS_LIMIT = 0x500000;

task("cl-atw-go", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const network = hre.network.name;
		const [deployer] = await ethers.getSigners();
        
		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));

		const path = [
			"421614",
			"43113",
			"84532",
			"97",
			// "2888", **
			"7701",
			"44787",
			"338",
			"5",
			"17000",
			"11155111",
			"4002",
			"68840142",
			"1452",
			"10200",
			"1666700000",
			"2221",
			"1001",
			"59140",
			"599",
			"42261",
			"23295",
			"65",
			// "1945", **
			"11155420",
			"80001",
			"1442",
			"943",
			// "17001", **
			// "534351", **
			// "41", **
			"195",
			"51",
			// "7001" **
		];


		const atwTest = await ethers.getContract("ATWTest");
		await(await atwTest.connect(signer).go(path, { gasLimit: GAS_LIMIT })).wait();
		console.log('started around the world test');
	});
