import { BaseWallet, Contract, ethers } from "ethers";

import ERC20Abi from "smartcontracts/build/contracts/erc20/ERC20.abi.json";

export const faucetFactory = new ethers.Interface(ERC20Abi);

export class ERC20Service {
  /**
   * The contract instance.
   */
  contractAddress: string;
  contract: Contract;
  signer: BaseWallet;

  constructor(contractAddress: string, signer: BaseWallet) {
    this.contractAddress = contractAddress;
    this.contract = new Contract(contractAddress, ERC20Abi, signer);
    this.signer = signer;
  }

  balanceOf(address?: string): Promise<bigint> {
    return this.contract.getFunction("balanceOf")(
      address ?? this.signer.address
    );
  }
}
