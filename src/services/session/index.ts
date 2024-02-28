import {
  BaseWallet,
  JsonRpcProvider,
  TransactionResponse,
  Wallet,
  WebSocketProvider,
} from "ethers";
import { createWebSocketProvider } from "../wsprovider";
import { delay } from "../../utils/delay";
import { AccountFactoryService } from "../contracts/AccountFactory";

export class SessionService {
  signer: BaseWallet;
  wsUrl: string;
  accountFactoryService: AccountFactoryService;

  rpcProvider: JsonRpcProvider;

  provider?: WebSocketProvider;
  owner?: string;
  accountAddress?: string;
  constructor(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string,
    signer?: BaseWallet
  ) {
    this.wsUrl = wsUrl;
    this.rpcProvider = provider;

    if (signer) {
      this.signer = signer.connect(provider);
      this.accountFactoryService = new AccountFactoryService(
        accountFactoryAddress,
        this.signer
      );
      localStorage.setItem("cw-session-key", signer.signingKey.privateKey);
      this.getOwner();
      return;
    }

    const key = localStorage.getItem("cw-session-key");
    this.getOwner();
    if (key) {
      const wallet = new Wallet(key);
      this.signer = wallet.connect(provider);
      this.accountFactoryService = new AccountFactoryService(
        accountFactoryAddress,
        this.signer
      );
      return;
    }

    const wallet = Wallet.createRandom();
    this.signer = wallet.connect(provider);
    this.accountFactoryService = new AccountFactoryService(
      accountFactoryAddress,
      this.signer
    );
    localStorage.setItem("cw-session-key", wallet.privateKey);
  }

  updateProvider(
    provider: JsonRpcProvider,
    wsUrl: string,
    accountFactoryAddress: string
  ) {
    this.wsUrl = wsUrl;
    this.rpcProvider = provider;

    this.signer.provider?.destroy();
    this.signer = this.signer.connect(provider);
    this.accountFactoryService = new AccountFactoryService(
      accountFactoryAddress,
      this.signer
    );
    this.getOwner();
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

  // handling ws provider disconnects/reconnects: https://github.com/ethers-io/ethers.js/issues/1053

  listenForBlock(callback: (blockNumber: number) => void) {
    if (this.provider) {
      this.provider.destroy();
    }

    this.provider = createWebSocketProvider(this.wsUrl);
    this.provider.on("block", (blockNumber: number) => {
      callback(blockNumber);
    });
  }

  async stopListeningForBlocks() {
    if (this.provider) {
      await this.provider.removeAllListeners("block");

      await delay(250);

      this.provider.destroy();
    }
  }

  withdraw(to: string, amount: bigint): Promise<TransactionResponse> {
    return this.signer.sendTransaction({
      to,
      value: amount,
    });
  }

  reset() {
    this.owner = undefined;
    localStorage.removeItem("cw-session-key");
    localStorage.removeItem("cw-session-owner");

    const wallet = Wallet.createRandom();
    this.signer = wallet.connect(this.rpcProvider);
    this.accountFactoryService = new AccountFactoryService(
      this.accountFactoryService.contractAddress,
      this.signer
    );
    localStorage.setItem("cw-session-key", wallet.privateKey);
  }
}
