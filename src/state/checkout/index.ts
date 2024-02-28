import { StoreApi, useStore } from "zustand";
import store, { CheckoutStore } from "./state";
import { useEffect, useRef } from "react";
import { SessionService } from "../../services/session";
import { BaseWallet, JsonRpcProvider } from "ethers";
import { Config, ConfigToken } from "../../services/api/config";
import { ERC20Service } from "../../services/contracts/ERC20";

type checkoutStoreSelector<T> = (state: CheckoutStore) => T;

export class CheckoutActions {
  store: StoreApi<CheckoutStore>;

  sessionService: SessionService;

  constructor(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string,
    signer?: BaseWallet | undefined
  ) {
    this.store = store;
    this.sessionService = new SessionService(
      provider,
      wsUrl,
      accountFactoryAddress,
      signer
    );
  }

  updateProvider(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string
  ) {
    this.stopListeners();
    this.sessionService.updateProvider(provider, wsUrl, accountFactoryAddress);

    this.store.getState().reset();
  }

  getSigner() {
    return this.sessionService.signer;
  }

  async onLoad() {
    try {
      this.store.getState().checkSessionAddressRequest();
      this.store.getState().checkSessionBalanceRequest();

      const address = await this.sessionService.getAddress();
      const balance = await this.sessionService.getBalance();

      this.store.getState().checkSessionAddressSuccess(address);
      this.store.getState().checkSessionBalanceSuccess(balance);
    } catch (error) {
      this.store.getState().checkSessionAddressFailed();
      this.store.getState().checkSessionBalanceFailed();
    }
  }

  async updateAmountToPay(evaluateAmount: () => Promise<bigint>) {
    try {
      this.store.getState().checkAmountRequest();

      const amount = await evaluateAmount();

      this.store.getState().checkAmountSuccess(amount);
    } catch (error) {
      this.store.getState().checkAmountFailed();
    }
  }

  private createBlockHandler(store: StoreApi<CheckoutStore>) {
    return async () => {
      try {
        store.getState().checkSessionBalanceRequest();
        const balance = await this.sessionService.getBalance();

        store.getState().checkSessionBalanceSuccess(balance);
      } catch (error) {}
    };
  }

  async listenBalance() {
    try {
      this.sessionService.listenForBlock(this.createBlockHandler(this.store));
    } catch (error) {
      this.store.getState().checkSessionBalanceFailed();
    }
  }

  async stopListeners() {
    return this.sessionService.stopListeningForBlocks();
  }
}

export const useCheckout = (
  config: Config
): [<T>(selector: checkoutStoreSelector<T>) => T, CheckoutActions] => {
  const { url: rpcUrl, ws_url: wsUrl } = config.node;
  const { account_factory_address: accountFactoryAddress } = config.erc4337;

  const firstLoadRef = useRef(true);

  const configActionsRef = useRef(
    new CheckoutActions(
      new JsonRpcProvider(rpcUrl),
      wsUrl,
      accountFactoryAddress
    )
  );

  useEffect(() => {
    if (!firstLoadRef.current) {
      configActionsRef.current.updateProvider(
        new JsonRpcProvider(rpcUrl),
        wsUrl,
        accountFactoryAddress
      );
    } else {
      firstLoadRef.current = false;
    }
  }, [rpcUrl, wsUrl, accountFactoryAddress]);

  const useBoundStore = <T>(selector: checkoutStoreSelector<T>) =>
    useStore(configActionsRef.current.store, selector);

  return [useBoundStore, configActionsRef.current];
};
