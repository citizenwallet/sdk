import { BaseWallet, Contract, ethers, solidityPackedKeccak256 } from "ethers";

import VoucherFactoryAbi from "smartcontracts/build/contracts/voucherFactory/VoucherFactory.abi.json";
import VoucherFactoryBytecode from "smartcontracts/build/contracts/voucherFactory/VoucherFactory.bin";
import { deployContract, estimateContractDeployGas } from "../deploy";

export const voucherFactory = new ethers.Interface(VoucherFactoryAbi);

export const estimateDeployVoucherFactory = async (
  signer: BaseWallet
): Promise<bigint> => {
  return estimateContractDeployGas({
    signer,
    contractABI: VoucherFactoryAbi,
    contractBytecode: VoucherFactoryBytecode,
  });
};

export const deployVoucherFactory = async (
  signer: BaseWallet
): Promise<string> => {
  return deployContract({
    signer,
    contractABI: VoucherFactoryAbi,
    contractBytecode: VoucherFactoryBytecode,
  });
};

export class VoucherFactoryService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  chainId: number;
  contract: Contract;
  signer: BaseWallet;

  constructor(contractAddress: string, chainId: number, signer: BaseWallet) {
    this.contractAddress = contractAddress;
    this.chainId = chainId;
    this.contract = new Contract(contractAddress, VoucherFactoryAbi, signer);
    this.signer = signer;
  }

  getCodeHash(code: bigint): string {
    return solidityPackedKeccak256(
      ["uint256", "uint256", "address"],
      [code, this.chainId, this.contractAddress]
    );
  }

  getAddress(code = 0n): Promise<string> {
    const codeHash = this.getCodeHash(code);

    return this.contract.getFunction("getAddress")(codeHash);
  }
}
