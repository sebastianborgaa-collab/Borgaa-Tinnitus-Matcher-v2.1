import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { useAudioEngine } from './hooks/useAudioEngine';
import { WaveformType } from './types';
import { Play, Pause, Activity } from 'lucide-react';

export default function App() {
  const {
    isPlaying,
    frequency,
    volume,
    balance,
    waveform,
    togglePlay,
    initAudio,
    setFrequency,
    setVolume,
    setBalance,
    setWaveform
  } = useAudioEngine();

  // Local state for initialization warning
  const [isInitialized, setIsInitialized] = useState(false);

  const handleStart = () => {
    setIsInitialized(true);
    initAudio();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Borgaa Tinnitus Klinik</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Frequency Matcher v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-sm font-medium text-slate-400">{isPlaying ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!isInitialized ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white">Ready to Start Session</h2>
              <p className="text-slate-400">Initialize the audio engine to begin diagnosis.</p>
            </div>
            <button
              onClick={handleStart}
              className="group relative flex items-center justify-center w-24 h-24 bg-cyan-500 rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] active:scale-95"
            >
              <Play className="w-10 h-10 text-slate-900 fill-current translate-x-1" />
            </button>
            <p className="text-xs text-slate-500 max-w-xs text-center">
              CAUTION: Ensure system volume is low before starting. Max output is limited to -2dB safe gain.
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
            
            {/* Master Toggle */}
            <div className="flex justify-center mb-8">
               <button
                onClick={togglePlay}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                  isPlaying 
                    ? 'bg-slate-800 text-red-400 border border-red-500/30 hover:bg-slate-700 hover:text-red-300' 
                    : 'bg-cyan-600 text-white border border-cyan-400/30 hover:bg-cyan-500'
                }`}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                {isPlaying ? 'STOP SIGNAL' : 'START SIGNAL'}
              </button>
            </div>

            <ControlPanel
              isPlaying={isPlaying}
              frequency={frequency}
              volume={volume}
              balance={balance}
              waveform={waveform}
              onFrequencyChange={setFrequency}
              onVolumeChange={setVolume}
              onBalanceChange={setBalance}
              onWaveformChange={setWaveform}
            />
          </div>
        )}
      </main>
    </div>
  );
}