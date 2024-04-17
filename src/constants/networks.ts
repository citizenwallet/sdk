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
    tokenEntryPointFactoryAddress: "0xF60866D9B48dAd4459288531C792e959106b4fA6",
    accountFactoryFactoryAddress: "0x3D09435B8fcbF02C02c70a68CF1273492bdC1bab",
    profileFactoryAddress: "0x974F91552D78700C9d65C0f88Dc88A160119A926",
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
    tokenEntryPointFactoryAddress: "0xE30b1F471757710F9b6Dc95CbA7B3bEa081a3E03",
    accountFactoryFactoryAddress: "0x33C26f4b839bCe2a83029E455fDBCB84074F988c",
    profileFactoryAddress: "0x673601Eb36820bC9718214AC041E96f79383351B",
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
    tokenEntryPointFactoryAddress: "0xA5ce28808bAb4D4b2a7e6b6EAdd74c3883c25582",
    accountFactoryFactoryAddress: "0x31918c552F908c235e590184fdAa551dDEfbfbd2",
    profileFactoryAddress: "0x71E4E1bFB14716a7e25EF736131e37Dd4796034c",
  },
  "84532": {
    chainId: 84532,
    name: "Base Sepolia",
    symbol: "Ether",
    explorer: "https://sepolia.basescan.org/",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
    wsRpcUrl: "wss://base-sepolia-rpc.publicnode.com",
    tokenEntryPointFactoryAddress: "0xE79E19594A749330036280c685E2719d58d99052",
    accountFactoryFactoryAddress: "0x948EB31418DDa9bd8d341a0a09A6cf056624901e",
    profileFactoryAddress: "0x45ea2bE6adbD05F4131ae39f7d47e63F49dC8398",
  },
  "42220": {
    chainId: 42220,
    name: "CELO",
    symbol: "CELO",
    explorer: "https://celoscan.io",
    rpcUrl:
      "https://stylish-floral-morning.celo-mainnet.quiknode.pro/1de8e39f6e2189f62b565360b05569f33d40801d",
    wsRpcUrl:
      "wss://stylish-floral-morning.celo-mainnet.quiknode.pro/1de8e39f6e2189f62b565360b05569f33d40801d",
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
    tokenEntryPointFactoryAddress: "0xA63DFccB8a39a3DFE4479b33190b12019Ee594E7",
    accountFactoryFactoryAddress: "0xcA0a75EF803a364C83c5EAE7Eb889aE7419c9dF2",
    profileFactoryAddress: "0xAE76B1C6818c1DD81E20ccefD3e72B773068ABc9",
  },
};
