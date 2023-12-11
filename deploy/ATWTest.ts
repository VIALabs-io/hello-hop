import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: any) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy } = hre.deployments;

	const chains = [
		"421614",
		"43113",
		"84532",
		"97",
		"7701",
		"44787",
		"338",
		"4002",
		"1452",
		"10200",
		"1666700000",
		"2221",
		"59140",
		"599",
		"42261",
		"23295",
		"65",
		"11155420",
		"80001",
		"1442",
		"943",
		"534351",
		"195",
		"51"
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
