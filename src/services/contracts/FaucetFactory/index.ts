import {
  BaseWallet,
  Contract,
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionRequest,
  TransactionResponse,
  ethers,
} from "ethers";

import FaucetFactoryAbi from "smartcontracts/build/contracts/faucetFactory/FaucetFactory.abi.json";

export const faucetFactory = new ethers.Interface(FaucetFactoryAbi);

export class FaucetFactoryService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  provider: JsonRpcProvider;
  signer: BaseWallet;
  contract: Contract;

  constructor(
    contractAddress: string,
    provider: JsonRpcProvider,
    signer: BaseWallet
  ) {
    this.contractAddress = contractAddress;
    this.provider = provider;
    this.signer = signer;
    this.contract = new Contract(contractAddress, FaucetFactoryAbi, signer);
  }

  async estimateCreateSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<bigint> {
    const gas = await this.contract
      .getFunction("createSimpleFaucet")
      .estimateGas(
        owner,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        redeemAdmin
      );

    const { maxFeePerGas } = await this.provider.getFeeData();

    const estimatedCost = gas * (maxFeePerGas || 1n);

    return estimatedCost + estimatedCost / 10n;
  }

  async createSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<TransactionResponse> {
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
