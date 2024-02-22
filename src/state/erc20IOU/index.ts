import { useRef } from "react";
import {
  Provider,
  Contract,
  solidityPackedKeccak256,
  Signer,
  getBytes,
  ContractRunner,
} from "ethers";
import { StoreApi, useStore } from "zustand";
import store, { ERC20IOUStore } from "./state";

import ERC20IOUAbi from "smartcontracts/build/contracts/erc20IOU/ERC20IOU.abi.json";
import { ERC20IOUContract } from "../../contracts/ERC20IOU";

/**
 * Represents a way to interact with an ERC20IOU contract.
 */
export class ERC20IOU {
  contract: ERC20IOUContract;
  store: StoreApi<ERC20IOUStore>;

  /**
   * Creates an instance of ERC20IOU.
   * @param provider - The RPC provider.
   * @param contractAddress - The address of the ERC20IOU contract.
   */
  constructor(contractAddress: string, signer: ContractRunner) {
    // instantiate rpc provider
    this.contract = new ERC20IOUContract(contractAddress, signer);

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
 * Custom hook for interacting with ERC20IOU contract.
 * @param provider - The provider object for connecting to the blockchain.
 * @param contractAddress - The address of the ERC20IOU contract.
 * @returns An array containing the useBoundStore function and the ERC20IOU instance.
 */
export const useERC20IOU = (contractAddress: string, provider: Provider) => {
  const erc20IOURef = useRef(new ERC20IOU(contractAddress, provider));

  const useBoundStore = (selector: (state: ERC20IOUStore) => unknown) =>
    useStore(erc20IOURef.current.store, selector);

  return [useBoundStore, erc20IOURef.current];
};

/**
 * Calculates the local hash for an ERC20IOU transaction.
 * @param from The address of the sender.
 * @param amount The amount of tokens being transferred.
 * @param validUntil The timestamp until which the transaction is valid.
 * @param validFrom The timestamp from which the transaction is valid.
 * @param sequence The sequence number of the transaction.
 * @param chainId The ID of the blockchain network.
 * @param contract The address of the ERC20IOU contract.
 * @returns The local hash of the transaction.
 */
export const getLocalHash = (
  from: string,
  amount: number,
  validUntil: number,
  validFrom: number,
  sequence: number,
  chainId: number,
  contract: string
) => {
  return solidityPackedKeccak256(
    ["address", "uint256", "uint48", "uint48", "uint256", "uint256", "address"],
    [from, amount, validUntil, validFrom, sequence, chainId, contract]
  );
};

export const getSignedHash = (signer: Signer, hash: string) =>
  signer.signMessage(getBytes(hash));
