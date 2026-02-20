import { useEffect, useRef, useState, useCallback } from 'react';
import { WaveformType, MIN_FREQ, MAX_FREQ, MAX_VOLUME } from '../types';

export const useAudioEngine = () => {
  // --- React State for UI ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(0); // Starts at 0Hz as requested
  const [volume, setVolume] = useState(0.1); // Start low for safety
  const [balance, setBalance] = useState(0); // -1 (Left) to 1 (Right)
  const [waveform, setWaveform] = useState<WaveformType>('sine');

  // --- Web Audio Refs ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  // Initialize Audio Context (Lazy load on user interaction)
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain (Volume + Safety Limiter)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      masterGainRef.current = gainNode;

      // Panner (Balance)
      const pannerNode = ctx.createStereoPanner();
      pannerNode.pan.setValueAtTime(0, ctx.currentTime);
      pannerRef.current = pannerNode;

      // Signal Chain: Source -> Panner -> Gain -> Destination
      pannerNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Create White Noise Buffer (5 seconds loop is sufficient)
      const bufferSize = ctx.sampleRate * 5; 
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buffer;
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const stopSource = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
  }, []);

  const startSource = useCallback(() => {
    const ctx = audioCtxRef.current;
    const panner = pannerRef.current;
    if (!ctx || !panner) return;

    stopSource();

    if (waveform === 'noise') {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBufferRef.current;
      noise.loop = true;
      noise.connect(panner);
      noise.start();
      noiseNodeRef.current = noise;
    } else {
      const osc = ctx.createOscillator();
      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.connect(panner);
      osc.start();
      oscRef.current = osc;
    }
  }, [waveform, frequency, stopSource]);

  const togglePlay = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    const gain = masterGainRef.current;

    if (!ctx || !gain) return;

    const now = ctx.currentTime;
    const rampTime = 0.05; // 50ms smooth transition

    if (isPlaying) {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + rampTime);
      
      setTimeout(() => {
        stopSource();
        setIsPlaying(false);
      }, rampTime * 1000 + 10);
    } else {
      startSource();
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.001, now);
      const targetVol = Math.min(volume, MAX_VOLUME); 
      gain.gain.linearRampToValueAtTime(targetVol, now + rampTime);
      setIsPlaying(true);
    }
  }, [isPlaying, volume, initAudio, startSource, stopSource]);

  // Handle real-time frequency updates
  useEffect(() => {
    if (audioCtxRef.current && oscRef.current && waveform !== 'noise') {
      const now = audioCtxRef.current.currentTime;
      oscRef.current.frequency.setTargetAtTime(frequency, now, 0.03);
    }
  }, [frequency, waveform]);

  // Handle real-time volume updates
  useEffect(() => {
    if (audioCtxRef.current && masterGainRef.current && isPlaying) {
      const now = audioCtxRef.current.currentTime;
      const targetVol = Math.min(volume, MAX_VOLUME);
      masterGainRef.current.gain.setTargetAtTime(targetVol, now, 0.05);
    }
  }, [volume, isPlaying]);

  // Handle real-time balance updates
  useEffect(() => {
    if (audioCtxRef.current && pannerRef.current) {
      const now = audioCtxRef.current.currentTime;
      pannerRef.current.pan.setTargetAtTime(balance, now, 0.05);
    }
  }, [balance]);

  // Handle waveform changes while playing
  useEffect(() => {
    if (isPlaying) {
      startSource();
    }
  }, [waveform, isPlaying, startSource]);

  const safeSetFrequency = (val: number) => {
    const clamped = Math.max(MIN_FREQ, Math.min(MAX_FREQ, val));
    setFrequency(clamped);
  };

  return {
    isPlaying,
    frequency,
    volume,
    balance,
    waveform,
    togglePlay,
    initAudio,
    setFrequency: safeSetFrequency,
    setVolume,
    setBalance,
    setWaveform
  };
};