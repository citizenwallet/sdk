import { BaseWallet, Contract, ethers } from "ethers";

import AccountFactoryAbi from "smartcontracts/build/contracts/accfactory/AccountFactory.abi.json";

export const faucetFactory = new ethers.Interface(AccountFactoryAbi);

export class AccountFactoryService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  contract: Contract;
  signer: BaseWallet;

  constructor(contractAddress: string, signer: BaseWallet) {
    this.contractAddress = contractAddress;
    this.contract = new Contract(contractAddress, AccountFactoryAbi, signer);
    this.signer = signer;
  }

  getAddress(salt = 0n): Promise<string> {
    return this.contract.getFunction("getAddress")(this.signer.address, salt);
  }
}
