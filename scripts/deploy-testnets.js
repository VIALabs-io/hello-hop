const { exec } = require("child_process");
const fs = require('fs');

async function deploy() {
    const networks = [
        "arbitrum-sepolia",
        //"aurora-testnet",
        "avalanche-testnet",
        "base-sepolia",
        "binance-testnet",
        "canto-testnet",
        "celo-testnet",
        "cronos-testnet",
        "fantom-testnet",
        "gauss-testnet",
        "gnosis-testnet",
        "harmony-testnet",
        "kava-testnet",
        "linea-testnet",
        "metis-testnet",
        "oasis-emerald-testnet",
        "oasis-sapphire-testnet",
        "okex-testnet",
        "optimism-sepolia",
        "polygon-testnet",
        "polygonzk-testnet",
        "pulse-testnet",
        "scroll-testnet",
        "x1-testnet",
    ];

    // for(let x=0; x < networks.length; x++) {
    //     while(true) {
    //         console.log("deploying ATWTest on " + networks[x] + " ..");
    //         const res = await os.execCommand("npx hardhat --network "+networks[x]+" deploy --tags ATWTest");
    //         if(res !== false) {
    //             break;
    //         } else {
    //             console.log(res);
    //         }
    //     }
    // }

    // let addresses = [];
    // let chainids = [];
    // for(let x=0; x < networks.length; x++) {
    //     const messageTest = require(process.cwd()+"/deployments/"+networks[x]+"/ATWTest.json");
    //     const chainId = fs.readFileSync(process.cwd()+"/deployments/"+networks[x]+"/.chainId").toString();
    //     addresses.push(messageTest.address);
    //     chainids.push(chainId);
    // }

    // let jsonChains = JSON.stringify(chainids, false, 2);
    // fs.writeFileSync('chains-testnet.json', jsonChains);

    // let jsonAddresses = JSON.stringify(addresses, false, 2);
    // fs.writeFileSync('addresses-testnet.json', jsonAddresses);

    for(let x=0; x < networks.length; x++) {
        while(true) {
            console.log("setting up ATWTest on " + networks[x] + " ..");
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
