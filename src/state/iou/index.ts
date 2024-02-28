import { useRef } from "react";
import { Provider, ContractRunner } from "ethers";
import { StoreApi, useStore } from "zustand";
import store, { ERC20IOUStore } from "./state";

import { IOUContractService } from "../../services/contracts/IOU";

type erc20IOUStoreSelector<T> = (state: ERC20IOUStore) => T;

/**
 * Represents a way to interact with an ERC20IOUActions contract.
 */
export class ERC20IOUContractActions {
  contract: IOUContractService;
  store: StoreApi<ERC20IOUStore>;

  /**
   * Creates an instance of ERC20IOUActions.
   * @param provider - The RPC provider.
   * @param contractAddress - The address of the ERC20IOUActions contract.
   */
  constructor(contractAddress: string, signer: ContractRunner) {
    // instantiate rpc provider
    this.contract = new IOUContractService(contractAddress, signer);

    this.store = store;
  }

  /**
   * Retrieves the hash value for a given set of parameters.
   * @param from - The address of the sender.
   * @param amount - The amount of tokens.
   * @param validUntil - The timestamp until which the transaction is valid.
   * @param validAfter - The timestamp after which the transaction is valid.
   * @param sequence - The sequence number of the transaction.
   */
  async getHash(
    from: string,
    amount: BigInt,
    validUntil: number,
    validAfter: number,
    sequence: BigInt
  ) {
    try {
      this.store.getState().request();

      const hash = await this.contract.getHash(
        from,
        amount,
        validUntil,
        validAfter,
        sequence
      );

      this.store.getState().getHashSuccess(hash);
    } catch (error) {
      this.store.getState().failed();
    }
  }

  /**
   * Redeems ERC20 IOU tokens.
   *
   * @param from - The address of the sender.
   * @param amount - The amount of tokens to redeem.
   * @param validUntil - The timestamp until which the redemption is valid.
   * @param validAfter - The timestamp after which the redemption is valid.
   * @param sequence - The sequence number of the redemption.
   * @param signature - The signature for the redemption.
   */
  async redeem(
    from: string,
    amount: BigInt,
    validUntil: number,
    validAfter: number,
    sequence: BigInt,
    signature: string
  ) {
    try {
      this.store.getState().request();
      await this.contract.redeem(
        from,
        amount,
        validUntil,
        validAfter,
        sequence,
        signature
      );
      this.store.getState().redeemSuccess();
    } catch (error) {
      this.store.getState().failed();
    }
  }
}

/**
 * Custom hook for interacting with ERC20IOUActions contract.
 * @param provider - The provider object for connecting to the blockchain.
 * @param contractAddress - The address of the ERC20IOUActions contract.
 * @returns An array containing the useBoundStore function and the ERC20IOUActions instance.
 */
export const useIOUContract = (
  contractAddress: string,
  provider: Provider
): [<T>(selector: erc20IOUStoreSelector<T>) => T, ERC20IOUContractActions] => {
  const erc20IOUActionsRef = useRef(
    new ERC20IOUContractActions(contractAddress, provider)
  );

  const useBoundStore = <T>(selector: erc20IOUStoreSelector<T>) =>
    useStore(erc20IOUActionsRef.current.store, selector);

  return [useBoundStore, erc20IOUActionsRef.current];
};
