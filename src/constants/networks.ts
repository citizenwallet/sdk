export interface Network {
  chainId: number;
  name: string;
  symbol: string;
  explorer: string;
  rpcUrl: string;
  wsRpcUrl: string;
  communityFactoryAddress: string;
}

interface Networks {
  [key: string]: Network;
}

export const NETWORKS: Networks = {
  "137": {
    chainId: 137,
    name: "Polygon",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    rpcUrl:
      "https://nd-147-012-483.p2pify.com/d8ba4ac942ec62a14e0cc844d373d9d2",
    wsRpcUrl:
      "wss://ws-nd-147-012-483.p2pify.com/d8ba4ac942ec62a14e0cc844d373d9d2",
    communityFactoryAddress: "0x5DD5A9e6C5698EB569A4CA4a8fD3690a699E0742",
  },
  "8453": {
    chainId: 8453,
    name: "Base",
    symbol: "Ether",
    explorer: "https://basescan.org/",
    rpcUrl:
      "https://nd-231-060-478.p2pify.com/1200e5d6ce27d6e7cd61ab0567a9927e",
    wsRpcUrl:
      "wss://ws-nd-231-060-478.p2pify.com/1200e5d6ce27d6e7cd61ab0567a9927e",
    communityFactoryAddress: "0xfB1774EaD62A556DB569b5354b276d7aa4175308",
  },
  "84532": {
    chainId: 84532,
    name: "Base Sepolia",
    symbol: "Ether",
    explorer: "https://sepolia.basescan.org/",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
    wsRpcUrl: "wss://base-sepolia-rpc.publicnode.com",
    communityFactoryAddress: "0x0da2F14429BeF7f7B55009052Ce69B9f5bD129bd",
  },
  "42220": {
    chainId: 42220,
    name: "CELO",
    symbol: "CELO",
    explorer: "https://celoscan.io",
    rpcUrl:
      "https://powerful-bold-lake.celo-mainnet.discover.quiknode.pro/90b75be007c48ab0af5c36c702116f5d863e65dc",
    wsRpcUrl:
      "wss://powerful-bold-lake.celo-mainnet.discover.quiknode.pro/90b75be007c48ab0af5c36c702116f5d863e65dc",
    communityFactoryAddress: "0x944EDEc373b18B8329779F20C6Fd9baf6CB79c81",
  },
  "44787": {
    chainId: 44787,
    name: "CELO Alfajores",
    symbol: "CELO",
    explorer: "https://alfajores.celoscan.io",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    wsRpcUrl: "wss://rpc-mainnet.maticvigil.com/ws",
    communityFactoryAddress: "0xFE213c74e25505B232CE4C7f89647408bE6f71d2",
  },
};
