"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedHash = exports.getLocalHash = void 0;
const ethers_1 = require("ethers");
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
const getLocalHash = (from, amount, validUntil, validFrom, sequence, chainId, contract) => {
    return (0, ethers_1.solidityPackedKeccak256)(["address", "uint256", "uint48", "uint48", "uint256", "uint256", "address"], [from, amount, validUntil, validFrom, sequence, chainId, contract]);
};
exports.getLocalHash = getLocalHash;
const getSignedHash = (signer, hash) => signer.signMessage((0, ethers_1.getBytes)(hash));
exports.getSignedHash = getSignedHash;
//# sourceMappingURL=utils.js.map