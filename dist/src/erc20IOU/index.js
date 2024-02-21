"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedHash = exports.getLocalHash = exports.useERC20IOU = exports.ERC20IOU = void 0;
const react_1 = require("react");
const ethers_1 = require("ethers");
const zustand_1 = require("zustand");
const state_1 = __importDefault(require("./state"));
const ERC20IOU_abi_json_1 = __importDefault(require("smartcontracts/build/contracts/erc20IOU/ERC20IOU.abi.json"));
/**
 * Represents a way to interact with an ERC20IOU contract.
 */
class ERC20IOU {
    /**
     * Creates an instance of ERC20IOU.
     * @param provider - The RPC provider.
     * @param contractAddress - The address of the ERC20IOU contract.
     */
    constructor(signer, contractAddress) {
        // instantiate rpc provider
        this.contract = new ethers_1.Contract(contractAddress, ERC20IOU_abi_json_1.default, signer);
        this.store = state_1.default;
    }
    /**
     * Retrieves the hash value for a given set of parameters.
     * @param from - The address of the sender.
     * @param amount - The amount of tokens.
     * @param validUntil - The timestamp until which the transaction is valid.
     * @param validAfter - The timestamp after which the transaction is valid.
     * @param sequence - The sequence number of the transaction.
     */
    async getHash(from, amount, validUntil, validAfter, sequence) {
        try {
            this.store.getState().request();
            const hash = await this.contract.getFunction("getHash")(from, amount, validUntil, validAfter, sequence);
            this.store.getState().getHashSuccess(hash);
        }
        catch (error) {
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
    async redeem(from, amount, validUntil, validAfter, sequence, signature) {
        try {
            this.store.getState().request();
            await this.contract.getFunction("redeem")(from, amount, validUntil, validAfter, sequence, signature);
            this.store.getState().redeemSuccess();
        }
        catch (error) {
            this.store.getState().failed();
        }
    }
}
exports.ERC20IOU = ERC20IOU;
/**
 * Custom hook for interacting with ERC20IOU contract.
 * @param provider - The provider object for connecting to the blockchain.
 * @param contractAddress - The address of the ERC20IOU contract.
 * @returns An array containing the useBoundStore function and the ERC20IOU instance.
 */
const useERC20IOU = (provider, contractAddress) => {
    const erc20IOURef = (0, react_1.useRef)(new ERC20IOU(provider, contractAddress));
    const useBoundStore = (selector) => (0, zustand_1.useStore)(erc20IOURef.current.store, selector);
    return [useBoundStore, erc20IOURef.current];
};
exports.useERC20IOU = useERC20IOU;
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
//# sourceMappingURL=index.js.map