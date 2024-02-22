import { createStore } from "zustand/vanilla";

export type ERC20IOUStore = {
  hash?: string;
  loading: boolean;
  error: boolean;
  request: () => void;
  getHashSuccess: (hash: string) => void;
  redeemSuccess: () => void;
  failed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  hash: undefined,
  loading: false,
  error: false,
});

export default createStore<ERC20IOUStore>((set) => ({
  ...getInitialState(),
  request: () => set({ loading: true, error: false }),
  getHashSuccess: (hash?: string) =>
    set({
      hash,
      loading: false,
      error: false,
    }),
  redeemSuccess: () => set({ loading: false, error: false }),
  failed: () => set({ loading: false, error: true }),
  reset: () => set(getInitialState()),
}));
