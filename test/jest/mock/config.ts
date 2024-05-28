import { BaseConfigApiService, Config } from "../../../src/services/api/config";
import { delay } from "../../../src/utils/delay";

export const getMockConfigs: () => Config[] = () => [
  {
    community: {
      name: "Community 1",
      description: "This is the first mock community",
      url: "https://community1.com",
      alias: "community1",
      logo: "https://community1.com/logo.png",
    },
    scan: {
      url: "https://scan1.com",
      name: "Scan 1",
    },
    indexer: {
      url: "https://indexer1.com",
      ipfs_url: "https://ipfs1.com",
      key: "key1",
    },
    ipfs: {
      url: "https://ipfs1.com",
    },
    node: {
      chain_id: 1,
      url: "https://node1.com",
      ws_url: "wss://node1.com",
    },
    erc4337: {
      rpc_url: "https://rpc1.com",
      entrypoint_address: "0x123",
      account_factory_address: "0x456",
      paymaster_rpc_url: "https://paymasterrpc1.com",
      paymaster_type: "type1",
    },
    token: {
      address: "0x789",
      standard: "ERC20",
      name: "Token 1",
      symbol: "TOK1",
      decimals: 18,
    },
    profile: {
      address: "0xabc",
    },
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
