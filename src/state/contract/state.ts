import { createStore } from "zustand/vanilla";

export type ContractStore = {
  exists: boolean;
  loading: boolean;
  error: boolean;
  request: () => void;
  checkExistsSuccess: (exists: boolean) => void;
  failed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  exists: false,
  loading: true,
  error: false,
});

export default createStore<ContractStore>((set) => ({
  ...getInitialState(),
  request: () => set({ exists: false, loading: true, error: false }),
  checkExistsSuccess: (exists) =>
    set({
      exists,
      loading: false,
      error: false,
    }),
  failed: () => set({ exists: false, loading: false, error: true }),
  reset: () => set(getInitialState()),
}));
