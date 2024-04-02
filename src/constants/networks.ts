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
  "100": {
    chainId: 100,
    name: "Gnosis",
    symbol: "xDAI",
    explorer: "https://gnosisscan.io",
    rpcUrl:
      "https://nd-316-960-830.p2pify.com/6358ba724050b705cede1d956917ce60",
    wsRpcUrl:
      "wss://ws-nd-316-960-830.p2pify.com/6358ba724050b705cede1d956917ce60",
    communityFactoryAddress: "0xEf101f609eb7CC1965F5e08047C6589bA1fccFF0",
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
    communityFactoryAddress: "0x07aC4b41a8713aAf8137Ed1388ef7f986D01cea6",
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
    communityFactoryAddress: "0x1EaF6B6A6967608aF6c77224f087b042095891EB",
  },
  "84532": {
    chainId: 84532,
    name: "Base Sepolia",
    symbol: "Ether",
    explorer: "https://sepolia.basescan.org/",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
    wsRpcUrl: "wss://base-sepolia-rpc.publicnode.com",
    communityFactoryAddress: "0x35fbB23DEf6346Afa686742B3B39105E0561Fc82",
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
    communityFactoryAddress: "0xbAbabCF5e6459c224B0625A29306c9DE7A593542",
  },
  "44787": {
    chainId: 44787,
    name: "CELO Alfajores",
    symbol: "CELO",
    explorer: "https://alfajores.celoscan.io",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    wsRpcUrl: "wss://rpc-mainnet.maticvigil.com/ws",
    communityFactoryAddress: "0x6b3a1f4277391526413F583c23D5B9EF4d2fE986",
  },
};
