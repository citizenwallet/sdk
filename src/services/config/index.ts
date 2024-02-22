import { CONFIG_BASE_URL } from "../../config";
import { ApiService, BaseApiService } from "../api";
import { BaseConfigApiService, Config } from "../api/config";

export class ConfigService {
  constructor(api?: BaseApiService) {
    this.api = (api ?? new ApiService(CONFIG_BASE_URL)).config;
  }

  api: BaseConfigApiService;

  config?: Config[];

  async setConfig() {
    this.config = await this.api.get();
  }

  async get(): Promise<Config[]> {
    if (!this.config) {
      this.config = await this.api.get();

      return this.config!;
    }

    this.setConfig();

    return this.config!;
  }

  async getBySlug(slug: string): Promise<Config> {
    const configs = await this.get();

    const config = configs.find((c) => c.community.alias === slug);
    if (!config) {
      throw new Error("Config not found");
    }

    return config;
  }
}
