import { Contract, JsonRpcProvider, ethers } from "ethers";

import ERC20Abi from "smartcontracts/build/contracts/erc20/ERC20.abi.json";

export const faucetFactory = new ethers.Interface(ERC20Abi);

export class ERC20ContractService {
  /**
   * The contract instance.
   */
  wsUrl: string;
  contractAddress: string;
  contract: Contract;

  constructor(
    contractAddress: string,
    wsUrl: string,
    provider: JsonRpcProvider
  ) {
    this.contractAddress = contractAddress;
    this.wsUrl = wsUrl;
    this.contract = new Contract(contractAddress, ERC20Abi, provider);
  }

  balanceOf(address: string): Promise<bigint> {
    return this.contract.getFunction("balanceOf")(
      // address ?? this.signer.address
      address
    );
  }
}
