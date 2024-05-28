import { getMockConfigs } from "./mock/config";
import { generateCommunityUrl } from "../../src/services/config/utils";

describe("URL generation", () => {
  it("should generate correct URLs", () => {
    const configs = getMockConfigs();

    configs.forEach((config, index) => {
      let expectedUrl;
      if (config.community.custom_domain) {
        expectedUrl = `https://${config.community.custom_domain}`;
      } else {
        expectedUrl = `https://${config.community.alias}.citizenwallet.xyz`;
      }

      // Replace this with your actual URL generation function
      const generatedUrl = generateCommunityUrl(config.community);

      expect(generatedUrl).toEqual(expectedUrl);
    });
  });
});
