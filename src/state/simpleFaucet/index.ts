import { useMemo, useRef } from "react";
import { BaseWallet, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { StoreApi, useStore } from "zustand";
import store, { SimpleFaucetStore } from "./state";

import { SimpleFaucetContractService } from "../../services/contracts/SimpleFaucet";
import { BundlerService } from "../../services/bundler";
import { Config } from "../../services/api/config";

type simpleFaucetStoreSelector<T> = (state: SimpleFaucetStore) => T;

/**
 * Represents a way to interact with an SimpleFaucetActions contract.
 */
export class SimpleFaucetActions {
  contract: SimpleFaucetContractService;
  store: StoreApi<SimpleFaucetStore>;

  /**
   * Creates an instance of SimpleFaucetActions.
   * @param provider - The RPC provider.
   * @param contractAddress - The address of the SimpleFaucetActions contract.
   */
  constructor(
    contractAddress: string,
    provider: BaseWallet | JsonRpcProvider,
    account: string,
    bundler: BundlerService
  ) {
    this.contract = new SimpleFaucetContractService(
      contractAddress,
      provider,
      account,
      bundler
    );

    this.store = store;
  }

  /**
   * Fetches the metadata for the simple faucet.
   * This function retrieves the token, amount, redeem interval, and redeem admin from the contract
   * and updates the store with the fetched metadata.
   * If an error occurs during the fetch, it updates the store with a failed state.
   */
  async fetchMetadata() {
    try {
      this.store.getState().requestMetadata();

      const [token, amount, redeemInterval, redeemAdmin] = await Promise.all([
        this.contract.token(),
        this.contract.amount(),
        this.contract.redeemInterval(),
        this.contract.redeemAdmin(),
      ]);

      this.store.getState().fetchContractMetadataSuccess({
        token,
        amount: Number(amount),
        redeemInterval: Number(redeemInterval),
        redeemAdmin,
      });
    } catch (error) {
      this.store.getState().requestMetadataFailed();
    }
  }

  /**
   * Redeems ERC20 IOU tokens.
   */
  async redeem() {
    try {
      this.store.getState().request();
      await this.contract.redeem();
      this.store.getState().redeemSuccess();
    } catch (error) {
      this.store.getState().failed();
    }
  }
}

/**
 * Custom hook for interacting with SimpleFaucetActions contract.
 * @param provider - The provider object for connecting to the blockchain.
 * @param contractAddress - The address of the SimpleFaucetActions contract.
 * @returns An array containing the useBoundStore function and the SimpleFaucetActions instance.
 */
export const useSimpleFaucetContract = (
  contractAddress: string,
  config: Config,
  account: string,
  signer?: BaseWallet
): [<T>(selector: simpleFaucetStoreSelector<T>) => T, SimpleFaucetActions] => {
  const { url: rpcUrl } = config.node;

  const simpleFaucetActions = useMemo(
    () =>
      new SimpleFaucetActions(
        contractAddress,
        signer ?? new JsonRpcProvider(rpcUrl),
        account,
        new BundlerService(config)
      ),
    [contractAddress, rpcUrl, config, account, signer]
  );

  const useBoundStore = <T>(selector: simpleFaucetStoreSelector<T>) =>
    useStore(simpleFaucetActions.store, selector); // TODO: fix the type: (selector: simpleFaucetStoreSelector) => unknown

  return [useBoundStore, simpleFaucetActions];
};
