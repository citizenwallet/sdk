import { Contract, ContractRunner } from "ethers";

import ERC20IOUAbi from "smartcontracts/build/contracts/erc20IOU/ERC20IOU.abi.json";

export class ERC20IOUContractService {
  /**
   * The contract instance.
   */
  contract: Contract;

  constructor(contractAddress: string, signer: ContractRunner) {
    this.contract = new Contract(contractAddress, ERC20IOUAbi, signer);
  }

  token(): Promise<string> {
    return this.contract.getFunction("token")();
  }

  redeemed(hash: string): Promise<number> {
    return this.contract.getFunction("redeemed")(hash);
  }

  getHash(
    from: string,
    amount: BigInt,
    validUntil: number,
    validAfter: number,
    sequence: BigInt
  ): Promise<string> {
    return this.contract.getFunction("getHash")(
      from,
      amount,
      validUntil,
      validAfter,
      sequence
    );
  }

  redeem(
    from: string,
    amount: BigInt,
    validUntil: number,
    validAfter: number,
    sequence: BigInt,
    signature: string
  ): Promise<void> {
    return this.contract.getFunction("redeem")(
      from,
      amount,
      validUntil,
      validAfter,
      sequence,
      signature
    );
  }
}
