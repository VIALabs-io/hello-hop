
# Around The World Example

## Introduction


## Project Overview
The "Around The World Example" (ATWTest) provides a hands-on experience of using the CryptoLink package for developers looking to integrate cross-chain functionalities into their blockchain applications. It features a smart contract, `ATWTest.sol`, that extends the `MessageClient` class to facilitate a continuous message loop across multiple blockchain networks. This loop demonstrates the intricate process of sending, receiving, and tracking messages in a multi-chain environment.

## Learning Objectives
- Understand the setup and usage of the CryptoLink npm package in a blockchain project.
- Learn how to extend and implement the `MessageClient` class for cross-chain messaging.
- Explore the configuration and deployment of smart contracts on various networks.
- Gain insights into tracking and monitoring cross-chain message flows.

## Prerequisites
- Familiarity with Node.js, npm, and basic command-line operations.
- Experience with Solidity and smart contract development.
- Access to a Solidity development environment, such as Truffle or Hardhat.


## Features
- **Cross-chain Message Passing**: Demonstrates how to send and receive messages between contracts deployed on different blockchain networks using CryptoLink's MessageV3 system.
- **Network Hopping**: Shows the ability of a message to traverse multiple networks and return to the origin, illustrating the robustness of the CryptoLink framework.
- **Event Tracking**: Implements event logs to track the progress and route of the message across various chains, providing visibility into the cross-chain communication process.

## Usage Instructions

1. **Select Networks**: Choose the blockchain networks for deployment by editing `networks-testnet.json`.
   ```bash
   vim networks-testnet.json
   ```
   Example networks include Arbitrum Sepolia, Avalanche Testnet, Binance Testnet, Ethereum Goerli, Polygon Testnet, and others.

2. **Deploy `ATWTest.sol` Contract**:
   Deploy the contract to your chosen networks. Run the following command in your project directory:
   ```bash
   node scripts/deploy-testnets.js
   ```
   This script automates the deployment process across the specified blockchain networks.

3. **Generate Network Configurations**:
   After deployment, generate configuration files for each network:
   ```bash
   node scripts/configure-testnet-create.js
   ```
   This script creates necessary configuration files based on your network selections.

4. **Apply Configurations to Networks**:
   Implement the generated configurations on each network:
   ```bash
   node scripts/configure-testnet-apply.js
   ```
   This step ensures that the `ATWTest.sol` contract on each chain is correctly configured to participate in the message loop.

5. **Initiate the Message Loop**:
   Start the message loop from a specific network using the `cl-atw-go.ts` script. Replace `<network name>` with the name of the network from which you want to start the loop:
   ```bash
   npx hardhat --network <network name> cl-atw-go
   ```
   This command triggers the `go` function in the `ATWTest.sol` contract, beginning the cross-chain message loop.

6. **Monitoring Progress**:
   To track the message's journey, monitor the emitted events (`Go`, `Completed`, `NextHop`) on the blockchain explorers of the involved networks. This will provide insights into the message flow and the cross-chain interactions facilitated by the contract.

## Contributing to the Project

We welcome contributions to the "Around The World Example" project! Whether it's feature enhancements, bug fixes, documentation improvements, or additional examples, your input is valuable. Here’s how you can contribute:

1. **Submit Issues**: If you find bugs or have feature suggestions, please submit them as issues on the GitHub repository.
2. **Pull Requests**: Feel free to fork the repository and submit pull requests with your changes.
3. **Feedback and Ideas**: Share your feedback and ideas on how to improve the project or what additional examples you'd like to see.

## Contact

For more information or if you have specific questions about the project, please reach out to Atlas at atlas@cryptolink.tech. We are eager to assist and collaborate with fellow developers and enthusiasts in the blockchain community.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file in the GitHub repository for details. The MIT License is a permissive license that is short and to the point. It lets people do anything they want with your code as long as they provide attribution back to you and don’t hold you liable.
