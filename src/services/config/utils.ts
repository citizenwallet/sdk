import { ConfigCommunity } from "../api/config";

export const generateCommunityUrl = (community: ConfigCommunity) => {
  return community.custom_domain
    ? `https://${community.custom_domain}`
    : `https://${community.alias}.citizenwallet.xyz`;
};
