import { StoreApi, useStore } from "zustand";
import store, { ConfigStore } from "./state";
import { ConfigService } from "../../services/config";
import { ApiService } from "../../services/api";
import { useRef } from "react";

type configStoreSelector<T> = (state: ConfigStore) => T;

export class ConfigActions {
  store: StoreApi<ConfigStore>;

  configService: ConfigService;

  constructor(apiService?: ApiService) {
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
  const configActionsRef = useRef(
    new ConfigActions(baseUrl ? new ApiService(baseUrl) : undefined)
  );

  const useBoundStore = <T>(selector: configStoreSelector<T>) =>
    useStore(configActionsRef.current.store, selector);

  return [useBoundStore, configActionsRef.current];
};
