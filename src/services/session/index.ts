import {
  BaseWallet,
  JsonRpcProvider,
  TransactionResponse,
  Wallet,
  WebSocketProvider,
  parseUnits,
} from "ethers";
import { createWebSocketProvider } from "../wsprovider";
import { delay } from "../../utils/delay";
import { AccountFactoryService } from "../contracts/AccountFactory";
import { localStorage } from "../storage";

interface RefundRequest {
  fees: bigint;
  amount: bigint;
  transaction: Promise<TransactionResponse>;
}

export class SessionService {
  signer: BaseWallet;
  wsUrl: string;
  accountFactoryService?: AccountFactoryService;

  rpcProvider: JsonRpcProvider;

  provider?: WebSocketProvider;
  owner?: string;
  accountAddress?: string;
  constructor(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress?: string,
    signer?: BaseWallet
  ) {
    this.wsUrl = wsUrl;
    this.rpcProvider = provider;

    if (signer) {
      this.signer = signer.connect(provider);
      if (accountFactoryAddress) {
        this.accountFactoryService = new AccountFactoryService(
          accountFactoryAddress,
          this.signer
        );
      }
      localStorage.setItem("cw-session-key", signer.signingKey.privateKey);
      this.getOwner();
      return;
    }

    const key = localStorage.getItem("cw-session-key");
    this.getOwner();
    if (key) {
      const wallet = new Wallet(key);
      this.signer = wallet.connect(provider);
      if (accountFactoryAddress) {
        this.accountFactoryService = new AccountFactoryService(
          accountFactoryAddress,
          this.signer
        );
      }
      return;
    }

    const wallet = Wallet.createRandom();
    this.signer = wallet.connect(provider);
    if (accountFactoryAddress) {
      this.accountFactoryService = new AccountFactoryService(
        accountFactoryAddress,
        this.signer
      );
    }
    localStorage.setItem("cw-session-key", wallet.privateKey);
  }

  updateProvider(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress?: string
  ) {
    this.wsUrl = wsUrl;
    this.rpcProvider = provider;

    this.signer.provider?.destroy();
    this.signer = this.signer.connect(provider);
    if (accountFactoryAddress) {
      this.accountFactoryService = new AccountFactoryService(
        accountFactoryAddress,
        this.signer
      );
    }
    this.getOwner();
  }

  getSigner() {
    return this.signer;
  }

  setOwner(owner: string) {
    this.owner = owner;
    localStorage.setItem("cw-session-owner", owner);
  }

  getOwner(): string | undefined {
    if (this.owner) {
      return this.owner;
    }

    const owner = localStorage.getItem("cw-session-owner");
    if (owner) {
      this.owner = owner;
      return owner;
    }

    return;
  }

  getAddress(): string {
    return this.signer.address;
  }

  async getAccountAddress(forceUpdate = false): Promise<string> {
    if (!this.accountFactoryService) {
      throw new Error("AccountFactoryService not set");
    }

    if (this.accountAddress && !forceUpdate) {
      return Promise.resolve(this.accountAddress);
    }

    this.accountAddress = await this.accountFactoryService.getAddress();

    return this.accountAddress;
  }

  getBalance(): Promise<bigint> {
    if (!this.signer.provider) {
      throw new Error("Provider not set");
    }

    return this.signer.provider.getBalance(this.signer.address);
  }

  signMessage(message: string | Uint8Array): Promise<string> {
    return this.signer.signMessage(message);
  }

  listenForBlock(callback: (blockNumber: number) => void) {
    this.safeDestroyProvider();

    this.provider = createWebSocketProvider(this.wsUrl);
    this.provider.on("block", (blockNumber: number) => {
      callback(blockNumber);
    });
  }

  async stopListeningForBlocks() {
    this.safeDestroyProvider();
  }

  private safeDestroyProvider() {
    try {
      this.provider?.destroy();
    } catch (error) {}
  }

  withdraw(to: string, amount: bigint): Promise<TransactionResponse> {
    return this.signer.sendTransaction({
      to,
      value: amount,
    });
  }

  async refund(): Promise<RefundRequest> {
    if (!this.owner) {
      throw new Error("Owner not set");
    }

    if (!this.signer.provider) {
      throw new Error("Provider not set");
    }

    // Get the base fee per gas for the next block
    const nextBlock = await this.signer.provider.getBlock("latest");
    if (!nextBlock || !nextBlock.baseFeePerGas) {
      throw new Error("Next block not found");
    }

    const baseFeePerGas = nextBlock.baseFeePerGas;

    // Set your max priority fee per gas
    const maxPriorityFeePerGas = parseUnits("2.0", "gwei");

    // Calculate the max fee per gas
    const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas;

    // Estimate the gas cost for the transaction
    const gasLimit = BigInt(21000); // for a simple Ether transfer
    const gasCost = maxFeePerGas * gasLimit;

    // Get the account balance
    const balance = await this.signer.provider.getBalance(this.signer.address);

    // Calculate the amount to send
    const amount = balance - gasCost;

    if (amount <= BigInt(0)) {
      throw new Error("Insufficient funds");
    }

    return {
      fees: gasCost,
      amount,
      transaction: this.signer.sendTransaction({
        to: this.owner,
        value: amount,
        gasLimit: gasLimit,
        gasPrice: maxFeePerGas,
      }),
    };
  }

  reset() {
    this.owner = undefined;
    localStorage.removeItem("cw-session-key");
    localStorage.removeItem("cw-session-owner");

    const wallet = Wallet.createRandom();
    this.signer = wallet.connect(this.rpcProvider);
    if (this.accountFactoryService) {
      this.accountFactoryService = new AccountFactoryService(
        this.accountFactoryService.contractAddress,
        this.signer
      );
    }
    localStorage.setItem("cw-session-key", wallet.privateKey);
  }
}
