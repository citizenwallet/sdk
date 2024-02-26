import { createStore } from "zustand/vanilla";
import { Config } from "../../services/api/config";

export type ConfigStore = {
  config?: Config;
  configs?: Config[];
  loading: boolean;
  error: boolean;
  request: () => void;
  getConfigSuccess: (config: Config) => void;
  getConfigsSuccess: (configs: Config[]) => void;
  failed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  config: undefined,
  configs: undefined,
  loading: true,
  error: false,
});

export default createStore<ConfigStore>((set) => ({
  ...getInitialState(),
  request: () => set({ loading: true, error: false }),
  getConfigSuccess: (config: Config) =>
    set({
      config,
      loading: false,
      error: false,
    }),
  getConfigsSuccess: (configs: Config[]) =>
    set({ configs, loading: false, error: false }),
  failed: () => set({ loading: false, error: true }),
  reset: () => set(getInitialState()),
}));
