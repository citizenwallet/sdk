import { Contract, ContractRunner } from "ethers";

import SimpleFaucetAbi from "smartcontracts/build/contracts/simpleFaucet/SimpleFaucet.abi.json";

export class SimpleFaucetContractService {
  /**
   * The contract instance.
   */
  contract: Contract;

  constructor(contractAddress: string, signer: ContractRunner) {
    this.contract = new Contract(contractAddress, SimpleFaucetAbi, signer);
  }

  token(): Promise<string> {
    return this.contract.getFunction("token")();
  }

  amount(): Promise<number> {
    return this.contract.getFunction("amount")();
  }

  redeemInterval(): Promise<number> {
    return this.contract.getFunction("redeemInterval")();
  }

  redeemAdmin(): Promise<string> {
    return this.contract.getFunction("redeemAdmin")();
  }

  redeemed(hash: string): Promise<number> {
    return this.contract.getFunction("redeemed")(hash);
  }

  redeem(): Promise<void> {
    return this.contract.getFunction("redeem")();
  }
}
