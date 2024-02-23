import { Signer, getBytes, solidityPackedKeccak256 } from "ethers";

/**
 * Calculates the local hash for an IOU transaction.
 * @param from The address of the sender.
 * @param amount The amount of tokens being transferred.
 * @param validUntil The timestamp until which the transaction is valid.
 * @param validFrom The timestamp from which the transaction is valid.
 * @param sequence The sequence number of the transaction.
 * @param chainId The ID of the blockchain network.
 * @param contract The address of the IOU contract.
 * @returns The local hash of the transaction.
 */
export const getLocalIOUHash = (
  from: string,
  amount: bigint,
  validUntil: number,
  validFrom: number,
  sequence: bigint,
  chainId: bigint,
  contract: string
) => {
  return solidityPackedKeccak256(
    ["address", "uint256", "uint48", "uint48", "uint256", "uint256", "address"],
    [from, amount, validUntil, validFrom, sequence, chainId, contract]
  );
};

export const getSignedHash = (signer: Signer, hash: string) =>
  signer.signMessage(getBytes(hash));
