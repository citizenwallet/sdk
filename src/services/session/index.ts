import {
  BaseWallet,
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionResponse,
  Wallet,
  EventFilter,
} from "ethers";

export class SessionService {
  private signer: JsonRpcSigner;
  constructor(provider: JsonRpcProvider, signer?: BaseWallet) {
    if (signer) {
      this.signer = new JsonRpcSigner(provider, signer.address);
      localStorage.setItem("cw-session-key", signer.signingKey.privateKey);
      return;
    }

    const key = localStorage.getItem("cw-session-key");
    if (key) {
      const wallet = new Wallet(key);
      this.signer = new JsonRpcSigner(provider, wallet.address);
      return;
    }

    const wallet = Wallet.createRandom();
    this.signer = new JsonRpcSigner(provider, wallet.address);
    localStorage.setItem("cw-session-key", wallet.privateKey);
  }

  getAddress(): string {
    return this.signer.address;
  }

  signMessage(message: string | Uint8Array): Promise<string> {
    return this.signer.signMessage(message);
  }

  getBalance(): Promise<bigint> {
    return this.signer.provider.getBalance(this.signer.address);
  }

  listenForBlock(callback: () => void) {
    this.signer.provider.on("block", async (_) => {
      callback();
    });
  }

  stopListeningForBlocks() {
    this.signer.provider.removeAllListeners("block");
  }

  withdraw(to: string, amount: bigint): Promise<TransactionResponse> {
    return this.signer.sendTransaction({
      to,
      value: amount,
    });
  }
}
