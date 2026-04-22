declare module 'bwip-js' {
  type BWIPOptions = Record<string, unknown>;

  const bwipjs: {
    toSVG(options: BWIPOptions): string;
    toBuffer(options: BWIPOptions): Promise<Buffer>;
  };

  export default bwipjs;
}
