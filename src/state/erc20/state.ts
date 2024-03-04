import { createStore } from "zustand/vanilla";
import { Transfer } from "../../services/indexer";

export type ERC20Store = {
  balance: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  balanceRequest: () => void;
  balanceSuccess: (balance: bigint) => void;
  balanceFailed: () => void;
  transfers: {
    transfers: Transfer[];
    loading: boolean;
    error: boolean;
  };
  transfersRequest: () => void;
  transfersSuccessAppend: (transfers: Transfer[]) => void;
  transfersSuccessPrepend: (transfers: Transfer[]) => void;
  transfersSuccess: (transfers: Transfer[]) => void;
  transfersFailed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  balance: {
    value: BigInt(0),
    loading: false,
    error: false,
  },
  transfers: {
    transfers: [],
    loading: false,
    error: false,
  },
});

export default createStore<ERC20Store>((set) => ({
  ...getInitialState(),
  balanceRequest: () =>
    set((state) => ({
      balance: { ...state.balance, loading: true, error: false },
    })),
  balanceSuccess: (balance: bigint) =>
    set({
      balance: { value: balance, loading: false, error: false },
    }),
  balanceFailed: () =>
    set((state) => ({
      balance: { ...state.balance, loading: false, error: true },
    })),
  transfersRequest: () =>
    set((state) => ({
      transfers: { ...state.transfers, loading: true, error: false },
    })),
  transfersSuccessAppend: (transfers: Transfer[]) =>
    set((state) => ({
      transfers: {
        transfers: [...state.transfers.transfers, ...transfers],
        loading: false,
        error: false,
      },
    })),
  transfersSuccessPrepend: (transfers: Transfer[]) =>
    set((state) => ({
      transfers: {
        transfers: [...transfers, ...state.transfers.transfers],
        loading: false,
        error: false,
      },
    })),
  transfersSuccess: (transfers: Transfer[]) =>
    set({
      transfers: { transfers: transfers, loading: false, error: false },
    }),
  transfersFailed: () =>
    set((state) => ({
      transfers: { ...state.transfers, loading: false, error: true },
    })),
  reset: () => set(getInitialState()),
}));
