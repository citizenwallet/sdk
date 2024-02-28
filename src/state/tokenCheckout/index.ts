import { StoreApi, useStore } from "zustand";
import store, { TokenCheckoutStore } from "./state";
import { useEffect, useRef } from "react";
import { SessionService } from "../../services/session";
import { BaseWallet, JsonRpcProvider } from "ethers";
import { Config } from "../../services/api/config";
import { ERC20Service } from "../../services/contracts/ERC20";

type checkoutStoreSelector<T> = (state: TokenCheckoutStore) => T;

export class TokenCheckoutActions {
  store: StoreApi<TokenCheckoutStore>;

  sessionService: SessionService;
  token: ERC20Service;

  constructor(
    provider: JsonRpcProvider,
    wsUrl: string,
    tokenAddress: string,
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
    this.token = new ERC20Service(tokenAddress, this.sessionService.signer);
  }

  updateProvider(
    provider: JsonRpcProvider,
    wsUrl: string,
    tokenAddress: string,
    accountFactoryAddress: string
  ) {
    this.stopListeners();
    this.sessionService.updateProvider(provider, wsUrl, accountFactoryAddress);
    this.token = new ERC20Service(tokenAddress, this.sessionService.signer);

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
      const balance = await this.token.balanceOf(address);

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

  private createBlockHandler(store: StoreApi<TokenCheckoutStore>) {
    return async () => {
      try {
        store.getState().checkSessionBalanceRequest();
        const address = await this.sessionService.getAddress();
        const balance = await this.token.balanceOf(address);

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

export const useTokenCheckout = (
  config: Config,
  tokenConfig: Config
): [<T>(selector: checkoutStoreSelector<T>) => T, TokenCheckoutActions] => {
  const { url: rpcUrl, ws_url: wsUrl } = config.node;
  const {
    token: { address: tokenAddress },
    erc4337: { account_factory_address: accountFactoryAddress },
  } = tokenConfig;

  const firstLoadRef = useRef(true);

  const configActionsRef = useRef(
    new TokenCheckoutActions(
      new JsonRpcProvider(rpcUrl),
      wsUrl,
      tokenAddress,
      accountFactoryAddress
    )
  );

  useEffect(() => {
    if (!firstLoadRef.current) {
      configActionsRef.current.updateProvider(
        new JsonRpcProvider(rpcUrl),
        wsUrl,
        tokenAddress,
        accountFactoryAddress
      );
    } else {
      firstLoadRef.current = false;
    }
  }, [rpcUrl, wsUrl, tokenAddress, accountFactoryAddress]);

  const useBoundStore = <T>(selector: checkoutStoreSelector<T>) =>
    useStore(configActionsRef.current.store, selector);

  return [useBoundStore, configActionsRef.current];
};
