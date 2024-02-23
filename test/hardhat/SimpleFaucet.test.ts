import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

import ERC20Artifact from "smartcontracts/artifacts/contracts/tokens/UpgradeableBurnableCommunityToken.sol/UpgradeableBurnableCommunityToken.json";
import SimpleFaucetArtifact from "smartcontracts/artifacts/contracts/apps/SimpleFaucet.sol/SimpleFaucet.json";

import { SimpleFaucetActions } from "../../src";
import { Contract } from "ethers";

describe("SimpleFaucet", () => {
  async function deployTokenIOUFixture() {
    const [owner, redeemAdmin, friend1, friend2] = await ethers.getSigners();

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

    const redeemAmount = 10;
    const redeemInterval = 0;

    const SimpleFaucetContract = new ethers.ContractFactory(
      SimpleFaucetArtifact.abi,
      SimpleFaucetArtifact.bytecode,
      owner
    );
    const simpleFaucet = await upgrades.deployProxy(
      SimpleFaucetContract,
      [
        await token.getAddress(),
        redeemAmount,
        redeemInterval,
        await redeemAdmin.getAddress(),
      ],
      {
        kind: "uups",
        initializer: "initialize",
      }
    );

    const network = await ethers.provider.getNetwork();

    const current = await time.latest();

    const redeemableAmount = 100;

    await token.mint(
      await simpleFaucet.getAddress(),
      redeemableAmount,
      "hello"
    );

    // const simpleFaucetActions = new SimpleFaucetActions(
    //   await simpleFaucet.getAddress(),
    //   friend1
    // );

    return {
      network,
      current,
      simpleFaucet,
      token,
      owner,
      friend1,
      friend2,
      // simpleFaucetActions,
      redeemAmount,
      redeemableAmount,
      redeemInterval,
    };
  }

  it("debugs", async () => {});

  // it("redeems", async () => {
  //   const {
  //     simpleFaucetActions,
  //     token,
  //     simpleFaucet,
  //     friend1,
  //     redeemAmount,
  //     redeemableAmount,
  //   } = await loadFixture(deployTokenIOUFixture);

  //   simpleFaucetActions.store.getState().reset();

  //   let state = simpleFaucetActions.store.getState();

  //   expect(state.loading).to.equal(false);
  //   expect(state.error).to.equal(false);

  //   await simpleFaucetActions.redeem();

  //   state = simpleFaucetActions.store.getState();

  //   expect(state.loading).to.equal(false);
  //   expect(state.error).to.equal(false);

  //   expect(await token.balanceOf(friend1.address)).to.equal(redeemAmount);
  //   expect(await token.balanceOf(await simpleFaucet.getAddress())).to.equal(
  //     redeemableAmount - redeemAmount
  //   );
  // });

  // it("redeems only once", async () => {
  //   const {
  //     simpleFaucetActions,
  //     token,
  //     simpleFaucet,
  //     friend1,
  //     redeemAmount,
  //     redeemableAmount,
  //   } = await loadFixture(deployTokenIOUFixture);

  //   simpleFaucetActions.store.getState().reset();

  //   let state = simpleFaucetActions.store.getState();

  //   expect(state.loading).to.equal(false);
  //   expect(state.error).to.equal(false);

  //   await simpleFaucetActions.redeem();

  //   state = simpleFaucetActions.store.getState();

  //   expect(state.loading).to.equal(false);
  //   expect(state.error).to.equal(false);

  //   expect(await token.balanceOf(friend1.address)).to.equal(redeemAmount);
  //   expect(await token.balanceOf(await simpleFaucet.getAddress())).to.equal(
  //     redeemableAmount - redeemAmount
  //   );

  //   await simpleFaucetActions.redeem();

  //   state = simpleFaucetActions.store.getState();

  //   expect(state.loading).to.equal(false);
  //   expect(state.error).to.equal(true);
  // });
});
