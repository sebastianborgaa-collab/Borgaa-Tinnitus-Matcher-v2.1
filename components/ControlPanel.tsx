import React, { useMemo } from 'react';
import { WaveformType, MIN_FREQ, MAX_FREQ } from '../types';
import { Volume2, ChevronUp, ChevronDown, CheckCircle2, Activity, Ear } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  frequency: number;
  volume: number;
  balance: number;
  waveform: WaveformType;
  onFrequencyChange: (f: number) => void;
  onVolumeChange: (v: number) => void;
  onBalanceChange: (b: number) => void;
  onWaveformChange: (w: WaveformType) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  frequency,
  volume,
  balance,
  waveform,
  onFrequencyChange,
  onVolumeChange,
  onBalanceChange,
  onWaveformChange,
}) => {
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFrequencyChange(Number(e.target.value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* FREQUENCY SECTION */}
      <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-400 w-5 h-5" />
            <h3 className="text-lg font-semibold text-white">Frequency Control</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onFrequencyChange(frequency / 2)}
              className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 border border-slate-600 transition-colors"
              title="Check Lower Octave"
            >
              ½ OCTAVE
            </button>
            <button 
              onClick={() => onFrequencyChange(frequency * 2)}
              className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 border border-slate-600 transition-colors"
              title="Check Higher Octave"
            >
              2x OCTAVE
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full">
            <div className="flex justify-between text-xs text-slate-500 font-mono mb-2 px-1">
              <span>{MIN_FREQ} Hz</span>
              <span>5 kHz</span>
              <span>10 kHz</span>
              <span>{MAX_FREQ / 1000} kHz</span>
            </div>
            <input
              type="range"
              min={MIN_FREQ}
              max={MAX_FREQ}
              step="1"
              value={frequency}
              onChange={handleSliderChange}
              className="w-full h-8 cursor-grab active:cursor-grabbing"
            />
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
             <button
              onClick={() => onFrequencyChange(frequency - 1)}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronDown />
            </button>
            
            <div className="flex flex-col items-center w-40">
              <input
                type="number"
                value={Math.round(frequency)}
                onChange={(e) => onFrequencyChange(Number(e.target.value))}
                className="w-full bg-transparent text-center text-4xl font-bold text-cyan-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold tracking-widest mt-1">HERTZ</span>
            </div>

            <button
              onClick={() => onFrequencyChange(frequency + 1)}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronUp />
            </button>
          </div>
        </div>
      </div>

      {/* WAVEFORM SELECTOR */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="text-teal-400 w-5 h-5" />
          Waveform
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {(['sine', 'square', 'sawtooth', 'triangle'] as WaveformType[]).map((type) => (
            <button
              key={type}
              onClick={() => onWaveformChange(type)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                waveform === type
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                  : 'bg-slate-700/30 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="capitalize font-medium">{type}</span>
              {waveform === type && <CheckCircle2 className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </div>

      {/* VOLUME & PAN */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col justify-between space-y-6">
        
        {/* Volume */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Volume2 className="text-teal-400 w-5 h-5" />
              Master Volume
            </h3>
            <span className="text-sm font-mono text-slate-400">{(volume * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.8" // Max strict limit
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-1 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
            <span>Mute</span>
            <span>-20dB</span>
            <span>Max (Safe)</span>
          </div>
        </div>

        <div className="h-px bg-slate-700/50 w-full" />

        {/* Balance */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Ear className="text-teal-400 w-5 h-5" />
              Ear Balance
            </h3>
            <span className="text-sm font-mono text-slate-400">
              {balance === 0 ? 'CENTER' : balance < 0 ? `L ${(Math.abs(balance) * 100).toFixed(0)}%` : `R ${(balance * 100).toFixed(0)}%`}
            </span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={balance}
            onChange={(e) => onBalanceChange(Number(e.target.value))}
            className="w-full"
          />
           <div className="flex justify-between mt-1 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
            <span>Left Ear</span>
            <span>Both</span>
            <span>Right Ear</span>
          </div>
        </div>

      </div>

    </div>
  );
};