import "@openzeppelin/hardhat-upgrades";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config } from "dotenv";
import { ethers } from "ethers";

config();

const hhconfig: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ethereum_mainnet: {
      url: process.env.ETHEREUM_MAINNET_RPC_URL,
      gasPrice: Number(ethers.parseUnits("90", "gwei")), // this is 90 Gwei
    },
    polygon_mainnet: {
      url: process.env.POLYGON_MAINNET_RPC_URL,
      gasPrice: Number(ethers.parseUnits("450", "gwei")), // this is 150 Gwei
      timeout: 999999,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
    },
    polygon_testnet: {
      url: process.env.POLYGON_TESTNET_RPC_URL,
      gasPrice: Number(ethers.parseUnits("5", "gwei")), // this is 90 Gwei
      timeout: 999999,
      gas: 12400000,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
    },
    base_mainnet: {
      url: process.env.BASE_MAINNET_RPC_URL,
      gasPrice: Number(ethers.parseUnits("30", "gwei")), // this is 30 Gwei
    },
    base_testnet: {
      url: process.env.BASE_TESTNET_RPC_URL,
      gasPrice: Number(ethers.parseUnits("30", "gwei")), // this is 30 Gwei
    },
    celo_mainnet: {
      url: process.env.CELO_MAINNET_RPC_URL,
      gasPrice: Number(ethers.parseUnits("30", "gwei")), // this is 30 Gwei
    },
    celo_testnet: {
      url: process.env.CELO_TESTNET_RPC_URL,
      gasPrice: Number(ethers.parseUnits("30", "gwei")), // this is 30 Gwei
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHEREUM_MAINNET_ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHEREUM_TESTNET_ETHERSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGON_TESTNET_ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGON_MAINNET_ETHERSCAN_API_KEY || "",
      base_mainnet: process.env.BASE_MAINNET_ETHERSCAN_API_KEY || "",
      base_testnet: process.env.BASE_TESTNET_ETHERSCAN_API_KEY || "",
      celo_mainnet: process.env.CELO_MAINNET_ETHERSCAN_API_KEY || "",
      celo_testnet: process.env.CELO_TESTNET_ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "base_mainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "base_testnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "celo_mainnet",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
      {
        network: "celo_testnet",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
    ],
  },
};

export default hhconfig;
