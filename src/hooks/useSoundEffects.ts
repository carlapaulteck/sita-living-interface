import { useCallback, useRef, useEffect, useState } from 'react';

// Simple audio context-based sound effects
// No external libraries required

interface SoundOptions {
  volume?: number;
  pitch?: number;
}

type SoundType = 
  | 'click' 
  | 'hover' 
  | 'success' 
  | 'error' 
  | 'notification' 
  | 'levelUp'
  | 'achievement'
  | 'whoosh'
  | 'pop';

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('sound-effects-enabled');
    return stored !== 'false'; // Default to true
  });

  useEffect(() => {
    localStorage.setItem('sound-effects-enabled', String(isEnabled));
  }, [isEnabled]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType, options: SoundOptions = {}) => {
    if (!isEnabled) return;
    
    const { volume = 0.15, pitch = 1 } = options;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      switch (type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800 * pitch, now);
          oscillator.frequency.exponentialRampToValueAtTime(600 * pitch, now + 0.05);
          gainNode.gain.setValueAtTime(volume, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          oscillator.start(now);
          oscillator.stop(now + 0.05);
          break;
          
        case 'hover':
          oscillator.frequency.setValueAtTime(1200 * pitch, now);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(volume * 0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
          oscillator.start(now);
          oscillator.stop(now + 0.03);
          break;
          
        case 'success':
          // Two-tone success chime
          oscillator.frequency.setValueAtTime(523.25 * pitch, now); // C5
          oscillator.frequency.setValueAtTime(659.25 * pitch, now + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99 * pitch, now + 0.2); // G5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(volume, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          oscillator.start(now);
          oscillator.stop(now + 0.4);
          break;
          
        case 'error':
          oscillator.frequency.setValueAtTime(200 * pitch, now);
          oscillator.frequency.exponentialRampToValueAtTime(100 * pitch, now + 0.2);
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(volume * 0.5, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          oscillator.start(now);
          oscillator.stop(now + 0.2);
          break;
          
        case 'notification':
          // Gentle notification ping
          oscillator.frequency.setValueAtTime(880 * pitch, now); // A5
          oscillator.frequency.setValueAtTime(1046.5 * pitch, now + 0.1); // C6
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(volume * 0.6, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;
          
        case 'levelUp':
          // Triumphant arpeggio
          playArpeggio(ctx, [523.25, 659.25, 783.99, 1046.5], volume, pitch);
          break;
          
        case 'achievement':
          // Sparkly achievement sound
          playArpeggio(ctx, [1046.5, 1318.5, 1567.98, 2093], volume * 0.7, pitch);
          break;
          
        case 'whoosh':
          // Transition whoosh
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(100 * pitch, now);
          oscillator.frequency.exponentialRampToValueAtTime(2000 * pitch, now + 0.15);
          oscillator.frequency.exponentialRampToValueAtTime(100 * pitch, now + 0.3);
          gainNode.gain.setValueAtTime(0.01, now);
          gainNode.gain.linearRampToValueAtTime(volume * 0.3, now + 0.15);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;
          
        case 'pop':
          oscillator.frequency.setValueAtTime(400 * pitch, now);
          oscillator.frequency.exponentialRampToValueAtTime(200 * pitch, now + 0.08);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(volume, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          oscillator.start(now);
          oscillator.stop(now + 0.08);
          break;
      }
    } catch (e) {
      // Audio not supported or blocked
      console.warn('Sound effect failed:', e);
    }
  }, [isEnabled, getAudioContext]);

  return {
    playSound,
    isEnabled,
    setIsEnabled,
    toggle: () => setIsEnabled((prev) => !prev),
  };
}

// Helper for playing arpeggio sequences
function playArpeggio(
  ctx: AudioContext,
  frequencies: number[],
  volume: number,
  pitch: number
) {
  const now = ctx.currentTime;
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(freq * pitch, now + i * 0.1);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(volume, now + i * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
    
    oscillator.start(now + i * 0.1);
    oscillator.stop(now + i * 0.1 + 0.3);
  });
}

// Hook for ambient background soundscape (optional feature)
export function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscillators: OscillatorNode[]; gains: GainNode[] }>({
    oscillators: [],
    gains: [],
  });

  const start = useCallback(() => {
    if (isPlaying) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    
    // Create gentle ambient drone
    const frequencies = [60, 90, 120, 180]; // Low harmonic frequencies
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = 0.02 / (i + 1); // Decreasing volume for overtones
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      
      oscillators.push(osc);
      gains.push(gain);
    });
    
    nodesRef.current = { oscillators, gains };
    setIsPlaying(true);
  }, [isPlaying]);

  const stop = useCallback(() => {
    nodesRef.current.oscillators.forEach((osc) => osc.stop());
    nodesRef.current = { oscillators: [], gains: [] };
    audioContextRef.current?.close();
    setIsPlaying(false);
  }, []);

  return { isPlaying, start, stop, toggle: () => (isPlaying ? stop() : start()) };
}
