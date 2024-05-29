import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@typechain/hardhat";

import "./tasks/go";
import "./tasks/configure";

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const accounts_testnet = [
	process.env.PRIVATE_KEY || "0xa8b700b331ea6e4859843cca6a005577448775a1b9e049dc387a061d6db6ded7",
	"0xcd8cc7d8854e27234a50d1d372de92c612c17a0129923bfbbea0e94017f37fbb",
	"0x06b7ee5e6e301419e8eec0dd92f90bbac64ee6f1db77c93303ef55f69375692b",
	"0x55910bef9a4bb92744801f9d6ea01dcf652c10f3b571ac68e6d45094c2df213e",
	"0x02b3c7996b779fea5807288aa421576cf7982808ee6e648691c6e3686d5b6c1d",
	"0x7d28ecd36e86e9b3d9a6567d7ef91a14c5beb0afbd82bc4836bc92b8262c5625",
	"0x9c22e908420616fbb6b2ad6fd7f15542a83e01c32daa7d0ebf347a2ea8a162e6",
	"0x718b1ad81ce05a22ec5ecd9776ee2285d58e394bae58d321c9fb5ca2d2dda922",
	"0xf1e8602cc4c5dad25abb09f9ca9598484893b2dc3150c5fbc100ae0a4f45f6c2",
	"0x5c7f8cfc9cbc8fce2ec91cc24b1c0dce3fcf28043bb42e7fa74d86b70c522470",
	"0x5a56556177aea615273303e2571141775707cb05cbc81a56fecf36b81d2a192f",
	"0xe14ed48b7e8ad24a2eef5cd44d6a14084b97d863ee6698593d33ec28d6e923b2",
	"0x8c138651817f50e92f6bf76fdbce9156a2891e6278087a085c0cbd3c60a3a921",
	"0xe3c6dcc706c8550dd335a4775043b12d6c95cbad2733cddaea389ada7e5ef4ce",
	"0x5828eeb1b50b6c2feaa97b9bd549707df7f67e535c2f467a93714537d6787e1c",
	"0x5777aff754a3b252aed056d48984e710a3a2edb7916473b812604ceef0f0f6c6",
	"0x8921549702e33672bf5ab068804f232a2fa2afbb91177d75352a253c4ce8f56b",
	"0x99327aa3169f919143aa0ee2c01a04d6ae3869855d65b422200378d0c0c7bf1c",
	"0x94ef63ee9cdbd1c6be3426ed709cb974d1641a0a179503a118ad621cf1672028",
];

