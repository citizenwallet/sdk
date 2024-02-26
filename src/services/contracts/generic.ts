import { Provider } from "ethers";

export class GenericContractService {
  provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  updateProvider(provider: Provider) {
    if (this.provider !== provider) {
      this.provider.destroy();
    }
    this.provider = provider;
  }

  async exists(contractAddress: string): Promise<boolean> {
    const bytecode = await this.provider.getCode(contractAddress);

    return bytecode !== "0x";
  }
}
