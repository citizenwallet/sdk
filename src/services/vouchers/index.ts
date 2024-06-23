import { Wallet, SigningKey } from "ethers";
import { decompress } from "../../utils/deeplink";

export interface Voucher {
  alias: string;
  creator: string;
  account: string;
  name: string;
}

export const parseVoucher = (data: string) => {
  const url = new URL(data.replace("#/", ""));

  const voucherKey = url.searchParams.get("voucher");
  if (!voucherKey) {
    throw new Error("Invalid voucher");
  }

  const decodedKey = decompress(voucherKey);

  const signingKey = new SigningKey(
    decodedKey.replace("00", "").replace("v2-", "0x")
  );
  const signer = new Wallet(signingKey);

  const voucherParams = url.searchParams.get("params");
  if (!voucherParams) {
    throw new Error("Invalid voucher");
  }

  const decodedParams = decompress(voucherParams);

  const voucherSearchParams = new URLSearchParams(decodedParams);

  const voucher: Voucher = {
    alias: voucherSearchParams.get("alias") || "",
    creator: voucherSearchParams.get("creator") || "",
    account: voucherSearchParams.get("account") || "",
    name: voucherSearchParams.get("name") || "Voucher",
  };
  if (!voucher.alias || !voucher.creator || !voucher.account) {
    throw new Error("Invalid voucher");
  }

  return { voucher, signer };
};
