declare module 'legacy' {
  export default class Lamejs {
    Mp3Encoder: (channels: number, sampleRate: number, kbps: number) => void;
    WavHeader: () => void;
  }
}
