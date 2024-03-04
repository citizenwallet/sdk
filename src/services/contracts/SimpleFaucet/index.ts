import { BaseWallet, Contract, JsonRpcProvider, ethers } from "ethers";

import SimpleFaucetAbi from "smartcontracts/build/contracts/simpleFaucet/SimpleFaucet.abi.json";
import SimpleFaucetBytecode from "smartcontracts/build/contracts/simpleFaucet/SimpleFaucet";
import { BundlerService, UserOp } from "../../bundler";
import { deployContract, estimateContractDeployGas } from "../deploy";

export const simpleFaucet = new ethers.Interface(SimpleFaucetAbi);

export const estimateDeployVoucherFactory = async (
  signer: BaseWallet
): Promise<bigint> => {
  return estimateContractDeployGas({
    signer,
    contractABI: SimpleFaucetAbi,
    contractBytecode: SimpleFaucetBytecode,
  });
};

export const deployVoucherFactory = async (
  signer: BaseWallet
): Promise<string> => {
  return deployContract({
    signer,
    contractABI: SimpleFaucetAbi,
    contractBytecode: SimpleFaucetBytecode,
  });
};

export class SimpleFaucetContractService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  signer: BaseWallet | JsonRpcProvider;
  account: string;
  contract: Contract;
  bundler: BundlerService;

  constructor(
    contractAddress: string,
    signer: BaseWallet | JsonRpcProvider,
    account: string,
    bundler: BundlerService
  ) {
    this.contractAddress = contractAddress;
    this.signer = signer;
    this.account = account;
    this.contract = new Contract(contractAddress, SimpleFaucetAbi, signer);
    this.bundler = bundler;
  }

  token(): Promise<string> {
    return this.contract.getFunction("token")();
  }

  amount(): Promise<bigint> {
    return this.contract.getFunction("amount")();
  }

  redeemInterval(): Promise<bigint> {
    return this.contract.getFunction("redeemInterval")();
  }

  redeemAdmin(): Promise<string> {
    return this.contract.getFunction("redeemAdmin")();
  }

  redeemed(hash: string): Promise<bigint> {
    return this.contract.getFunction("redeemed")(hash);
  }

  redeem(): Promise<UserOp> {
    const calldata = simpleFaucet.encodeFunctionData("redeem", []);
    return this.bundler.submit(
      this.signer as BaseWallet,
      this.account,
      this.contractAddress,
      calldata
    );
  }
}
