"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20IOUContract = void 0;
const ethers_1 = require("ethers");
const ERC20IOU_abi_json_1 = __importDefault(require("smartcontracts/build/contracts/erc20IOU/ERC20IOU.abi.json"));
class ERC20IOUContract {
    constructor(contractAddress, signer) {
        this.contract = new ethers_1.Contract(contractAddress, ERC20IOU_abi_json_1.default, signer);
    }
    token() {
        return this.contract.getFunction("token")();
    }
    redeemed(hash) {
        return this.contract.getFunction("redeemed")(hash);
    }
    getHash(from, amount, validUntil, validAfter, sequence) {
        return this.contract.getFunction("getHash")(from, amount, validUntil, validAfter, sequence);
    }
    redeem(from, amount, validUntil, validAfter, sequence, signature) {
        return this.contract.getFunction("redeem")(from, amount, validUntil, validAfter, sequence, signature);
    }
}
exports.ERC20IOUContract = ERC20IOUContract;
//# sourceMappingURL=index.js.map