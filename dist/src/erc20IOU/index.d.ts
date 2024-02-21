import { Provider, Contract, Signer, ContractRunner } from "ethers";
import { StoreApi } from "zustand";
import { ERC20IOUStore } from "./state";
/**
 * Represents a way to interact with an ERC20IOU contract.
 */
export declare class ERC20IOU {
    contract: Contract;
    store: StoreApi<ERC20IOUStore>;
    /**
     * Creates an instance of ERC20IOU.
     * @param provider - The RPC provider.
     * @param contractAddress - The address of the ERC20IOU contract.
     */
    constructor(signer: ContractRunner, contractAddress: string);
    /**
     * Retrieves the hash value for a given set of parameters.
     * @param from - The address of the sender.
     * @param amount - The amount of tokens.
     * @param validUntil - The timestamp until which the transaction is valid.
     * @param validAfter - The timestamp after which the transaction is valid.
     * @param sequence - The sequence number of the transaction.
     */
    getHash(from: string, amount: BigInt, validUntil: number, validAfter: number, sequence: BigInt): Promise<void>;
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
    redeem(from: string, amount: BigInt, validUntil: number, validAfter: number, sequence: BigInt, signature: string): Promise<void>;
}
/**
 * Custom hook for interacting with ERC20IOU contract.
 * @param provider - The provider object for connecting to the blockchain.
 * @param contractAddress - The address of the ERC20IOU contract.
 * @returns An array containing the useBoundStore function and the ERC20IOU instance.
 */
export declare const useERC20IOU: (provider: Provider, contractAddress: string) => (ERC20IOU | ((selector: (state: ERC20IOUStore) => unknown) => unknown))[];
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
export declare const getLocalHash: (from: string, amount: number, validUntil: number, validFrom: number, sequence: number, chainId: number, contract: string) => string;
export declare const getSignedHash: (signer: Signer, hash: string) => Promise<string>;
//# sourceMappingURL=index.d.ts.map