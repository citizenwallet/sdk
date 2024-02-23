import { createStore } from "zustand/vanilla";

export type SimpleFaucetStore = {
  loading: boolean;
  error: boolean;
  request: () => void;
  redeemSuccess: () => void;
  failed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  loading: false,
  error: false,
});

export default createStore<SimpleFaucetStore>((set) => ({
  ...getInitialState(),
  request: () => set({ loading: true, error: false }),
  redeemSuccess: () => set({ loading: false, error: false }),
  failed: () => set({ loading: false, error: true }),
  reset: () => set(getInitialState()),
}));
