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

  async estimateCreateWithDefaults(salt: number): Promise<bigint> {
    const wallet = ethers.Wallet.createRandom();

    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );

    const gas = await contract
      .getFunction("create")
      .estimateGas(wallet.address, salt);

    const { maxFeePerGas } = await this.provider.getFeeData();

    const estimatedCost = gas * (maxFeePerGas || BigInt(1));

    return estimatedCost + estimatedCost / BigInt(10);
  }

  async estimateCreate(owner: string, salt: number): Promise<bigint> {
    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );

    const gas = await contract.getFunction("create").estimateGas(owner, salt);

    const { maxFeePerGas } = await this.provider.getFeeData();

    const estimatedCost = gas * (maxFeePerGas || BigInt(1));

    return estimatedCost + estimatedCost / BigInt(10);
  }

  async create(owner: string, salt: number): Promise<TransactionResponse> {
    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );
    return contract.getFunction("create")(owner, salt);
  }

  async get(owner: string, salt: number): Promise<string> {
    const contract = new Contract(
      this.contractAddress,
      CommunityFactoryAbi,
      this.sessionService.signer
    );
    return contract.getFunction("get")(owner, salt);
  }
}
