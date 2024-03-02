import { createStore } from "zustand/vanilla";

export type DeployStore = {
  loading: boolean;
  error: boolean;
  request: () => void;
  success: () => void;
  failed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  loading: true,
  error: false,
});

export default createStore<DeployStore>((set) => ({
  ...getInitialState(),
  request: () => set({ loading: true, error: false }),
  success: () => set({ loading: false, error: false }),
  failed: () => set({ loading: false, error: true }),
  reset: () => set(getInitialState()),
}));
