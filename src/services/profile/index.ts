import { JsonRpcProvider, WebSocketProvider } from "ethers";
import { Api } from "../api/api";
import { Config } from "../api/config";
import { ProfileContractService } from "../contracts/Profile";
import { createWebSocketProvider } from "../wsprovider";

export interface Profile {
  account: string;
  description: string;
  image: string;
  image_medium: string;
  image_small: string;
  name: string;
  username: string;
}

const formatProfileImageLinks = (ipfsUrl: string, profile: Profile) => {
  if (profile.image_small.startsWith("ipfs://")) {
    profile.image_small = `${ipfsUrl}/${profile.image_small.replace(
      "ipfs://",
      ""
    )}`;
  }

  if (profile.image_medium.startsWith("ipfs://")) {
    profile.image_medium = `${ipfsUrl}/${profile.image_medium.replace(
      "ipfs://",
      ""
    )}`;
  }

  if (profile.image.startsWith("ipfs://")) {
    profile.image = `${ipfsUrl}/${profile.image.replace("ipfs://", "")}`;
  }

  return profile;
};

export class ProfileService {
  private profileContract: ProfileContractService;
  private ipfsAPI: Api;
  wsUrl: string;
  ipfsUrl: string;

  provider?: WebSocketProvider;

  constructor(config: Config) {
    const provider = new JsonRpcProvider(config.node.url);
    this.profileContract = new ProfileContractService(
      config.profile.address,
      provider
    );
    this.ipfsAPI = new Api(config.ipfs.url);
    this.wsUrl = config.node.ws_url;
    this.ipfsUrl = config.ipfs.url;
  }

  getFromIPFS = async (hash: string): Promise<Profile> => {
    return await this.ipfsAPI.get(`/${hash.replace("ipfs://", "")}`);
  };

  getProfile = async (account: string) => {
    try {
      const ipfsHash = await this.profileContract.get(account);

      const profile = await this.getFromIPFS(ipfsHash);

      return formatProfileImageLinks(this.ipfsUrl, profile);
    } catch (e) {
      return null;
    }
  };

  getProfileFromUsername = async (username: string) => {
    try {
      const ipfsHash = await this.profileContract.getFromUsername(username);

      const profile = await this.getFromIPFS(ipfsHash);

      return formatProfileImageLinks(this.ipfsUrl, profile);
    } catch (e) {
      return null;
    }
  };

  onProfileUpdate = async (callback: (profile: Profile) => void) => {
    try {
      this.stopProfileListener();

      this.provider = createWebSocketProvider(this.wsUrl);
      this.profileContract.contract.on(
        "MetadataUpdate",
        async (tokenId: BigInt) => {
          try {
            const ipfsHash = await this.profileContract.getFromTokenId(tokenId);

            const profile = await this.getFromIPFS(ipfsHash);

            callback(formatProfileImageLinks(this.ipfsUrl, profile));
          } catch (error) {
            console.error(error);
          }
        }
      );
    } catch (error) {
      console.log("error: ", error);
    }
  };

  async stopProfileListener() {
    this.safeDestroyProvider();
  }

  private safeDestroyProvider() {
    try {
      this.provider?.destroy();
    } catch (error) {}
  }
}
