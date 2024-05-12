export const binaryBodyToString = (body: object) => {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(new Uint8Array(Object.values(body)));
}