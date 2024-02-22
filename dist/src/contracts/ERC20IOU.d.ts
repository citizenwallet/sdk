import { Contract, ContractRunner } from "ethers";
export declare class ERC20IOUContract {
    /**
     * The contract instance.
     */
    contract: Contract;
    constructor(contractAddress: string, signer: ContractRunner);
    token(): Promise<string>;
    redeemed(hash: string): Promise<number>;
    getHash(from: string, amount: BigInt, validUntil: number, validAfter: number, sequence: BigInt): Promise<string>;
    redeem(from: string, amount: BigInt, validUntil: number, validAfter: number, sequence: BigInt, signature: string): Promise<void>;
}
//# sourceMappingURL=ERC20IOU.d.ts.map