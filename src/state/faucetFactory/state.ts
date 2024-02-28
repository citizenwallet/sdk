import { createStore } from "zustand/vanilla";

export type FaucetFactoryStore = {
  simpleFaucetGasEstimate: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  estimateSimpleFaucetGasRequest: () => void;
  estimateSimpleFaucetGasSuccess: (totalGas: bigint) => void;
  estimateSimpleFaucetGasFailed: () => void;
  getSimpleFaucetAddress: {
    value: string;
    loading: boolean;
    error: boolean;
  };
  getSimpleFaucetAddressRequest: () => void;
  getSimpleFaucetAddressSuccess: (address: string) => void;
  getSimpleFaucetAddressFailed: () => void;
  create: {
    loading: boolean;
    error: boolean;
  };
  createRequest: () => void;
  createSuccess: () => void;
  createFailed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  simpleFaucetGasEstimate: {
    value: 0n,
    loading: false,
    error: false,
  },
  getSimpleFaucetAddress: {
    value: "",
    loading: false,
    error: false,
  },
  create: {
    loading: false,
    error: false,
  },
});

export default createStore<FaucetFactoryStore>((set) => ({
  ...getInitialState(),
  estimateSimpleFaucetGasRequest: () =>
    set((state) => ({
      simpleFaucetGasEstimate: {
        ...state.simpleFaucetGasEstimate,
        loading: true,
        error: false,
      },
    })),
  estimateSimpleFaucetGasSuccess: (totalGas: bigint) =>
    set({
      simpleFaucetGasEstimate: {
        value: totalGas,
        loading: false,
        error: false,
      },
    }),
  estimateSimpleFaucetGasFailed: () =>
    set((state) => ({
      simpleFaucetGasEstimate: {
        ...state.simpleFaucetGasEstimate,
        loading: false,
        error: true,
      },
    })),
  getSimpleFaucetAddressRequest: () =>
    set((state) => ({
      getSimpleFaucetAddress: {
        ...state.getSimpleFaucetAddress,
        loading: true,
        error: false,
      },
    })),
  getSimpleFaucetAddressSuccess: (address: string) =>
    set({
      getSimpleFaucetAddress: { value: address, loading: false, error: false },
    }),
  getSimpleFaucetAddressFailed: () =>
    set((state) => ({
      getSimpleFaucetAddress: {
        ...state.getSimpleFaucetAddress,
        loading: false,
        error: true,
      },
    })),
  createRequest: () =>
    set({
      create: { loading: true, error: false },
    }),
  createSuccess: () =>
    set({
      create: { loading: false, error: false },
    }),
  createFailed: () =>
    set({
      create: { loading: false, error: true },
    }),
  reset: () => set(getInitialState()),
}));
