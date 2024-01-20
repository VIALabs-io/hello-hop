const fs = require('fs');

async function deploy() {
    const networks = require("../networks-mainnet.json");

    let addresses = [];
    let chainids = [];
    for(let x=0; x < networks.length; x++) {
        const messageTest = require(process.cwd()+"/deployments/"+networks[x]+"/ATWTest.json");
        const chainId = fs.readFileSync(process.cwd()+"/deployments/"+networks[x]+"/.chainId").toString();
        addresses.push(messageTest.address);
        chainids.push(chainId);
    }

    let jsonChains = JSON.stringify(chainids, false, 2);
    fs.writeFileSync('chains-mainnet.json', jsonChains);

    let jsonAddresses = JSON.stringify(addresses, false, 2);
    fs.writeFileSync('addresses-mainnet.json', jsonAddresses);
}
deploy();
