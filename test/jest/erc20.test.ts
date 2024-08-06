import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { ERC20ContractService } from "../../src/services/contracts/ERC20";
import { ConfigService } from "../../src/services/config";
import { MockApiService } from "./mock";
import { Config } from "../../src/services/api/config";
import { BundlerService } from "../../src/services/bundler";
import AccountFactoryAbi from "smartcontracts/build/contracts/accfactory/AccountFactory.abi.json";
import PaymasterABI from "smartcontracts/build/contracts/paymaster/Paymaster.abi.json";

if (!process.env.TEST_MINTER_PRIVATE_KEY) {
  throw new Error("TEST_MINTER_PRIVATE_KEY is not set as an env variable");
}
if (!process.env.TEST_USER_PRIVATE_KEY) {
  throw new Error("TEST_USER_PRIVATE_KEY is not set as an env variable");
}

const waitForTxReceipt = async (tx: string, provider: JsonRpcProvider) => {
  let txReceipt = await provider.getTransactionReceipt(tx);
  while (txReceipt === null) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    txReceipt = await provider.getTransactionReceipt(tx);
  }
  return txReceipt;
};

describe("ERC20 Token Operations", () => {
  let erc20Service: ERC20ContractService;
  let provider: JsonRpcProvider;
  let config: Config;
  let bundler: BundlerService;
  let accountFactoryContract: Contract;

  beforeEach(async () => {
    // Setup mock provider and contract address
    const mockApi = new MockApiService();

    const configService = new ConfigService(mockApi);

    const configs = await configService.get();
    config = configs[1];
    bundler = new BundlerService(config);
    provider = new JsonRpcProvider(config.node.url);
    erc20Service = new ERC20ContractService(
      config.token.address,
      config.node.ws_url,
      provider
    );
    accountFactoryContract = new Contract(
      config.erc4337.account_factory_address,
      AccountFactoryAbi,
      provider
    );
  });

  it("should connect to RPC", async () => {
    async function checkNetwork() {
      try {
        const blockNumber = await provider.getBlockNumber();
        expect(blockNumber).toBeGreaterThan(0);
      } catch (error) {
        console.error("Failed to connect to network:", error);
      }
    }

    await checkNetwork();
  });

  it("should get token information", async () => {
    const symbol = await erc20Service.symbol();
    const name = await erc20Service.name();
    const decimals = await erc20Service.decimals();
    expect(symbol).toBe(config.token.symbol);
    expect(name).toBe(config.token.name);
    expect(typeof symbol).toBe("string");
    expect(typeof name).toBe("string");
    expect(typeof decimals).toBe("bigint");
  });

  it("should get account address", async () => {
    const testWallet = new Wallet(process.env.TEST_MINTER_PRIVATE_KEY || "");
    const testAccount = await accountFactoryContract.getFunction("getAddress")(
      testWallet.address,
      0
    );

    expect(testWallet.address).toBe(
      "0x4F035ba2a60D6E634ced4B4298fE82A841cf518e"
    );
    expect(testAccount).toBe("0xFaC2EFd4cBaB667799C28BBEc256A93266F0b002");
  });

  it("should get balance of the sponsor", async () => {
    const paymasterContract = new Contract(
      config.erc4337.paymaster_address || "",
      PaymasterABI,
      provider
    );
    const sponsor = await paymasterContract.sponsor();
    const balance = await provider.getBalance(sponsor);
    expect(balance).toBeGreaterThan(BigInt(50000));
  });

  it("should fail to mint tokens if no MINTER role", async () => {
    const bundler = new BundlerService(config);

    const testUserWallet = new Wallet(
      process.env.TEST_USER_PRIVATE_KEY || "",
      provider
    );
    const testUserAccount = await accountFactoryContract.getFunction(
      "getAddress"
    )(testUserWallet.address, 0);

    try {
      const tx = await bundler.mintERC20Token(
        testUserWallet,
        config.token.address,
        testUserAccount,
        testUserAccount,
        "10"
      );
    } catch (e: any) {
      expect(e?.message).toBe(
        `Signer (${testUserAccount}) does not have the MINTER_ROLE on token contract ${config.token.address}`
      );
    }
  }, 20000);

  it("should mint tokens if MINTER role", async () => {
    const bundler = new BundlerService(config);

    const testUserWallet = new Wallet(
      process.env.TEST_USER_PRIVATE_KEY || "",
      provider
    );
    const testUserAccount = await accountFactoryContract.getFunction(
      "getAddress"
    )(testUserWallet.address, 0);
    const testMinterWallet = new Wallet(
      process.env.TEST_MINTER_PRIVATE_KEY || "",
      provider
    );
    const testMinterAccount = await accountFactoryContract.getFunction(
      "getAddress"
    )(testMinterWallet.address, 0);

    const initialBalance = await erc20Service.balanceOf(testUserAccount);

    const tx = await bundler.mintERC20Token(
      testMinterWallet,
      config.token.address,
      testMinterAccount,
      testUserAccount,
      "10"
    );
    expect(tx.substring(0, 2)).toEqual("0x");

    const txReceipt = await waitForTxReceipt(tx, provider);
    expect(txReceipt.to).toBe(config.erc4337.entrypoint_address);
    const newBalance = await erc20Service.balanceOf(testUserAccount);
    const diff = newBalance - initialBalance;
    expect(diff - BigInt(10 * 10 ** config.token.decimals)).toBe(BigInt(0));
  }, 15000);

  it("should transfer token", async () => {
    const testUserWallet = new Wallet(
      process.env.TEST_USER_PRIVATE_KEY || "",
      provider
    );
    const testUserAccount = await accountFactoryContract.getFunction(
      "getAddress"
    )(testUserWallet.address, 0);

    const newWallet = Wallet.createRandom();
    const newWalletAccount = await accountFactoryContract.getFunction(
      "getAddress"
    )(newWallet.address, 0);

    const tx = await bundler.sendERC20Token(
      testUserWallet,
      config.token.address,
      testUserAccount,
      newWalletAccount,
      "1"
    );

    const txReceipt = await waitForTxReceipt(tx, provider);
    const newBalance = await erc20Service.balanceOf(newWalletAccount);
    expect(newBalance).toBe(BigInt(1 * 10 ** config.token.decimals));
  }, 10000);
});
