const fs = require('fs');

async function deploy() {
    const networks = [
        "arbitrum-sepolia",
        "avalanche-testnet",
        "base-sepolia",
        "binance-testnet",
        "boba-testnet",
        "canto-testnet",
        "celo-testnet",
        "cronos-testnet",
        "ethereum-goerli",
        "ethereum-holesky",
        "ethereum-sepolia",
        "fantom-testnet",
        "frame-testnet",
        "gauss-testnet",
        "gnosis-testnet",
        "harmony-testnet",
        "kava-testnet",
        "klaytn-testnet",
        "linea-testnet",
        "metis-testnet",
        "oasis-emerald-testnet",
        "oasis-sapphire-testnet",
        "okex-testnet",
        "onus-testnet",
        "optimism-sepolia",
        "polygon-testnet",
        "polygonzk-testnet",
        "pulse-testnet",
        "redstone-testnet",
        "scroll-testnet",
        "telos-testnet",
        "x1-testnet",
        "xdc-testnet",
        "zetachain-testnet"
    ];

    let addresses = [];
    let chainids = [];
    for(let x=0; x < networks.length; x++) {
        const messageTest = require(process.cwd()+"/deployments/"+networks[x]+"/ATWTest.json");
        const chainId = fs.readFileSync(process.cwd()+"/deployments/"+networks[x]+"/.chainId").toString();
        addresses.push(messageTest.address);
        chainids.push(chainId);
    }

    let jsonChains = JSON.stringify(chainids, false, 2);
    fs.writeFileSync('chains-testnet.json', jsonChains);

    let jsonAddresses = JSON.stringify(addresses, false, 2);
    fs.writeFileSync('addresses-testnet.json', jsonAddresses);
}
deploy();
