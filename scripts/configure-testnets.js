const { exec } = require("child_process");

async function deploy() {
    const networks = [
        "arbitrum-sepolia",
        "avalanche-testnet",
        "base-sepolia",
        "binance-testnet",
        "celo-testnet",
        "cronos-testnet",
        "fantom-testnet",
        "gauss-testnet",
        "gnosis-testnet",
        "harmony-testnet",
        "metis-testnet",
        "okex-testnet",
        "optimism-sepolia",
        "polygon-testnet",
        "polygonzk-testnet",
        "pulse-testnet",
        "scroll-testnet",
        "x1-testnet",
    ];

    for(let x=0; x < networks.length; x++) {
        console.log("RUNNING ON:", networks[x]);

        // UPDATE cl-messagetest-configure wiht proper addresses first!
        while(true) {
            console.log("setting up ATWTest ..");
            const res = await os.execCommand("npx hardhat --network "+networks[x]+" cl-atw-configure");
            console.log(res);
            if(res !== false) {
                console.log('setup.');
                break;
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
