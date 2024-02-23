import { ethers, upgrades } from "hardhat";
import EntryPointArtifact from "@account-abstraction/contracts/artifacts/EntryPoint.json";
import TokenEntryPointArtifact from "smartcontracts/artifacts/contracts/accounts/TokenEntryPoint.sol/TokenEntryPoint.json";
import PaymasterArtifact from "smartcontracts/artifacts/contracts/accounts/Paymaster.sol/Paymaster.json";
import AccountFactoryArtifact from "smartcontracts/artifacts/contracts/accounts/AccountFactory.sol/AccountFactory.json";
import AccountArtifact from "smartcontracts/artifacts/contracts/accounts/Account.sol/Account.json";

export async function createTokenEntryPointFixture() {
  const [owner, friend1, friend2, friend3, sponsor, sponsor2] =
    await ethers.getSigners();

  const EntryPointContract = await ethers.getContractFactory(
    EntryPointArtifact.abi,
    EntryPointArtifact.bytecode,
    owner
  );
  const entrypoint = await EntryPointContract.deploy();

  const PaymasterContract = await ethers.getContractFactory(
    PaymasterArtifact.abi,
    PaymasterArtifact.bytecode,
    owner
  );

  const paymasterContract = await upgrades.deployProxy(
    PaymasterContract,
    [sponsor.address],
    {
      kind: "uups",
      initializer: "initialize",
    }
  );

  const TokenEntryPointContract = await ethers.getContractFactory(
    TokenEntryPointArtifact.abi,
    TokenEntryPointArtifact.bytecode,
    owner
  );

  const tokenEntryPointContract = await upgrades.deployProxy(
    TokenEntryPointContract,
    [sponsor.address, await paymasterContract.getAddress(), []],
    {
      kind: "uups",
      initializer: "initialize",
      constructorArgs: [await entrypoint.getAddress()],
    }
  );

  const AccountFactoryContract = await ethers.getContractFactory(
    AccountFactoryArtifact.abi,
    AccountFactoryArtifact.bytecode,
    owner
  );

  const accountFactory = await AccountFactoryContract.deploy(
    await entrypoint.getAddress(),
    await tokenEntryPointContract.getAddress()
  );

  const accountFactory2 = await AccountFactoryContract.deploy(
    await entrypoint.getAddress(),
    await tokenEntryPointContract.getAddress()
  );

  await accountFactory.createAccount(friend1.address, 0n);

  await accountFactory.createAccount(friend2.address, 0n);

  const account1 = await ethers.getContractAtFromArtifact(
    AccountArtifact,
    await accountFactory.getFunction("getAddress")(friend1.address, 0n),
    friend1
  );

  const account2 = await ethers.getContractAtFromArtifact(
    AccountArtifact,
    await accountFactory.getFunction("getAddress")(friend2.address, 0n),
    friend2
  );

  await entrypoint.connect(owner).getFunction("depositTo")(owner.address, {
    value: ethers.toBigInt("1000000000000000000"),
  });

  await entrypoint.connect(owner).getFunction("depositTo")(friend1.address, {
    value: ethers.toBigInt("1000000000000000000"),
  });
  await entrypoint.connect(owner).getFunction("depositTo")(
    await account1.getAddress(),
    {
      value: ethers.toBigInt("1000000000000000000"),
    }
  );

  return {
    entrypoint,
    tokenEntryPointContract,
    paymasterContract,
    accountFactory,
    accountFactory2,
    owner,
    friend1,
    friend2,
    friend3,
    account1,
    account2,
    sponsor,
    sponsor2,
  };
}
