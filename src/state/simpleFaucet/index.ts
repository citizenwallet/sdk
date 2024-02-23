import { useRef } from "react";
import { Provider, ContractRunner } from "ethers";
import { StoreApi, useStore } from "zustand";
import store, { SimpleFaucetStore } from "./state";

import { SimpleFaucetContractService } from "../../services/contracts/SimpleFaucet";

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
  constructor(contractAddress: string, signer: ContractRunner) {
    // instantiate rpc provider
    this.contract = new SimpleFaucetContractService(contractAddress, signer);

    this.store = store;
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
  provider: Provider
) => {
  const simpleFaucetActionsRef = useRef(
    new SimpleFaucetActions(contractAddress, provider)
  );

  const useBoundStore = (selector: (state: SimpleFaucetStore) => unknown) =>
    useStore(simpleFaucetActionsRef.current.store, selector);

  return [useBoundStore, simpleFaucetActionsRef.current];
};
