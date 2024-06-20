import {
  Contract,
  JsonRpcProvider,
  encodeBytes32String,
  hexlify,
  toUtf8Bytes,
} from "ethers";

import ProfileAbi from "smartcontracts/build/contracts/profile/Profile.abi.json";
import { formatUsernameToBytes32 } from "./utils";

export class ProfileContractService {
  /**
   * The contract instance.
   */
  contractAddress: string;
  contract: Contract;

  constructor(contractAddress: string, provider: JsonRpcProvider) {
    this.contractAddress = contractAddress;
    this.contract = new Contract(contractAddress, ProfileAbi, provider);
  }

  get(account: string): Promise<string> {
    return this.contract.getFunction("get")(account);
  }

  getFromUsername(username: string): Promise<string> {
    const encoded = formatUsernameToBytes32(username);
    return this.contract.getFunction("getFromUsername")(encoded);
  }

  getFromTokenId(tokenId: BigInt): Promise<string> {
    return this.contract.getFunction("tokenURI")(tokenId);
  }
}
