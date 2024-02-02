# HelloHOP Path Following Message Example

`HelloHOP` is an example implementation designed to demonstrate the capabilities of CryptoLink.Tech technology in facilitating cross-chain message passing. This sample contract illustrates the use of the [CryptoLink.Tech NPM package](https://github.com/CryptoLinkTech/npm) for enabling messages to traverse multiple blockchain networks via a predefined sequence of chain IDs. It serves primarily as a technical showcase, highlighting the mechanics of cross-chain communication without external bridges in a multi-chain environment.

## Features

- **Multi-Hop Messages**: Facilitates the passage of messages across multiple blockchain networks in a sequential manner.
- **Cross-Chain Functionality**: Demonstrates the ability to conduct cross-chain interactions using the underlying capabilities of the CryptoLink.Tech framework.
- **CryptoLink.Tech Integration**: Implements the CryptoLink.Tech NPM package, showcasing its utility in cross-chain messaging.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js and npm (Node Package Manager)
- A text editor such as VSCode for editing `.sol` and `.ts` files
- GIT installed
- Testnet Tokens 
  - [fantom testnet faucet](https://faucet.fantom.network/) 
  - [polygon testnet faucet](https://faucet.polygon.technology/)
  - [avalanche testnet faucet]()
  - [ethereum holesky testnet faucet]()

Please visit [node documentation link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and the [git install documentation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for more information.



## Installation

Please open a terminal to run the following commands. You can use any terminal of your choice, including the built in terminal in vscode (Terminal -> New Terminal)

1. **Clone the Repository**: 
   ```
   git clone https://github.com/CryptoLinkTech/hello-hop.git
   ```

   After cloning the repository, if using vscode or a similar IDE, you can now open the hello-hop folder in your IDE of choice.

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a new `.env` file to set your EVM private key for contract deployment or copy and edit the existing `.env.example` to `.env`
    ```
    PRIVATE_KEY=0000000000000000000000000000
    ```

## Deployment

Deploy the HelloHOP contract to your desired networks. This must be done for each network you wish to operate on. You can see a list of our networks in the [NPM package documentation](https://github.com/CryptoLinkTech/npm?tab=readme-ov-file#testnets)

1. **Fantom Testnet Deployment:**

```
npx hardhat --network fantom-testnet deploy
```

2. **Polygon Testnet Deployment:**

```
npx hardhat --network polygon-testnet deploy

```
3. **Avalanche Testnet Deployment:**

```
npx hardhat --network avalanche-testnet deploy
```

4. **Ethereum Holesky Testnet Deployment:**

```
npx hardhat --network ethereum-holesky deploy
```

## Configuration

Edit the `networks.ts` file and include all of the networks the contract is deployed on.

```
const networks = [
    "avalanche-testnet",
    "ethereum-holesky",
    "fantom-testnet",
    "polygon-testnet"
];
export default networks;
```

Once all contracts are deployed across the desired networks and listed in `networks.ts`, configure them using the provided script. Remember, if a new network is added later, all contracts must be reconfigured.

1. **Fantom Testnet Configuration:**

```
npx hardhat --network fantom-testnet configure
```

2. **Polygon Testnet Configuration:**

```
npx hardhat --network polygon-testnet configure
```    

1. **Avalanche Testnet Configuration:**

```
npx hardhat --network avalanche-testnet configure
```

2. **Ethereum Holesky Testnet Configuration:**

```
npx hardhat --network ethereum-holesky configure
```    

## Usage

### Initiating a Message

To start a message off, the `go()` method is called on any of the networks the contract is deployed on, and the path desired is set with the `--path` parameter followed by a comma seperated list of Chain IDs. Chain IDs can be looked up in the [NPM package documentation](https://github.com/CryptoLinkTech/npm?tab=readme-ov-file#testnets).

```
npx hardhat --network fantom-testnet go --path 80001,43113,17000
```

