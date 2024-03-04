import {
  Contract,
  JsonRpcProvider,
  TransactionResponse,
  WebSocketProvider,
  ethers,
} from "ethers";

import FaucetFactoryAbi from "smartcontracts/build/contracts/faucetFactory/FaucetFactory.abi.json";
import { SessionService } from "../../session";

export const faucetFactory = new ethers.Interface(FaucetFactoryAbi);

export class FaucetFactoryContractService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  provider: WebSocketProvider | JsonRpcProvider;
  sessionService: SessionService;
  // contract: Contract;

  constructor(
    contractAddress: string,
    provider: WebSocketProvider | JsonRpcProvider,
    sessionService: SessionService
  ) {
    this.contractAddress = contractAddress;
    this.provider = provider;
    this.sessionService = sessionService;
  }

  async estimateCreateSimpleFaucetWithDefaults(
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number
  ): Promise<bigint> {
    const wallet = ethers.Wallet.createRandom();

    const contract = new Contract(
      this.contractAddress,
      FaucetFactoryAbi,
      this.sessionService.signer
    );

    const gas = await contract
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

    const estimatedCost = gas * (maxFeePerGas || BigInt(1));

    return estimatedCost + estimatedCost / BigInt(10);
  }

  async estimateCreateSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<bigint> {
    const contract = new Contract(
      this.contractAddress,
      FaucetFactoryAbi,
      this.sessionService.signer
    );

    const gas = await contract
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

    const estimatedCost = gas * (maxFeePerGas || BigInt(1));

    return estimatedCost + estimatedCost / BigInt(10);
  }

  async createSimpleFaucet(
    owner: string,
    salt: number,
    tokenAddress: string,
    redeemAmount: number,
    redeemInterval: number,
    redeemAdmin: string
  ): Promise<TransactionResponse> {
    const contract = new Contract(
      this.contractAddress,
      FaucetFactoryAbi,
      this.sessionService.signer
    );
    return contract.getFunction("createSimpleFaucet")(
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
    const contract = new Contract(
      this.contractAddress,
      FaucetFactoryAbi,
      this.sessionService.signer
    );
    return contract.getFunction("getSimpleFaucetAddress")(
      owner,
      salt,
      tokenAddress,
      redeemAmount,
      redeemInterval,
      redeemAdmin
    );
  }
}
