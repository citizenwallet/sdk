import { JsonRpcProvider } from "ethers";
import { Api } from "../api/api";
import { Config } from "../api/config";
import { ProfileContractService } from "../contracts/Profile";

export interface Profile {
  account: string;
  description: string;
  image: string;
  image_medium: string;
  image_small: string;
  name: string;
  username: string;
}

export class ProfileService {
  private profileContract: ProfileContractService;
  private ipfsAPI: Api;

  constructor(config: Config) {
    const provider = new JsonRpcProvider(config.node.url);
    this.profileContract = new ProfileContractService(
      config.profile.address,
      provider
    );
    this.ipfsAPI = new Api(config.ipfs.url);
  }

  getFromIPFS = async (hash: string) => {
    return await this.ipfsAPI.get(`/${hash.replace("ipfs://", "")}`);
  };

  getProfile = async (account: string) => {
    try {
      const ipfsHash = await this.profileContract.get(account);
      return await this.getFromIPFS(ipfsHash);
    } catch (e) {
      return null;
    }
  };

  getProfileFromUsername = async (username: string) => {
    try {
      const ipfsHash = await this.profileContract.getFromUsername(username);
      return await this.getFromIPFS(ipfsHash);
    } catch (e) {
      return null;
    }
  };
}
