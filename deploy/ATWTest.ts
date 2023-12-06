import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: any) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy } = hre.deployments;

	const chains = [
		421614, // arbitrum-sepolia
		43113, // avalanche-testnet
		84532, // base-sepolia
		97, // binance-testnet
		44787, // celo-testnet
		338, // cronos-testnet
		4002, // fantom-testnet
		1452, // gauss-testnet
		10200, // gnosis-testnet
		1666700000, // harmony-testnet
		599, // metis-testnet
		65, // okex-testnet
		11155420, // optimism-sepolia
		80001, // polygon-testnet
		1442, // polygonzk-testnet
		943, // pulse-testnet
		534351, // scroll-testnet
		195, // x1-testnet
	];
	
	await deploy("ATWTest", {
		from: deployer,
		args: [chains],
		log: true,
	});

	return hre.network.live;
};

export default func;
func.id = "deploy_atw_test";
func.tags = ["ATWTest"];
func.dependencies = [];
