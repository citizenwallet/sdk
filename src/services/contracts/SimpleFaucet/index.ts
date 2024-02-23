import { Contract, ContractRunner, JsonRpcSigner, ethers } from "ethers";

import SimpleFaucetAbi from "smartcontracts/build/contracts/simpleFaucet/SimpleFaucet.abi.json";
import { BundlerService, UserOp } from "../../bundler";

export const simpleFaucet = new ethers.Interface(SimpleFaucetAbi);

export class SimpleFaucetContractService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  signer: JsonRpcSigner;
  sender: string;
  contract: Contract;
  bundler: BundlerService;

  constructor(
    contractAddress: string,
    signer: JsonRpcSigner,
    sender: string,
    bundler: BundlerService
  ) {
    this.contractAddress = contractAddress;
    this.signer = signer;
    this.sender = sender;
    this.contract = new Contract(contractAddress, SimpleFaucetAbi, signer);
    this.bundler = bundler;
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

  redeem(): Promise<UserOp> {
    const calldata = simpleFaucet.encodeFunctionData("redeem", []);
    return this.bundler.submit(
      this.signer,
      this.sender,
      this.contractAddress,
      calldata
    );
  }
}
