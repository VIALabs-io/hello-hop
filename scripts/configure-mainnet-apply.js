const { exec } = require("child_process");

async function deploy() {
    const networks = require("../networks-mainnet.json");

    for(let x=0; x < networks.length; x++) {
        while(true) {
            console.log("setting up ATWTest on " + networks[x] + " ..");
            const res = await os.execCommand("npx hardhat --network "+networks[x]+" cl-atw-configure");
            if(res !== false) {
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
