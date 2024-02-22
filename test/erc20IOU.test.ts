import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

import ERC20Artifact from "smartcontracts/artifacts/contracts/tokens/UpgradeableBurnableCommunityToken.sol/UpgradeableBurnableCommunityToken.json";
import ERC20IOUArtifact from "smartcontracts/artifacts/contracts/apps/ERC20IOU.sol/ERC20IOU.json";

import { ERC20IOU } from "../src/index";
import { getSignedHash } from "../src/state/erc20IOU";
import { Contract } from "ethers";

describe("ERC20IOU", () => {
  async function deployTokenIOUFixture() {
    const [owner, friend1, friend2] = await ethers.getSigners();

    const TokenContract = new ethers.ContractFactory(
      ERC20Artifact.abi,
      ERC20Artifact.bytecode,
      owner
    );

    const token = await upgrades.deployProxy(
      TokenContract,
      [[owner.address], "My Token", "MT"],
      {
        kind: "uups",
        initializer: "initialize",
      }
    );

    const TokenIOUContract = new ethers.ContractFactory(
      ERC20IOUArtifact.abi,
      ERC20IOUArtifact.bytecode,
      owner
    );
    const tokeniou = await upgrades.deployProxy(
      TokenIOUContract,
      [await token.getAddress()],
      {
        kind: "uups",
        initializer: "initialize",
      }
    );

    const network = await ethers.provider.getNetwork();

    const current = await time.latest();

    await token.mint(owner.address, 100, "hello");

    const erc20IOU = new ERC20IOU(await tokeniou.getAddress(), friend1);

    return {
      network,
      current,
      tokeniou,
      token,
      owner,
      friend1,
      friend2,
      erc20IOU,
    };
  }

  it("stores the hash successfully", async () => {
    const { erc20IOU, friend1, current } = await loadFixture(
      deployTokenIOUFixture
    );

    erc20IOU.store.getState().reset();

    let state = erc20IOU.store.getState();

    expect(state.hash).to.equal(undefined);

    await erc20IOU.getHash(friend1.address, 100n, current + 300, current, 0n);

    state = erc20IOU.store.getState();

    expect(state.hash).not.to.equal(undefined);
  });

  it("does not store a hash if fail", async () => {
    const { erc20IOU, current } = await loadFixture(deployTokenIOUFixture);

    erc20IOU.store.getState().reset();

    let state = erc20IOU.store.getState();

    expect(state.hash).to.equal(undefined);

    await erc20IOU.getHash("0x123", 100n, current + 300, current, 0n);

    state = erc20IOU.store.getState();

    expect(state.hash).to.equal(undefined);
    expect(state.loading).to.equal(false);
    expect(state.error).to.equal(true);
  });

  it("redeems a valid hash successfully", async () => {
    const { erc20IOU, token, tokeniou, owner, friend1, current } =
      await loadFixture(deployTokenIOUFixture);

    erc20IOU.store.getState().reset();

    await erc20IOU.getHash(owner.address, 1n, current + 300, current, 0n);

    let state = erc20IOU.store.getState();

    expect(state.hash).not.to.equal(undefined);

    const hash = state.hash!;

    const signedHash = await getSignedHash(owner, hash);

    await (token.connect(owner) as Contract).approve(
      await tokeniou.getAddress(),
      100
    );

    expect(await token.balanceOf(friend1.address)).to.equal(0);

    await erc20IOU.redeem(
      owner.address,
      1n,
      current + 300,
      current,
      0n,
      signedHash
    );

    state = erc20IOU.store.getState();

    expect(state.loading).to.equal(false);
    expect(state.error).to.equal(false);

    expect(await token.balanceOf(friend1.address)).to.equal(1n);

    // redeeming the same hash again should fail

    await erc20IOU.redeem(
      owner.address,
      1n,
      current + 300,
      current,
      0n,
      signedHash
    );

    state = erc20IOU.store.getState();

    expect(state.loading).to.equal(false);
    expect(state.error).to.equal(true);
  });
});
