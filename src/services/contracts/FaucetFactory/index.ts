import {
  BaseWallet,
  Contract,
  JsonRpcProvider,
  TransactionResponse,
  WebSocketProvider,
  ethers,
} from "ethers";

import FaucetFactoryAbi from "smartcontracts/build/contracts/faucetFactory/FaucetFactory.abi.json";

export const faucetFactory = new ethers.Interface(FaucetFactoryAbi);

export class FaucetFactoryContractService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  provider: WebSocketProvider | JsonRpcProvider;
  signer: BaseWallet;
  contract: Contract;

  constructor(
    contractAddress: string,
    provider: WebSocketProvider | JsonRpcProvider,
    signer: BaseWallet
  ) {
    this.contractAddress = contractAddress;
    this.provider = provider;
    this.signer = signer;
    this.contract = new Contract(contractAddress, FaucetFactoryAbi, signer);
  }

  async estimateCreateSimpleFaucetWithDefaults(
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number
  ): Promise<bigint> {
    const wallet = ethers.Wallet.createRandom();

    const gas = await this.contract
      .getFunction("createSimpleFaucet")
      .estimateGas(
        wallet.address,
        salt,
        tokenAddress,
        redeemAmount,
        redeemInterval,
        wallet.address
      );

    const { maxFeePerGas } = await this.provider.getFeeData();

    const estimatedCost = gas * (maxFeePerGas || 1n);

    return estimatedCost + estimatedCost / 10n;
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

  async getSimpleFaucetAddress(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<string> {
    return this.contract.getFunction("getSimpleFaucetAddress")(
      owner,
      salt,
      tokenAddress,
      redeemAmount,
      redeemInterval,
      redeemAdmin
    );
  }
}
