const { exec } = require("child_process");

async function deploy() {
    const networks = [
        // "arbitrum-sepolia",
        // //"aurora-testnet",
        // "avalanche-testnet",
        // "base-sepolia",
        // "binance-testnet",
        // "boba-testnet",
        // "canto-testnet",
        // "celo-testnet",
        // "cronos-testnet",
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

    for(let x=0; x < networks.length; x++) {
        while(true) {
            console.log("deploying ATWTest on " + networks[x] + " ..");
            const res = await os.execCommand("npx hardhat --network "+networks[x]+" deploy --tags ATWTest");
            if(res !== false) {
                break;
            } else {
                console.log(res);
            }
        }
    }
}

function os_func() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
            exec(cmd, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(error);
                    console.log(stderr);
                    resolve(false);
                    return;
                }
                resolve(stdout)
            });
       })
   }
}
var os = new os_func();

deploy();
