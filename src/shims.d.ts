declare module 'bwip-js' {
  type BWIPOptions = Record<string, unknown>;

  const bwipjs: {
    toSVG(options: BWIPOptions): string;
    toBuffer(options: BWIPOptions): Promise<Uint8Array>;
  };

  export default bwipjs;
}
