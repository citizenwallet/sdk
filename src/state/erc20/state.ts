import { StateCreator, createStore } from "zustand/vanilla";
import { Transfer } from "../../services/indexer";
import { devtools } from "zustand/middleware";

export type ERC20Store = {
  balance: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  balanceRequest: () => void;
  balanceSuccess: (balance: bigint) => void;
  balanceFailed: () => void;
  metadata: {
    symbol: string;
    name: string;
    decimals: bigint;
    loading: boolean;
    error: boolean;
  };
  metadataRequest: () => void;
  metadataSuccess: (symbol: string, name: string, decimals: bigint) => void;
  metadataFailed: () => void;
  metadataClear: () => void;
  transfers: {
    transfers: Transfer[];
    loading: boolean;
    error: boolean;
  };
  transfersRequest: () => void;
  transfersSuccessAppend: (transfers: Transfer[]) => void;
  transfersSuccessPrepend: (transfers: Transfer[]) => void;
  transfersPut: (transfers: Transfer[]) => void;
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
  metadata: {
    symbol: "",
    name: "",
    decimals: BigInt(0),
    loading: false,
    error: false,
  },
  transfers: {
    transfers: [],
    loading: false,
    error: false,
  },
});

export default createStore<ERC20Store>(
  devtools(
    (set) => ({
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
      metadataRequest: () =>
        set((state) => ({
          metadata: { ...state.metadata, loading: true, error: false },
        })),
      metadataSuccess: (symbol: string, name: string, decimals: bigint) =>
        set({
          metadata: {
            symbol,
            name,
            decimals,
            loading: false,
            error: false,
          },
        }),
      metadataFailed: () =>
        set((state) => ({
          metadata: { ...state.metadata, loading: false, error: true },
        })),
      metadataClear: () =>
        set({
          metadata: {
            symbol: "",
            name: "",
            decimals: BigInt(0),
            loading: false,
            error: false,
          },
        }),
      transfersRequest: () =>
        set((state) => ({
          transfers: { ...state.transfers, loading: true, error: false },
        })),
      transfersSuccessAppend: (transfers: Transfer[]) =>
        set((state) => {
          const existingTransfers = [...state.transfers.transfers];

          // add or update the transfers based on their hash
          for (const transfer of transfers) {
            const index = existingTransfers.findIndex(
              (t) => t.tx_hash === transfer.tx_hash
            );
            if (index === -1) {
              existingTransfers.push(transfer);
            } else {
              existingTransfers[index] = transfer;
            }
          }

          return {
            transfers: {
              transfers: [...state.transfers.transfers, ...transfers],
              loading: false,
              error: false,
            },
          };
        }),
      transfersSuccessPrepend: (transfers: Transfer[]) =>
        set((state) => ({
          transfers: {
            transfers: [...transfers, ...state.transfers.transfers],
            loading: false,
            error: false,
          },
        })),
      transfersPut: (transfers: Transfer[]) =>
        set((state) => {
          const existingTransfers = [...state.transfers.transfers];

          // add or update the transfers based on their hash
          for (const transfer of transfers) {
            const index = existingTransfers.findIndex(
              (t) => t.tx_hash === transfer.tx_hash
            );
            if (index === -1) {
              existingTransfers.unshift(transfer);
            } else {
              existingTransfers[index] = transfer;
            }
          }

          return {
            transfers: {
              transfers: existingTransfers,
              loading: false,
              error: false,
            },
          };
        }),
      transfersSuccess: (transfers: Transfer[]) =>
        set({
          transfers: { transfers: transfers, loading: false, error: false },
        }),
      transfersFailed: () =>
        set((state) => ({
          transfers: { ...state.transfers, loading: false, error: true },
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
  ) as StateCreator<ERC20Store>
);
