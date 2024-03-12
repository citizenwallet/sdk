import { StoreApi, useStore } from "zustand";
import store, { ConfigStore } from "./state";
import { ConfigService } from "../../services/config";
import { ApiService } from "../../services/api";
import { useMemo } from "react";

type configStoreSelector<T> = (state: ConfigStore) => T;

export class ConfigActions {
  store: StoreApi<ConfigStore>;

  configService: ConfigService;

  constructor(apiService?: ApiService) {
    this.store = store;
    this.configService = new ConfigService(apiService);
  }

  async getConfigs(hidden = false) {
    try {
      this.store.getState().request();

      const configs = await this.configService.get(hidden);

      this.store.getState().getConfigsSuccess(configs);
    } catch (error) {
      this.store.getState().failed();
    }
  }

  async getConfig(slug: string) {
    try {
      this.store.getState().request();

      const config = await this.configService.getBySlug(slug);

      this.store.getState().getConfigSuccess(config);
    } catch (error) {
      this.store.getState().failed();
    }
  }
}

export const useConfig = (
  baseUrl?: string
): [<T>(selector: configStoreSelector<T>) => T, ConfigActions] => {
  const configActions = useMemo(
    () => new ConfigActions(baseUrl ? new ApiService(baseUrl) : undefined),
    [baseUrl]
  );

  const useBoundStore = <T>(selector: configStoreSelector<T>) =>
    useStore(configActions.store, selector);

  return [useBoundStore, configActions];
};
