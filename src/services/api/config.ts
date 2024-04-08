import { BaseApi } from "./api";
import { randomCacheNumber } from "./utils";

export interface ConfigCommunityTheme {
  primary: string;
}

export interface ConfigCommunity {
  name: string;
  description: string;
  url: string;
  alias: string;
  logo: string;
  custom_domain?: string;
  hidden?: boolean;
  theme?: ConfigCommunityTheme;
}

export interface ConfigToken {
  address: string;
  standard: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface ConfigScan {
  url: string;
  name: string;
}

export interface ConfigIndexer {
  url: string;
  ipfs_url: string;
  key: string;
}

export interface ConfigNode {
  chain_id: number;
  url: string;
  ws_url: string;
}

export interface ConfigERC4337 {
  rpc_url: string;
  paymaster_address?: string;
  entrypoint_address: string;
  account_factory_address: string;
  paymaster_rpc_url: string;
  paymaster_type: string;
  gas_extra_percentage?: number;
}

export interface ConfigIPFS {
  url: string;
}

export interface ConfigProfile {
  address: string;
}

export interface Config {
  community: ConfigCommunity;
  scan: ConfigScan;
  indexer: ConfigIndexer;
  ipfs: ConfigIPFS;
  node: ConfigNode;
  erc4337: ConfigERC4337;
  token: ConfigToken;
  profile: ConfigProfile;
  plugins?: {
    name: string;
    icon: string;
    url: string;
    launch_mode?: string;
  }[];
  version: number;
}

export abstract class BaseConfigApiService {
  abstract get(): Promise<Config[]>;
  abstract getBySlug(slug: string): Promise<Config>;
}

export class ConfigApiService implements BaseConfigApiService {
  private api: BaseApi;

  constructor(api: BaseApi) {
    this.api = api;
  }

  async get(): Promise<Config[]> {
    const url = "/v3/communities.json?cacheBuster=" + randomCacheNumber();

    return this.api.get(url);
  }

  async getBySlug(slug: string): Promise<Config> {
    const url = `/v3/${slug}.json?cacheBuster=` + randomCacheNumber();

    return this.api.get(url);
  }
}
