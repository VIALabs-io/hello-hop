import { task } from "hardhat/config";

task("go", "")
	.addParam("path", "Chain path, comma seperated ids")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();
        
		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		const pathArray = args.path.split(',');
		
		const helloHOP = await ethers.getContract("HelloHOP");
		await(await helloHOP.connect(signer).go(pathArray)).wait();

		console.log('started HelloHOP using path', args.path);
	});
