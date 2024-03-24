import { StateCreator, createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export type CommunityFactoryStore = {
  communityFactoryGasEstimate: {
    value: bigint;
    loading: boolean;
    error: boolean;
  };
  estimateCommunityFactoryGasRequest: () => void;
  estimateCommunityFactoryGasSuccess: (totalGas: bigint) => void;
  estimateCommunityFactoryGasFailed: () => void;
  get: {
    tokenEntryPoint: string;
    paymaster: string;
    accountFactory: string;
    profile: string;
    loading: boolean;
    error: boolean;
  };
  getCommunityFactoryAddressRequest: () => void;
  getCommunityFactoryAddressSuccess: (
    tokenEntryPoint: string,
    paymaster: string,
    accountFactory: string,
    profile: string
  ) => void;
  getCommunityFactoryAddressFailed: () => void;
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
  communityFactoryGasEstimate: {
    value: BigInt(0),
    loading: false,
    error: false,
  },
  get: {
    tokenEntryPoint: "",
    paymaster: "",
    accountFactory: "",
    profile: "",
    loading: false,
    error: false,
  },
  create: {
    loading: false,
    error: false,
  },
});

export default createStore<CommunityFactoryStore>(
  devtools(
    (set) => ({
      ...getInitialState(),
      estimateCommunityFactoryGasRequest: () =>
        set((state) => ({
          communityFactoryGasEstimate: {
            ...state.communityFactoryGasEstimate,
            loading: true,
            error: false,
          },
        })),
      estimateCommunityFactoryGasSuccess: (totalGas: bigint) =>
        set({
          communityFactoryGasEstimate: {
            value: totalGas,
            loading: false,
            error: false,
          },
        }),
      estimateCommunityFactoryGasFailed: () =>
        set((state) => ({
          communityFactoryGasEstimate: {
            ...state.communityFactoryGasEstimate,
            loading: false,
            error: true,
          },
        })),
      getCommunityFactoryAddressRequest: () =>
        set((state) => ({
          get: {
            ...state.get,
            loading: true,
            error: false,
          },
        })),
      getCommunityFactoryAddressSuccess: (
        tokenEntryPoint: string,
        paymaster: string,
        accountFactory: string,
        profile: string
      ) =>
        set({
          get: {
            tokenEntryPoint,
            paymaster,
            accountFactory,
            profile,
            loading: false,
            error: false,
          },
        }),
      getCommunityFactoryAddressFailed: () =>
        set((state) => ({
          get: {
            ...state.get,
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
    }),
    {
      serialize: {
        replacer: (_key: any, value: any) =>
          typeof value === "bigint" ? value.toString() : value,
      },
      enabled: process.env.NODE_ENV === "development",
    }
  ) as StateCreator<CommunityFactoryStore>
);
