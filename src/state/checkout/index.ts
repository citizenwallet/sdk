import { StoreApi, useStore } from "zustand";
import store, { CheckoutStore } from "./state";
import { useEffect, useRef } from "react";
import { SessionService } from "../../services/session";
import { BaseWallet, JsonRpcProvider, formatEther } from "ethers";
import { Config } from "../../services/api/config";
import { FaucetFactoryService } from "../../services/contracts/FaucetFactory";
import { FaucetFactories } from "../../config";

type checkoutStoreSelector<T> = (state: CheckoutStore) => T;

export class CheckoutActions {
  store: StoreApi<CheckoutStore>;

  sessionService: SessionService;
  faucetFactoryService: FaucetFactoryService;

  constructor(
    provider: JsonRpcProvider,
    chainId: string,
    signer?: BaseWallet | undefined
  ) {
    this.store = store;
    this.sessionService = new SessionService(provider, signer);
    this.faucetFactoryService = new FaucetFactoryService(
      FaucetFactories[chainId ?? "42220"],
      provider,
      this.sessionService.signer
    );
  }

  updateProvider(provider: JsonRpcProvider, chainId: string) {
    this.sessionService.updateProvider(provider);
    this.faucetFactoryService = new FaucetFactoryService(
      FaucetFactories[chainId ?? "42220"],
      provider,
      this.sessionService.signer
    );

    this.store.getState().reset();
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

  async estimateAmountToPay(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ) {
    try {
      this.store.getState().checkAmountRequest();
      const amount = await this.faucetFactoryService.estimateCreateSimpleFaucet(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );

      this.store.getState().checkAmountSuccess(amount);
    } catch (error) {
      this.store.getState().checkAmountFailed();
    }
  }

  async createSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ) {
    try {
      this.store.getState().createRequest();
      const tx = await this.faucetFactoryService.createSimpleFaucet(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );

      console.log("tx sent");

      await tx.wait();

      console.log("tx confirmed");

      this.store.getState().createSuccess();
    } catch (error) {
      console.log(error);
      this.store.getState().createFailed();
    }
  }

  createBlockHandler(store: StoreApi<CheckoutStore>) {
    return async () => {
      store.getState().checkSessionBalanceRequest();
      const balance = await this.sessionService.getBalance();

      store.getState().checkSessionBalanceSuccess(balance);
    };
  }

  async listenBalance() {
    try {
      this.sessionService.listenForBlock(this.createBlockHandler(this.store));
    } catch (error) {
      this.store.getState().checkSessionBalanceFailed();
    }
  }

  stopListeners() {
    this.sessionService.stopListeningForBlocks();
  }
}

export const useCheckout = (
  config: Config
): [<T>(selector: checkoutStoreSelector<T>) => T, CheckoutActions] => {
  const configActionsRef = useRef(
    new CheckoutActions(
      new JsonRpcProvider(config.node.url),
      config.node.chainId.toString(10)
    )
  );

  useEffect(() => {
    configActionsRef.current.updateProvider(
      new JsonRpcProvider(config.node.url),
      config.node.chainId.toString(10)
    );
  }, [config]);

  const useBoundStore = <T>(selector: checkoutStoreSelector<T>) =>
    useStore(configActionsRef.current.store, selector);

  return [useBoundStore, configActionsRef.current];
};
