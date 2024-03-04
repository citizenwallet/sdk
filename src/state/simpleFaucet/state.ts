import { createStore } from "zustand/vanilla";

export type SimpleFaucetStore = {
  loading: boolean;
  error: boolean;
  metadataLoading: boolean;
  metadataError: boolean;
  metadata: {
    token: string;
    amount: number;
    redeemInterval: number;
    redeemAdmin: string;
  };
  request: () => void;
  requestMetadata: () => void;
  fetchContractMetadataSuccess: (metadata: {
    token: string;
    amount: number;
    redeemInterval: number;
    redeemAdmin: string;
  }) => void;
  redeemSuccess: () => void;
  requestMetadataFailed: () => void;
  failed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  loading: false,
  error: false,
  metadataLoading: false,
  metadataError: false,
  metadata: {
    token: "",
    amount: 0,
    redeemInterval: 0,
    redeemAdmin: "",
  },
});

export default createStore<SimpleFaucetStore>((set) => ({
  ...getInitialState(),
  request: () => set({ loading: true, error: false }),
  requestMetadata: () => set({ metadataLoading: true, metadataError: false }),
  fetchContractMetadataSuccess: (metadata) =>
    set({ metadata, metadataLoading: false, metadataError: false }),
  redeemSuccess: () => set({ loading: false, error: false }),
  requestMetadataFailed: () =>
    set({ metadataLoading: false, metadataError: true }),
  failed: () => set({ loading: false, error: true }),
  reset: () => set(getInitialState()),
}));
