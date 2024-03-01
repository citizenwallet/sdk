import { StoreApi, useStore } from "zustand";
import store, { CheckoutStore } from "./state";
import { useEffect, useRef } from "react";
import { SessionService } from "../../services/session";
import { BaseWallet, JsonRpcProvider, getAddress } from "ethers";
import { Config } from "../../services/api/config";

type checkoutStoreSelector<T> = (state: CheckoutStore) => T;

export class CheckoutActions {
  store: StoreApi<CheckoutStore>;

  provider: JsonRpcProvider;
  sessionService: SessionService;

  constructor(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string,
    signer?: BaseWallet | undefined
  ) {
    this.store = store;
    this.provider = provider;
    this.sessionService = new SessionService(
      provider,
      wsUrl,
      accountFactoryAddress,
      signer
    );

    this.store.getState().setSessionOwner(this.sessionService.getOwner());
  }

  updateProvider(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string
  ) {
    this.stopListeners();
    this.provider = provider;
    this.sessionService.updateProvider(provider, wsUrl, accountFactoryAddress);

    this.store.getState().reset();
    this.previousBalance = 0n;

    this.store.getState().setSessionOwner(this.sessionService.getOwner());
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

  getSessionService() {
    return this.sessionService;
  }

  async updateAmountToPay(evaluateAmount: () => Promise<bigint | undefined>) {
    try {
      this.store.getState().checkAmountRequest();

      const amount = (await evaluateAmount()) || 0n;

      this.store.getState().checkAmountSuccess(amount);
    } catch (error) {
      this.store.getState().checkAmountFailed();
    }
  }

  async refund() {
    try {
      this.store.getState().refundRequest();
      const { fees, amount, transaction } = await this.sessionService.refund();

      this.store.getState().refundRequested(fees, amount);

      const txResponse = await transaction;

      await txResponse.wait();

      this.store.getState().refundSuccess();

      return true;
    } catch (error) {
      this.store.getState().refundFailed();
    }

    return false;
  }

  async reset() {
    this.sessionService.reset();
    this.store.getState().reset();

    this.store.getState().setSessionOwner(this.sessionService.getOwner());

    await this.onLoad();
  }

  setSessionOwner(address: string): boolean {
    // parse the address to make sure it's valid
    try {
      const parsedAddress = getAddress(address);

      this.sessionService.setOwner(parsedAddress);
      this.store.getState().setSessionOwner(parsedAddress);
      this.store.getState().setSessionOwnerError(false);

      return true;
    } catch (error) {
      this.store.getState().setSessionOwnerError(true);
    }

    return false;
  }

  private isListening = false;
  private previousBalance: bigint = 0n;
  private isBelowAmountToPay(amount: bigint) {
    if (amount === 0n || this.store.getState().amountToPay.value === 0n) {
      // something is wrong or not yet loaded
      return true;
    }

    return amount < this.store.getState().amountToPay.value;
  }

  private async findSessionOwner(balance: bigint, blockNumber: number) {
    const isBelowAmountToPay = this.isBelowAmountToPay(balance);
    if (
      !isBelowAmountToPay &&
      this.isBelowAmountToPay(this.previousBalance) &&
      this.sessionService.getOwner() === undefined
    ) {
      // the balance of the session has just increased and is now above the amount to pay
      const block = await this.provider.getBlock(blockNumber, true);
      if (block) {
        const txHashes = block.transactions;
        // Check each transaction in the block
        for (const txHash of txHashes) {
          const transaction = block.getPrefetchedTransaction(txHash);

          // If the transaction was sent to the account you're interested in
          if (
            transaction.to === this.sessionService.getAddress() &&
            (transaction.data === "0x" || !transaction.data)
          ) {
            // Call the callback function
            this.sessionService.setOwner(transaction.from);
            store.getState().setSessionOwner(transaction.from);
            break;
          }
        }
      }
    }

    this.previousBalance = balance;
  }

  private createBlockHandler(store: StoreApi<CheckoutStore>) {
    return async (blockNumber: number) => {
      try {
        store.getState().checkSessionBalanceRequest();
        const balance = await this.sessionService.getBalance();

        await this.findSessionOwner(balance, blockNumber);

        store.getState().checkSessionBalanceSuccess(balance);
      } catch (error) {}
    };
  }

  async listenToBalance() {
    try {
      if (this.isListening) {
        return;
      }

      this.isListening = true;
      this.sessionService.listenForBlock(this.createBlockHandler(this.store));
    } catch (error) {
      this.store.getState().checkSessionBalanceFailed();
      this.isListening = false;
    }
  }

  async stopListeners() {
    if (this.isListening) {
      this.isListening = false;
      return this.sessionService.stopListeningForBlocks();
    }
  }
}

export const useCheckout = (
  config: Config
): [<T>(selector: checkoutStoreSelector<T>) => T, CheckoutActions] => {
  const { url: rpcUrl, ws_url: wsUrl } = config.node;
  const { account_factory_address: accountFactoryAddress } = config.erc4337;

  const configActionsRef = useRef(
    new CheckoutActions(
      new JsonRpcProvider(rpcUrl),
      wsUrl,
      accountFactoryAddress
    )
  );

  const useBoundStore = <T>(selector: checkoutStoreSelector<T>) =>
    useStore(configActionsRef.current.store, selector);

  return [useBoundStore, configActionsRef.current];
};
