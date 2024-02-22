import { BaseApiService } from "../api";
import { BaseConfigApiService, Config } from "../api/config";

export class ConfigService {
  constructor(api: BaseApiService) {
    this.api = api.config;
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

  async getByAlias(alias: string): Promise<Config> {
    const configs = await this.get();

    const config = configs.find((c) => c.community.alias === alias);
    if (!config) {
      throw new Error("Config not found");
    }

    return config;
  }
}
