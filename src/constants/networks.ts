export interface Network {
  chainId: number;
  name: string;
  symbol: string;
  explorer: string;
  rpcUrl: string;
  wsRpcUrl: string;
  tokenEntryPointFactoryAddress: string;
  accountFactoryFactoryAddress: string;
  profileFactoryAddress: string;
}

interface Networks {
  [key: string]: Network;
}

export const NETWORKS: Networks = {
  "100": {
    chainId: 100,
    name: "Gnosis",
    symbol: "xDAI",
    explorer: "https://gnosisscan.io",
    rpcUrl:
      "https://nd-186-204-791.p2pify.com/e5512c5ca6fba9a6a20ccbbb8960799f",
    wsRpcUrl:
      "wss://ws-nd-186-204-791.p2pify.com/e5512c5ca6fba9a6a20ccbbb8960799f",
    tokenEntryPointFactoryAddress: "0x",
    accountFactoryFactoryAddress: "0x",
    profileFactoryAddress: "0x",
  },
  "137": {
    chainId: 137,
    name: "Polygon",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    rpcUrl:
      "https://nd-147-012-483.p2pify.com/d8ba4ac942ec62a14e0cc844d373d9d2",
    wsRpcUrl:
      "wss://ws-nd-147-012-483.p2pify.com/d8ba4ac942ec62a14e0cc844d373d9d2",
    tokenEntryPointFactoryAddress: "0x",
    accountFactoryFactoryAddress: "0x",
    profileFactoryAddress: "0x",
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
    tokenEntryPointFactoryAddress: "0x",
    accountFactoryFactoryAddress: "0x",
    profileFactoryAddress: "0x",
  },
  "84532": {
    chainId: 84532,
    name: "Base Sepolia",
    symbol: "Ether",
    explorer: "https://sepolia.basescan.org/",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
    wsRpcUrl: "wss://base-sepolia-rpc.publicnode.com",
    tokenEntryPointFactoryAddress: "0x",
    accountFactoryFactoryAddress: "0x",
    profileFactoryAddress: "0x",
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
    tokenEntryPointFactoryAddress: "0xc67FaCF0B8aF24a61E9D8c333eE379Bb5CEB8254",
    accountFactoryFactoryAddress: "0xA8bdE712d757d6b66E2849c00200F5C87AD3d3e6",
    profileFactoryAddress: "0x0fdB64Edf227e1DACb340b6f60E52cC3d678097d",
  },
  "44787": {
    chainId: 44787,
    name: "CELO Alfajores",
    symbol: "CELO",
    explorer: "https://alfajores.celoscan.io",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    wsRpcUrl: "wss://rpc-mainnet.maticvigil.com/ws",
    tokenEntryPointFactoryAddress: "0x",
    accountFactoryFactoryAddress: "0x",
    profileFactoryAddress: "0x",
  },
};
