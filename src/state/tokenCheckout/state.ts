import { createStore } from "zustand/vanilla";

export type TokenCheckoutStore = {
  sessionAddress: {
    value: string;
    loading: boolean;
    error: boolean;
  };
  checkSessionAddressRequest: () => void;
  checkSessionAddressSuccess: (address: string) => void;
  checkSessionAddressFailed: () => void;
  sessionBalance: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  checkSessionBalanceRequest: () => void;
  checkSessionBalanceSuccess: (balance: bigint) => void;
  checkSessionBalanceFailed: () => void;
  amountToPay: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  checkAmountRequest: () => void;
  checkAmountSuccess: (amountToPay: bigint) => void;
  checkAmountFailed: () => void;
  createLoading: boolean;
  createError: boolean;
  createRequest: () => void;
  createSuccess: () => void;
  createFailed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  sessionAddress: {
    value: "",
    loading: false,
    error: false,
  },
  sessionBalance: {
    value: BigInt(0),
    loading: false,
    error: false,
  },
  amountToPay: {
    value: BigInt(0),
    loading: false,
    error: false,
  },
  createLoading: false,
  createError: false,
});

export default createStore<TokenCheckoutStore>((set) => ({
  ...getInitialState(),
  checkSessionAddressRequest: () =>
    set((state) => ({
      sessionAddress: { ...state.sessionAddress, loading: true, error: false },
    })),
  checkSessionAddressSuccess: (address) =>
    set({
      sessionAddress: { value: address, loading: false, error: false },
    }),
  checkSessionAddressFailed: () =>
    set((state) => ({
      sessionAddress: { ...state.sessionAddress, loading: false, error: true },
    })),
  checkSessionBalanceRequest: () =>
    set((state) => ({
      sessionBalance: { ...state.sessionBalance, loading: true, error: false },
    })),
  checkSessionBalanceSuccess: (balance) =>
    set({
      sessionBalance: { value: balance, loading: false, error: false },
    }),
  checkSessionBalanceFailed: () =>
    set((state) => ({
      sessionBalance: { ...state.sessionBalance, loading: false, error: true },
    })),
  checkAmountRequest: () =>
    set((state) => ({
      amountToPay: { ...state.amountToPay, loading: true, error: false },
    })),
  checkAmountSuccess: (amountToPay) =>
    set({
      amountToPay: { value: amountToPay, loading: false, error: false },
    }),
  checkAmountFailed: () =>
    set((state) => ({
      amountToPay: { ...state.amountToPay, loading: false, error: true },
    })),
  createRequest: () =>
    set({
      createLoading: true,
      createError: false,
    }),
  createSuccess: () =>
    set({
      createLoading: false,
      createError: false,
    }),
  createFailed: () =>
    set({
      createLoading: false,
      createError: true,
    }),
  reset: () => set(getInitialState()),
}));
