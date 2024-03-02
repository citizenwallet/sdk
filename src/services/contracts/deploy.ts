import {
  Interface,
  InterfaceAbi,
  BytesLike,
  ContractFactory,
  BaseWallet,
} from "ethers";

export const estimateContractDeployGas = async ({
  signer,
  contractABI,
  contractBytecode,
}: {
  signer: BaseWallet;
  contractABI: Interface | InterfaceAbi;
  contractBytecode:
    | BytesLike
    | {
        object: string;
      };
}): Promise<bigint> => {
  if (!signer.provider) {
    throw new Error("No provider found");
  }

  // Create a ContractFactory
  const factory = new ContractFactory(contractABI, contractBytecode, signer);

  // Deploy the contract
  const deployTx = await factory.getDeployTransaction();

  const gas = await signer.estimateGas(deployTx);

  const { maxFeePerGas } = await signer.provider.getFeeData();

  const estimatedCost = gas * (maxFeePerGas || 1n);

  return estimatedCost + estimatedCost / 10n;
};

export const deployContract = async ({
  signer,
  contractABI,
  contractBytecode,
}: {
  signer: BaseWallet;
  contractABI: Interface | InterfaceAbi;
  contractBytecode:
    | BytesLike
    | {
        object: string;
      };
}): Promise<string> => {
  // Create a ContractFactory
  const factory = new ContractFactory(contractABI, contractBytecode, signer);

  // Deploy the contract
  const contract = await factory.deploy();

  // Wait for the contract to be mined
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log(`Contract deployed at address: ${contractAddress}`);

  return contractAddress;
};
