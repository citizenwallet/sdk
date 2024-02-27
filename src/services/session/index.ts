import {
  BaseWallet,
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionResponse,
  Wallet,
} from "ethers";

export class SessionService {
  signer: BaseWallet;
  constructor(provider: JsonRpcProvider, signer?: BaseWallet) {
    if (signer) {
      this.signer = signer.connect(provider);
      localStorage.setItem("cw-session-key", signer.signingKey.privateKey);
      return;
    }

    const key = localStorage.getItem("cw-session-key");
    if (key) {
      const wallet = new Wallet(key);
      this.signer = wallet.connect(provider);
      return;
    }

    const wallet = Wallet.createRandom();
    this.signer = wallet.connect(provider);
    localStorage.setItem("cw-session-key", wallet.privateKey);
  }

  updateProvider(provider: JsonRpcProvider) {
    this.signer.provider?.destroy();
    this.signer = this.signer.connect(provider);
  }

  getAddress(): string {
    return this.signer.address;
  }

  signMessage(message: string | Uint8Array): Promise<string> {
    return this.signer.signMessage(message);
  }

  getBalance(): Promise<bigint> {
    if (!this.signer.provider) {
      throw new Error("Provider not set");
    }
    return this.signer.provider.getBalance(this.signer.address);
  }

  listenForBlock(callback: () => void) {
    if (!this.signer.provider) {
      throw new Error("Provider not set");
    }
    this.signer.provider.on("block", async (_) => {
      callback();
    });
  }

  stopListeningForBlocks() {
    if (!this.signer.provider) {
      throw new Error("Provider not set");
    }
    this.signer.provider.removeAllListeners("block");
  }

  withdraw(to: string, amount: bigint): Promise<TransactionResponse> {
    return this.signer.sendTransaction({
      to,
      value: amount,
    });
  }
}
