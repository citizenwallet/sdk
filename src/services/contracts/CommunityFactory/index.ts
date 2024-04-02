import {
  Contract,
  JsonRpcProvider,
  TransactionResponse,
  WebSocketProvider,
  ethers,
} from "ethers";

import CommunityFactoryAbi from "smartcontracts/build/contracts/communityFactory/CommunityFactory.abi.json";
import { SessionService } from "../../session";

export const communityFactory = new ethers.Interface(CommunityFactoryAbi);

export class CommunityFactoryContractService {
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

  async estimateCreateWithDefaults(
    token: string,
    salt: number
  ): Promise<bigint> {
    const wallet = ethers.Wallet.createRandom();

    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );

    const gas = await contract
      .getFunction("create")
      .estimateGas(wallet.address, token, salt);

    const { maxFeePerGas } = await this.provider.getFeeData();

    const estimatedCost = gas * (maxFeePerGas || BigInt(1));

    return estimatedCost + estimatedCost / BigInt(10);
  }

  async estimateCreate(
    owner: string,
    token: string,
    salt: number
  ): Promise<bigint> {
    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );

    const gas = await contract
      .getFunction("create")
      .estimateGas(owner, token, salt);

    const { maxFeePerGas } = await this.provider.getFeeData();

    const estimatedCost = gas * (maxFeePerGas || BigInt(1));

    const margin = estimatedCost / BigInt(2);

    return estimatedCost + margin;
  }

  async create(
    owner: string,
    token: string,
    salt: number
  ): Promise<TransactionResponse> {
    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );

    const { maxFeePerGas, maxPriorityFeePerGas } =
      await this.provider.getFeeData();

    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      throw new Error("Gas fee data not available");
    }

    const feePerGas = maxFeePerGas + maxFeePerGas / BigInt(10);
    const priorityFeePerGas =
      maxPriorityFeePerGas + maxPriorityFeePerGas / BigInt(10);

    // Increase the gas limit by a certain percentage
    const gasUsage = await contract
      .getFunction("create")
      .estimateGas(owner, token, salt);
    const increasedGasLimit = gasUsage + gasUsage / BigInt(5); // increase by 20%

    return contract.getFunction("create")(owner, token, salt, {
      maxFeePerGas: feePerGas,
      maxPriorityFeePerGas: priorityFeePerGas,
      gasLimit: increasedGasLimit,
    });
  }

  async get(
    owner: string,
    token: string,
    salt: number
  ): Promise<[string, string, string, string]> {
    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );
    return contract.getFunction("get")(owner, token, salt);
  }
}
