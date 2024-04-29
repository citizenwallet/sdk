import {
  Contract,
  JsonRpcProvider,
  TransactionResponse,
  WebSocketProvider,
  ethers,
} from "ethers";

import TokenEntryPointFactoryAbi from "smartcontracts/build/contracts/tokenEntryPointFactory/TokenEntryPointFactory.abi.json";
import AccountFactoryFactoryAbi from "smartcontracts/build/contracts/accountFactoryFactory/AccountFactoryFactory.abi.json";
import ProfileFactoryAbi from "smartcontracts/build/contracts/profileFactory/ProfileFactory.abi.json";
import { SessionService } from "../../session";
import { Network } from "../../../constants/networks";

export const tokenEntryPointFactory = new ethers.Interface(
  TokenEntryPointFactoryAbi
);
export const accountFactoryFactory = new ethers.Interface(
  AccountFactoryFactoryAbi
);
export const profileFactory = new ethers.Interface(ProfileFactoryAbi);

export class CommunityFactoryContractService {
  /**
   * The contract instance.
   */
  network: Network;
  provider: WebSocketProvider | JsonRpcProvider;
  sessionService: SessionService;
  // contract: Contract;

  constructor(
    network: Network,
    provider: WebSocketProvider | JsonRpcProvider,
    sessionService: SessionService
  ) {
    this.network = network;
    this.provider = provider;
    this.sessionService = sessionService;
  }

  async estimateGasCost(
    contract: Contract,
    fnName: string,
    args: ethers.ContractMethodArgs<any[]>
  ): Promise<bigint> {
    const gas = await contract.getFunction(fnName).estimateGas(...args);

    const { maxFeePerGas } = await this.provider.getFeeData();

    const estimatedCost = gas * (maxFeePerGas || BigInt(1));

    return estimatedCost + estimatedCost / BigInt(10);
  }

  async estimateGasAmount(
    contract: Contract,
    fnName: string,
    args: ethers.ContractMethodArgs<any[]>
  ): Promise<bigint> {
    const gas = await contract.getFunction(fnName).estimateGas(...args);

    return gas + gas / BigInt(10);
  }

  async estimateCreateWithDefaults(
    token: string,
    salt: bigint
  ): Promise<bigint> {
    const wallet = ethers.Wallet.createRandom();

    const profileContract = new Contract(
      this.network.profileFactoryAddress,
      ProfileFactoryAbi,
      this.sessionService.signer
    );

    const profile = await profileContract.getFunction("get")(
      wallet.address,
      salt
    );

    const estimatedCost = await this.estimateGasCost(
      profileContract,
      "create",
      [wallet.address, salt]
    );

    const tepContract = new Contract(
      this.network.tokenEntryPointFactoryAddress,
      TokenEntryPointFactoryAbi,
      this.sessionService.signer
    );

    const estimatedCost1 = await this.estimateGasCost(tepContract, "create", [
      wallet.address,
      wallet.address,
      [token, profile],
      salt,
    ]);

    const affContract = new Contract(
      this.network.accountFactoryFactoryAddress,
      AccountFactoryFactoryAbi,
      this.sessionService.signer
    );

    const [tokenEntryPoint, _] = await tepContract.getFunction("get")(
      wallet.address,
      wallet.address,
      [token, profile],
      salt
    );

    const estimatedCost2 = await this.estimateGasCost(affContract, "create", [
      wallet.address,
      tokenEntryPoint, // intentionally using the wrong address, just for estimation
      salt,
    ]);

    const creationCost = estimatedCost + estimatedCost1 + estimatedCost2;

    return creationCost + creationCost / BigInt(10); // extra margin + whitelist call
  }

  async estimateCreate(
    owner: string,
    sponsor: string,
    token: string,
    salt: bigint
  ): Promise<bigint> {
    const tepfContract = new Contract(
      this.network.tokenEntryPointFactoryAddress,
      TokenEntryPointFactoryAbi,
      this.sessionService.signer
    );

    const profileContract = new Contract(
      this.network.profileFactoryAddress,
      ProfileFactoryAbi,
      this.sessionService.signer
    );

    const profile = await profileContract.getFunction("get")(owner, salt);

    const [tokenEntryPoint, _] = await tepfContract.getFunction("get")(
      owner,
      sponsor,
      [token, profile],
      salt
    );

    const estimatedCost = await this.estimateGasCost(
      profileContract,
      "create",
      [owner, salt]
    );

    const estimatedCost1 = await this.estimateGasCost(tepfContract, "create", [
      owner,
      sponsor,
      [token, profile],
      salt,
    ]);

    const affContract = new Contract(
      this.network.accountFactoryFactoryAddress,
      AccountFactoryFactoryAbi,
      this.sessionService.signer
    );

    const estimatedCost2 = await this.estimateGasCost(affContract, "create", [
      owner,
      tokenEntryPoint, // intentionally using the wrong address, just for estimation
      salt,
    ]);

    const creationCost = estimatedCost + estimatedCost1 + estimatedCost2;

    return creationCost + creationCost / BigInt(10); // extra margin + whitelist call
  }

