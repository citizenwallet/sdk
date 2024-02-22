import { Signer } from "ethers";
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
export declare const getLocalHash: (from: string, amount: bigint, validUntil: number, validFrom: number, sequence: bigint, chainId: bigint, contract: string) => string;
export declare const getSignedHash: (signer: Signer, hash: string) => Promise<string>;
//# sourceMappingURL=utils.d.ts.map