import { BaseConfigApiService, Config } from "../../../src/services/api/config";
import { delay } from "../../../src/utils/delay";

export const getMockConfigs: () => Config[] = () => [
  {
    community: {
      name: "My Test Token",
      description: "Test token on Base Sepolia",
      url: "https://test.citizenwallet.xyz",
      alias: "test.citizenwallet.xyz",
      custom_domain: "test.citizenwallet.xyz",
      logo: "https://test.citizenwallet.xyz/uploads/logo.svg",
      theme: {
        primary: "#000000",
      },
    },
    token: {
      standard: "erc20",
      name: "My Test Token",
      address: "0x1D02836fE4938005d4daa602B93b4fAC719Fa261",
      symbol: "MTT",
      decimals: 6,
    },
    scan: {
      url: "https://sepolia.basescan.org/",
      name: "Base Explorer",
    },
    node: {
      url: "https://base-sepolia.core.chainstack.com/dbfda3656e77f263ae70d5627457e07c",
      ws_url:
        "wss://base-sepolia.core.chainstack.com/dbfda3656e77f263ae70d5627457e07c",
      chain_id: 84532,
    },
    ipfs: {
      url: "https://ipfs.internal.citizenwallet.xyz",
    },
    profile: {
      address: "0xa44c2852fCa9C88d9e8BC1C5286E89D9b96d4690",
    },
    indexer: {
      url: "https://test.citizenwallet.xyz/indexer",
      ipfs_url: "https://test.citizenwallet.xyz/indexer",
      key: "x",
    },
    erc4337: {
      rpc_url: "https://test.citizenwallet.xyz/indexer/rpc",
      paymaster_rpc_url: "https://test.citizenwallet.xyz/indexer/rpc",
      entrypoint_address: "0x12e26FAED228c425BceA8a8dd7658a9CeD944dd9",
      paymaster_address: "0x4Cc883b7E8E0BCB2e293703EF06426F9b4A5A284",
      account_factory_address: "0xB8d9412f3A91A00ca762B5c35cd0863E9b716D68",
      paymaster_type: "cw",
    },
    plugins: [
      {
        name: "Top Up",
        icon: "https://gt.celo.citizenwallet.xyz/wallet-config/_images/gt.svg",
        url: "https://preview.topup.citizenspring.xyz/test.citizenwallet.xyz",
        launch_mode: "webview",
      },
    ],
    version: 1,
  },
  {
    community: {
      name: "Beer Token",
      description: "Summer on chain, beer on your keychain.",
      url: "https://beer.citizenwallet.xyz",
      alias: "beer.citizenwallet.xyz",
      custom_domain: "beer.citizenwallet.xyz",
      logo: "https://beer.citizenwallet.xyz/uploads/logo.svg",
      theme: {
        primary: "#000000",
      },
    },
    token: {
      standard: "erc20",
      name: "Beer Token",
      address: "0xEEc0F3257369c6bCD2Fd8755CbEf8A95b12Bc4c9",
      symbol: "BEER",
      decimals: 6,
    },
    scan: {
      url: "https://basescan.org/",
      name: "Base Explorer",
    },
    node: {
      url: "https://nd-231-060-478.p2pify.com/1200e5d6ce27d6e7cd61ab0567a9927e",
      ws_url:
        "wss://ws-nd-231-060-478.p2pify.com/1200e5d6ce27d6e7cd61ab0567a9927e",
      chain_id: 8453,
    },
    ipfs: {
      url: "https://ipfs.internal.citizenwallet.xyz",
    },
    profile: {
      address: "0x68C76CF6e7e28df3fE5853173514712030Ec9929",
    },
    indexer: {
      url: "https://beer.citizenwallet.xyz/indexer",
      ipfs_url: "https://beer.citizenwallet.xyz/indexer",
      key: "x",
    },
    erc4337: {
      rpc_url: "https://beer.citizenwallet.xyz/indexer/rpc",
      paymaster_rpc_url: "https://beer.citizenwallet.xyz/indexer/rpc",
      entrypoint_address: "0xfBc526F19A8275eb21CF12E3017b91be5a7dF548",
      paymaster_address: "0x480489fe4C0F091051395d0EF5d0AFc2eF882405",
      account_factory_address: "0x271e05315787be0E642D07eF19aC57d41E2c450f",
      paymaster_type: "cw",
    },
    plugins: [
      {
        name: "Top Up",
        icon: "https://gt.celo.citizenwallet.xyz/wallet-config/_images/gt.svg",
        url: "https://preview.topup.citizenspring.xyz/beer.citizenwallet.xyz",
        launch_mode: "webview",
      },
    ],
    version: 1,
  },
  {
    community: {
      name: "Community 2",
      description: "This is the second mock community",
      url: "https://community2.com",
      alias: "community2",
      logo: "https://community2.com/logo.png",
    },
    scan: {
      url: "https://scan2.com",
      name: "Scan 2",
    },
    indexer: {
      url: "https://indexer2.com",
      ipfs_url: "https://ipfs2.com",
      key: "key2",
    },
    ipfs: {
      url: "https://ipfs2.com",
    },
    node: {
      chain_id: 2,
      url: "https://node2.com",
      ws_url: "wss://node2.com",
    },
    erc4337: {
      rpc_url: "https://rpc2.com",
      entrypoint_address: "0xdef",
      account_factory_address: "0xghi",
      paymaster_rpc_url: "https://paymasterrpc2.com",
      paymaster_type: "type2",
    },
    token: {
      address: "0xjkl",
      standard: "ERC20",
      name: "Token 2",
      symbol: "TOK2",
      decimals: 18,
    },
    profile: {
      address: "0xmno",
    },
    version: 1,
  },
  {
    community: {
      name: "Community 3",
      description: "This is the second mock community",
      url: "https://community2.com",
      alias: "community2",
      custom_domain: "https://custom.com",
      logo: "https://community2.com/logo.png",
    },
    scan: {
      url: "https://scan2.com",
      name: "Scan 2",
    },
    indexer: {
      url: "https://indexer2.com",
      ipfs_url: "https://ipfs2.com",
      key: "key2",
    },
    ipfs: {
      url: "https://ipfs2.com",
    },
    node: {
      chain_id: 2,
      url: "https://node2.com",
      ws_url: "wss://node2.com",
    },
    erc4337: {
      rpc_url: "https://rpc2.com",
      entrypoint_address: "0xdef",
      account_factory_address: "0xghi",
      paymaster_rpc_url: "https://paymasterrpc2.com",
      paymaster_type: "type2",
    },
    token: {
      address: "0xjkl",
      standard: "ERC20",
      name: "Token 2",
      symbol: "TOK2",
      decimals: 18,
    },
    profile: {
      address: "0xmno",
    },
    version: 1,
  },
];

export class MockConfigApiService implements BaseConfigApiService {
  async get(): Promise<Config[]> {
    await delay(100);

    return getMockConfigs();
  }

  async getBySlug(slug: string): Promise<Config> {
    await delay(100);

    const config = getMockConfigs().find(
      (config) => config.community.alias === slug
    );

    if (!config) {
      throw new Error("Config not found");
    }

    return config;
  }
}
