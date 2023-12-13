# Around The World Bridge Example

## Introduction
The ATWTest.sol contract demonstrates a multi-chain communication protocol using the CryptoLink.Tech MessageV3 bridge. It sends a message across different blockchain networks in a loop, eventually returning to the original sender.

## Prerequisites
- Node.js and npm installed
- Solidity development environment setup (e.g., Truffle or Hardhat)
- Basic understanding of smart contract deployment and interaction

## Features
- Deploy contracts across multiple blockchain networks
- Send and receive messages between contracts on different chains
- Track message hops across networks

## Configuration and Setup
1. **Choose Networks**: Edit `networks.json` to select the blockchain networks for deployment.

    ```bash
    vim networks.json
    ```

    Example networks include: Arbitrum Sepolia, Avalanche Testnet, Binance Testnet, Ethereum Goerli, Polygon Testnet, etc.

2. **Deploy Contracts**: Deploy the ATWTest.sol contract to the selected testnets.

    ```bash
    node scripts/deploy-testnets.js
    ```

3. **Dump Configuration**: Create configuration files for each network.

    ```bash
    node scripts/configure-testnet-create.js
    ```

4. **Apply Configuration**: Apply the generated configuration to each network.

    ```bash
    node scripts/configure-testnet-apply.js
    ```

5. **Execute Message Loop**: Start the message loop from a specified network.

    ```bash
    npx hardhat --network <network name> cl-atw-go
    ```

## Smart Contract Overview
### ATWTest.sol
- Inherits from `MessageV3Client` to enable cross-chain messaging.
- Events: `Go`, `Completed`, `NextHop` for tracking the message flow.
- `go(uint[] calldata _chainlist)`: Initiates the message loop across the specified chain list.
- `messageProcess(...)`: Handles received messages and determines the next hop.
- Internal logic for determining the next chain in the loop.

## Usage
1. Deploy the contract to your chosen networks using the provided scripts.
2. Start the message loop by executing the `go` function with a list of chain IDs.
3. Monitor events to track the progress of the message across networks.

## Contribution
Feel free to contribute to this project by submitting issues or pull requests.

## Contact
For more information, contact Atlas at atlas@cryptolink.tech

## License
This project is licensed under the MIT License.