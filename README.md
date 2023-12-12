# Around The World Bridge Example

The ATWTest.sol contract sends a message from chain to chain, hop to hop, one after another, until
it arrives back at the chain that originally sent the message. Uses the CryptoLink.Tech MessageV3
bridge. 

1. Deploy
   
```node scripts/deploy-testnets.js```

2. Dump Configuration:

```node scripts/configure-testnet-create.js```

3. Apply Configuation:
   
```node scripts/configure-testnet-apply.js```

4. Execute:

```npx hardhat --network <network name> cl-atw-go```


```
        "arbitrum-sepolia",
        "avalanche-testnet",
        "base-sepolia",
        "binance-testnet",
        //"boba-testnet", **
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
        // "scroll-testnet", **
        "telos-testnet",
        "x1-testnet",
        "xdc-testnet",
        "zetachain-testnet"
```