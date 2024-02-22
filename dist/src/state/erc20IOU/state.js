"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vanilla_1 = require("zustand/vanilla");
const getInitialState = () => ({
    hash: undefined,
    loading: false,
    error: false,
});
exports.default = (0, vanilla_1.createStore)((set) => ({
    ...getInitialState(),
    request: () => set({ loading: true, error: false }),
    getHashSuccess: (hash) => set({
        hash,
        loading: false,
        error: false,
    }),
    redeemSuccess: () => set({ loading: false, error: false }),
    failed: () => set({ loading: false, error: true }),
    reset: () => set(getInitialState()),
}));
//# sourceMappingURL=state.js.map