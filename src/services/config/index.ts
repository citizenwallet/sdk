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

  async get(): Promise<Config[]> {
    if (!this.configs) {
      this.configs = await this.api.get();

      return this.configs!;
    }

    this.setConfig();

    return this.configs!;
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
