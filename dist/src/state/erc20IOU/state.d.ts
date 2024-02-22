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
declare const _default: import("zustand/vanilla").StoreApi<ERC20IOUStore>;
export default _default;
//# sourceMappingURL=state.d.ts.map