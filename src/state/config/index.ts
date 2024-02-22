import { StoreApi } from "zustand";
import store, { ConfigStore } from "./state";
import { ConfigService } from "../../services/config";
import { ApiService } from "../../services/api";

export class ConfigActions {
  store: StoreApi<ConfigStore>;

  configService: ConfigService;

  constructor(apiService: ApiService) {
    this.store = store;
    this.configService = new ConfigService(apiService);
  }

  async getConfigs() {
    try {
      this.store.getState().request();

      const configs = await this.configService.get();

      this.store.getState().getConfigsSuccess(configs);
    } catch (error) {
      this.store.getState().failed();
    }
  }

  async getConfig(alias: string) {
    try {
      this.store.getState().request();

      const config = await this.configService.getByAlias(alias);

      this.store.getState().getConfigSuccess(config);
    } catch (error) {
      this.store.getState().failed();
    }
  }
}
