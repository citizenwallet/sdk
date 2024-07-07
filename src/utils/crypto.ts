import { ethers } from "ethers";
import accessControlABI from "smartcontracts/build/contracts/accessControlUpgradeable/IAccessControlUpgradeable.abi.json";

export const MINTER_ROLE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

export function isFunctionInABI(func: string, abi: any[]): boolean {
  return abi.some((item) => item.type === "function" && item.name === func);
}

export async function hasRole(
  tokenAddress: string,
  role: string,
  account: string,
  signer: ethers.Signer
) {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    accessControlABI,
    signer
  );
  return await tokenContract.getFunction("hasRole")(role, account);
}
