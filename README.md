# Around The World Bridge Example

The ATWTest.sol contract sends a message from chain to chain, hop to hop, one after another, until
it arrives back at the chain that originally sent the message. Uses the CryptoLink.Tech MessageV3
bridge. 

1. Deploy
   
```node scripts/deploy-testnets.js```

2. Configure:

```node scripts/configure-testnets.js```


3. Execute:

```npx hardhat --network <network name> cl-atw-go```


```
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
```