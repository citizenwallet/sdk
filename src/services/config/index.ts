import { CONFIG_BASE_URL } from "../../config";
import { ApiService, BaseApiService } from "../api";
import { BaseConfigApiService, Config } from "../api/config";

export class ConfigService {
  constructor(api?: BaseApiService) {
    this.api = (api ?? new ApiService(CONFIG_BASE_URL)).config;
  }

  api: BaseConfigApiService;

  configs?: Config[];

  config?: Config;

  async setConfig() {
    this.configs = await this.api.get();
  }

  async setConfigBySlug(slug: string) {
    this.config = await this.api.getBySlug(slug);
  }

  async get(hidden = false): Promise<Config[]> {
    if (!this.configs) {
      this.configs = await this.api.get();

      return !hidden
        ? this.configs.filter((config) => !config.community.hidden)
        : this.configs;
    }

    this.setConfig();

    return !hidden
      ? this.configs.filter((config) => !config.community.hidden)
      : this.configs;
  }

  async getBySlug(slug: string): Promise<Config> {
    if (!this.config) {
      this.config = await this.api.getBySlug(slug);

      return this.config!;
    }

    this.setConfigBySlug(slug);

    return this.config!;
  }
}
