import { hexlify, toUtf8Bytes } from "ethers";

const padBytesWithSpace = (bytes: Uint8Array, length: number): Uint8Array => {
  const spaceByte = new TextEncoder().encode(" ");
  while (bytes.length < length) {
    bytes = new Uint8Array([...spaceByte, ...bytes]);
  }
  return bytes;
};

export const formatUsernameToBytes32 = (username: string): string => {
  return hexlify(padBytesWithSpace(toUtf8Bytes(username.replace("@", "")), 32));
};
