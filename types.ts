export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'noise';

export interface AudioState {
  isPlaying: boolean;
  frequency: number;
  volume: number;
  balance: number;
  waveform: WaveformType;
}

export const MIN_FREQ = 0;
export const MAX_FREQ = 20000;
export const MAX_VOLUME = 0.8; // Safety limit