import { task } from "hardhat/config";

task("cl-atw-go", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const network = hre.network.name;
		const [deployer] = await ethers.getSigners();
        
		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));

		const atwTest = await ethers.getContract("ATWTest");
		await(await atwTest.connect(signer).go()).wait();
		console.log('started around the world test');
	});
