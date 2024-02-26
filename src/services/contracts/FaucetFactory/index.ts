import { Contract, JsonRpcSigner, ethers } from "ethers";

import FaucetFactoryAbi from "smartcontracts/build/contracts/faucetFactory/FaucetFactory.abi.json";

export const faucetFactory = new ethers.Interface(FaucetFactoryAbi);

export class FaucetFactoryService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  contract: Contract;

  constructor(contractAddress: string, signer: JsonRpcSigner) {
    this.contractAddress = contractAddress;
    this.contract = new Contract(contractAddress, FaucetFactoryAbi, signer);
  }

  estimateCreateSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<bigint> {
    return this.contract
      .getFunction("createSimpleFaucet")
      .estimateGas(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );
  }

  createSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<void> {
    return this.contract.getFunction("createSimpleFaucet")(
      owner,
      salt,
      tokenAddress,
      redeemAmount,
      redeemInterval,
      redeemAdmin
    );
  }
}
