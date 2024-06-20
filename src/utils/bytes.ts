export const padBytesWithSpace = (
  bytes: Uint8Array,
  length: number
): Uint8Array => {
  const spaceByte = new TextEncoder().encode(" ");
  while (bytes.length < length) {
    bytes = new Uint8Array([...spaceByte, ...bytes]);
  }
  return bytes;
};
