import { StoreApi, useStore } from "zustand";
import store, { CheckoutStore } from "./state";
import { useRef } from "react";
import { SessionService } from "../../services/session";
import { BaseWallet, JsonRpcProvider } from "ethers";
import { Config } from "../../services/api/config";

type checkoutStoreSelector<T> = (state: CheckoutStore) => T;

export class CheckoutActions {
  store: StoreApi<CheckoutStore>;

  sessionService: SessionService;

  constructor(provider: JsonRpcProvider, signer?: BaseWallet | undefined) {
    this.store = store;
    this.sessionService = new SessionService(provider, signer);
  }

  async onLoad() {
    try {
      this.store.getState().checkSessionAddressRequest();
      this.store.getState().checkSessionBalanceRequest();

      const address = this.sessionService.getAddress();
      const balance = await this.sessionService.getBalance();

      this.store.getState().checkSessionAddressSuccess(address);
      this.store.getState().checkSessionBalanceSuccess(balance);
    } catch (error) {
      this.store.getState().checkSessionAddressFailed();
      this.store.getState().checkSessionBalanceFailed();
    }
  }

  async listenBalance() {
    try {
      this.sessionService.listenForBlock(async () => {
        this.store.getState().checkSessionBalanceRequest();
        const balance = await this.sessionService.getBalance();
        console.log("balance", balance);
        console.log("balance", balance.toString());
        this.store.getState().checkSessionBalanceSuccess(balance);
      });
    } catch (error) {}
  }

  stopListeners() {
    this.sessionService.stopListeningForBlocks();
  }
}

export const useCheckout = (
  config: Config
): [<T>(selector: checkoutStoreSelector<T>) => T, CheckoutActions] => {
  const configActionsRef = useRef(
    new CheckoutActions(new JsonRpcProvider(config.node.url))
  );

  const useBoundStore = <T>(selector: checkoutStoreSelector<T>) =>
    useStore(configActionsRef.current.store, selector);

  return [useBoundStore, configActionsRef.current];
};