const config: any = {
	gasReporter: {
		enabled: true,
		token: "ETH",
		coinmarketcap: process.env.CMC_API_KEY || "",
		//gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice"
		//gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice"
		//gasPriceApi: "https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice"
		//gasPriceApi: "https://api.ftmscan.com/api?module=proxy&action=eth_gasPrice"
	},
	networks: {
		"arbitrum-sepolia": {
			chainId: 421614,
			url: "https://sepolia-rollup.arbitrum.io/rpc",
			live: false,
			accounts: accounts_testnet,
		},
		"aurora-testnet": {
			chainId: 1313161555,
			url: "https://testnet.aurora.dev",
			live: false,
			accounts: accounts_testnet,
		},
		"autonity-testnet": {
			chainId: 65010001,
			url: "https://rpc1.bakerloo.autonity.org",
			live: false,
			accounts: accounts_testnet,
		},		
		"avalanche-testnet": {
			chainId: 43113,
			url: "https://api.avax-test.network/ext/bc/C/rpc",
			live: false,
			accounts: accounts_testnet,
		},
		"base-sepolia": {
			chainId: 84532,
			url: "https://sepolia.base.org",
			live: false,
			accounts: accounts_testnet,
		},
		"binance-testnet": {
			chainId: 97,
			url: "https://data-seed-prebsc-2-s1.binance.org:8545",
			live: false,
			accounts: accounts_testnet,
		},
		"blast-testnet": {
			chainId: 168587773,
			url: "https://sepolia.blast.io",
			live: false,
			accounts: accounts_testnet,
		},
		"boba-testnet": {
			chainId: 2888,
			url: "https://goerli.boba.network",
			live: false,
			accounts: accounts_testnet,
		},		
		"canto-testnet": {
			chainId: 7701,
			url: "https://canto-testnet.plexnode.wtf",
			live: false,
			accounts: accounts_testnet,
		},
		"celo-testnet": {
			chainId: 44787,
			url: "https://alfajores-forno.celo-testnet.org",
			live: false,
			accounts: accounts_testnet,
		},
		"cronos-testnet": {
			chainId: 338,
			url: "https://evm-t3.cronos.org/",
			live: false,
			accounts: accounts_testnet,
		},
		"cronoszk-testnet": {
			chainId: 282,
			url: "https://rpc-zkevm-t0.cronos.org",
			live: false,
			accounts: accounts_testnet,
			zksync: true,
		},
		"ethereum-goerli": {
			chainId: 5,
			url: "https://ethereum-goerli.publicnode.com",
			live: false,
			accounts: accounts_testnet,
		},		
		"ethereum-holesky": {
			chainId: 17000,
			url: "https://ethereum-holesky.publicnode.com",
			live: false,
			accounts: accounts_testnet,
		},		
		"ethereum-sepolia": {
			chainId: 11155111,
			url: "https://eth-sepolia.public.blastapi.io",
			live: false,
			accounts: accounts_testnet,
		},		
		"fantom-testnet": {
			chainId: 4002,
			url: "https://rpc.testnet.fantom.network",
			live: false,
			accounts: accounts_testnet,
		},
		"frame-testnet": {
			chainId: 68840142,
			url: "https://rpc.testnet.frame.xyz/http",
			live: false,
			accounts: accounts_testnet,
		},		
		"gauss-testnet": {
			chainId: 1452,
			url: "https://rpc.giltestnet.com",
			live: false,
			accounts: accounts_testnet,
		},
		"gelato-op-celestia-testnet": {
			chainId: 123420111,
			url: "https://rpc.op-celestia-testnet.gelato.digital",
			live: false,
			accounts: accounts_testnet,
		},
		"gelato-op-testnet": {
			chainId: 42069,
			url: "https://rpc.op-testnet.gelato.digital",
			live: false,
			accounts: accounts_testnet,
		},
		"gelato-zkatana-testnet": {
			chainId: 1261120,
			url: "https://rpc.zkatana.gelato.digital",
			live: false,
			accounts: accounts_testnet,
		},
		"gnosis-testnet": {
			chainId: 10200,
			url: "https://rpc.chiadochain.net",
			live: false,
			accounts: accounts_testnet,
		},
		"harmony-testnet": {
			chainId: 1666700000,
			url: "https://api.s0.b.hmny.io",
			live: false,
			accounts: accounts_testnet,
		},
		"horizen-testnet": {
			chainId: 1663,
			url: "https://gobi-rpc.horizenlabs.io/ethv1",
			live: false,
			accounts: accounts_testnet,
		},		
		"immutable-testnet": {
			chainId: 13473,
			url: "https://rpc.testnet.immutable.com/",
			live: false,
			accounts: accounts_testnet,
		},
		"katla-testnet": {
			chainId: 167008,
			url: "https://rpc.katla.taiko.xyz",
			live: false,
			accounts: accounts_testnet,
		},
		"kava-testnet": {
			chainId: 2221,
			url: "https://evm.testnet.kava.io",
			live: false,
			accounts: accounts_testnet,
		},
		"klaytn-testnet": {
			chainId: 1001,
			url: "https://public-en-baobab.klaytn.net",
			live: false,
			accounts: accounts_testnet,
		},		
		"kyoto-testnet": {
			chainId: 1998,
			url: "https://rpc.testnet.kyotoprotocol.io:8545",
			live: false,
			accounts: accounts_testnet,
		},
		"linea-testnet": {
			chainId: 59140,
			url: "https://rpc.goerli.linea.build",
			live: false,
			accounts: accounts_testnet,
		},		
		"mainnetz-testnet": {
			chainId: 9768,
			url: "https://testnet-rpc.mainnetz.io",
			live: false,
			accounts: accounts_testnet,
		},
		"mantle-testnet": {
			chainId: 5001,
			url: "https://rpc.testnet.mantle.xyz",
			live: false,
			accounts: accounts_testnet,
		},
		"metis-testnet": {
			chainId: 599,
			url: "https://goerli.gateway.metisdevops.link/",
			live: false,
			accounts: accounts_testnet,
		},	
		"oasis-emerald-testnet": {
			chainId: 42261,
			url: "https://testnet.emerald.oasis.dev",
			live: false,
			accounts: accounts_testnet,
		},
		"oasis-sapphire-testnet": {
			chainId: 23295,
			url: "https://testnet.sapphire.oasis.dev",
			live: false,
			accounts: accounts_testnet,
		},
		"okex-testnet": {
			chainId: 65,
			url: "https://exchaintestrpc.okex.org",
			live: false,
			accounts: accounts_testnet,
		},
		"onus-testnet": {
			chainId: 1945,
			url: "https://rpc-testnet.onuschain.io",
			live: false,
			accounts: accounts_testnet,
		},
		"opbnb-testnet": {
			chainId: 5611,
			url: "https://opbnb-testnet-rpc.bnbchain.org",
			live: false,
			accounts: accounts_testnet,
		},
		"optimism-sepolia": {
			chainId: 11155420,
			url: "https://sepolia.optimism.io",
			live: false,
			accounts: accounts_testnet,
		},
		"polygon-testnet": {
			chainId: 80001,
			url: "https://rpc-mumbai.maticvigil.com/",
			live: false,
			accounts: accounts_testnet,
		},
		"polygonzk-testnet": {
			chainId: 1442,
			url: "https://rpc.public.zkevm-test.net",
			live: false,
			accounts: accounts_testnet,
		},
		"pulse-testnet": {
			chainId: 943,
			url: "https://pulsechain-testnet.publicnode.com",
			live: false,
			accounts: accounts_testnet,
		},
		"redstone-testnet": {
			chainId: 17001,
			url: "https://rpc.holesky.redstone.xyz",
			live: false,
			accounts: accounts_testnet,
		},
		"rollux-testnet": {
			chainId: 57000,
			url: "https://rpc-tanenbaum.rollux.com",
			live: false,
			accounts: accounts_testnet,
		},
		"polygon-amoy": {
			chainId: 80002,
			url: 'https://rpc-amoy.polygon.technology/',
			live: false,
			accounts: accounts_testnet,
		},
		"scroll-testnet": {
			chainId: 534351,
			url: "https://sepolia-rpc.scroll.io",
			live: false,
			accounts: accounts_testnet,
		},	
		"sonic-testnet": {
			chainId: 64165,
			url: "https://rpc.sonic.fantom.network/",
			live: false,
			accounts: accounts_testnet,
		},
		"starknet-testnet": {
			chainId: 534351,
			url: "https://json-rpc.starknet-testnet.public.lavanet.xyz",
			live: false,
			accounts: accounts_testnet,
		},	
		"stratos-testnet": {
			chainId: 2047,
			url: "https://web3-rpc-mesos.thestratos.org",
			live: false,
			accounts: accounts_testnet,
		},
		"telos-testnet": {
			chainId: 41,
			url: "https://testnet.telos.net/evm",
			live: false,
			accounts: accounts_testnet,
		},
		"x1-testnet": {
			chainId: 195,
			url: "https://testrpc.x1.tech/",
			live: false,
			accounts: accounts_testnet,
		},
		"xdc-testnet": {
			chainId: 51,
			url: "https://erpc.apothem.network/",
			live: false,
			accounts: accounts_testnet,
		},
		"zetachain-testnet": {
			chainId: 7001,
			url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
			live: false,
			accounts: accounts_testnet,
		},		
		"zksync-testnet": {
			chainId: 280,
			url: "https://testnet.era.zksync.dev",
			live: false,
			accounts: accounts_testnet,
			zksync: true,
		},

		// @note This MUST be hardhat, not localhost the docs are ambigious
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
