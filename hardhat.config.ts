import dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@typechain/hardhat";

import "./tasks/go";
import "./tasks/configure";

dotenv.config({ path: __dirname + "/.env" });

const accounts = [
	process.env.PRIVATE_KEY
];

const config: any = {
	gasReporter: {
		enabled: true,
		token: "ETH",
		coinmarketcap: process.env.CMC_API_KEY || "",
	},
	networks: {		
		"avalanche-testnet": {
			chainId: 43113,
			url: "https://api.avax-test.network/ext/bc/C/rpc",
			live: false,
			accounts: accounts,
		},
		"ethereum-holesky": {
			chainId: 17000,
			url: "https://ethereum-holesky.publicnode.com",
			live: false,
			accounts: accounts,
		},		
		"ethereum-sepolia": {
			chainId: 11155111,
			url: "https://eth-sepolia.public.blastapi.io",
			live: false,
			accounts: accounts,
		},
		"polygon-amoy": {
			chainId: 80002,
			url: 'https://rpc-amoy.polygon.technology/',
			live: false,
			accounts: accounts,
		},
		hardhat: {
			live: false,
			deploy: ["deploy/hardhat/"],
		},
	},
	namedAccounts: {
		deployer: 0,
		accountant: 1,
	},
	solidity: {
		compilers: [
			{
				version: "0.8.17",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
};

export default config;
