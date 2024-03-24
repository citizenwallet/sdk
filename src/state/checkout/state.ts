import { createStore, StateCreator } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export type CheckoutStore = {
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
  sessionOwner?: string;
  sessionOwnerError: boolean;
  setSessionOwner: (address?: string) => void;
  setSessionOwnerError: (error: boolean) => void;
  refund: {
    fees: bigint;
    amount: bigint;
    loading: boolean;
    error: boolean;
  };
  refundRequest: () => void;
  refundRequested: (fees: bigint, amount: bigint) => void;
  refundSuccess: () => void;
  refundFailed: () => void;
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
  sessionOwner: undefined,
  sessionOwnerError: false,
  refund: {
    fees: BigInt(0),
    amount: BigInt(0),
    loading: false,
    error: false,
  },
});

export default createStore<CheckoutStore>(
  devtools(
    (set) => ({
      ...getInitialState(),
      checkSessionAddressRequest: () =>
        set((state) => ({
          sessionAddress: {
            ...state.sessionAddress,
            loading: true,
            error: false,
          },
        })),
      checkSessionAddressSuccess: (address) =>
        set({
          sessionAddress: { value: address, loading: false, error: false },
        }),
      checkSessionAddressFailed: () =>
        set((state) => ({
          sessionAddress: {
            ...state.sessionAddress,
            loading: false,
            error: true,
          },
        })),
      checkSessionBalanceRequest: () =>
        set((state) => ({
          sessionBalance: {
            ...state.sessionBalance,
            loading: true,
            error: false,
          },
        })),
      checkSessionBalanceSuccess: (balance) =>
        set({
          sessionBalance: { value: balance, loading: false, error: false },
        }),
      checkSessionBalanceFailed: () =>
        set((state) => ({
          sessionBalance: {
            ...state.sessionBalance,
            loading: false,
            error: true,
          },
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
      setSessionOwner: (address?: string) => set({ sessionOwner: address }),
      setSessionOwnerError: (error) => set({ sessionOwnerError: error }),
      refundRequest: () =>
        set({
          refund: {
            fees: BigInt(0),
            amount: BigInt(0),
            loading: true,
            error: false,
          },
        }),
      refundRequested: (fees: bigint, amount: bigint) =>
        set({
          refund: { fees, amount, loading: true, error: false },
        }),
      refundSuccess: () =>
        set((state) => ({
          refund: { ...state.refund, loading: false, error: false },
        })),
      refundFailed: () =>
        set((state) => ({
          refund: { ...state.refund, loading: false, error: true },
        })),
      reset: () => set(getInitialState()),
    }),
    {
      serialize: {
        replacer: (_key: any, value: any) =>
          typeof value === "bigint" ? value.toString() : value,
      },
      enabled: process.env.NODE_ENV === "development",
    }
  ) as StateCreator<CheckoutStore>
);