  async create(
    owner: string,
    sponsor: string,
    token: string,
    salt: bigint
  ): Promise<TransactionResponse> {
    const tepfContract = new Contract(
      this.network.tokenEntryPointFactoryAddress,
      TokenEntryPointFactoryAbi,
      this.sessionService.signer
    );

    const affContract = new Contract(
      this.network.accountFactoryFactoryAddress,
      AccountFactoryFactoryAbi,
      this.sessionService.signer
    );

    const profileContract = new Contract(
      this.network.profileFactoryAddress,
      ProfileFactoryAbi,
      this.sessionService.signer
    );

    const profile = await profileContract.getFunction("get")(owner, salt);

    const { maxFeePerGas = BigInt(1), maxPriorityFeePerGas = BigInt(1) } =
      await this.provider.getFeeData();

    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      throw new Error("Gas fee data not available");
    }

    const feePerGas = maxFeePerGas + maxFeePerGas / BigInt(10);
    const priorityFeePerGas =
      maxPriorityFeePerGas + maxPriorityFeePerGas / BigInt(10);

    // Increase the gas limit by a certain percentage
    let gasAmount = await this.estimateGasAmount(profileContract, "create", [
      owner,
      salt,
    ]);

    let txResponse: TransactionResponse = await profileContract.getFunction(
      "create"
    )(owner, salt, {
      maxFeePerGas: feePerGas,
      maxPriorityFeePerGas: priorityFeePerGas,
      gasLimit: gasAmount,
    });

    await txResponse.wait();

    // Increase the gas limit by a certain percentage
    gasAmount = await this.estimateGasAmount(tepfContract, "create", [
      owner,
      sponsor,
      [token, profile],
      salt,
    ]);

    txResponse = await tepfContract.getFunction("create")(
      owner,
      sponsor,
      [token, profile],
      salt,
      {
        maxFeePerGas: feePerGas,
        maxPriorityFeePerGas: priorityFeePerGas,
        gasLimit: gasAmount,
      }
    );

    await txResponse.wait();

    const [tokenEntryPoint, _] = await tepfContract.getFunction("get")(
      owner,
      sponsor,
      [token, profile],
      salt
    );

    // Increase the gas limit by a certain percentage
    gasAmount = await this.estimateGasAmount(affContract, "create", [
      owner,
      tokenEntryPoint,
      salt,
    ]);

    txResponse = await affContract.getFunction("create")(
      owner,
      tokenEntryPoint,
      salt,
      {
        maxFeePerGas: feePerGas,
        maxPriorityFeePerGas: priorityFeePerGas,
        gasLimit: gasAmount,
      }
    );

    return txResponse;
  }

  async get(
    owner: string,
    sponsor: string,
    token: string,
    salt: bigint
  ): Promise<[string, string, string, string]> {
    const profileContract = new Contract(
      this.network.profileFactoryAddress,
      ProfileFactoryAbi,
      this.sessionService.signer
    );

    const tepfContract = new Contract(
      this.network.tokenEntryPointFactoryAddress,
      TokenEntryPointFactoryAbi,
      this.sessionService.signer
    );

    const affContract = new Contract(
      this.network.accountFactoryFactoryAddress,
      AccountFactoryFactoryAbi,
      this.sessionService.signer
    );

    const profile = await profileContract.getFunction("get")(owner, salt);

    const [tokenEntryPoint, paymaster] = await tepfContract.getFunction("get")(
      owner,
      sponsor,
      [token, profile],
      salt
    );

    const accountFactory = await affContract.getFunction("get")(
      owner,
      tokenEntryPoint,
      salt
    );

    return [tokenEntryPoint, paymaster, accountFactory, profile];
  }
}
