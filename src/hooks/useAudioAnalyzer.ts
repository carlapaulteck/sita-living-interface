import { useState, useRef, useCallback, useEffect } from "react";

interface AudioAnalyzerState {
  audioLevel: number;
  frequencyData: Uint8Array | null;
  isAnalyzing: boolean;
}

interface UseAudioAnalyzerReturn extends AudioAnalyzerState {
  startAnalyzing: (stream?: MediaStream) => Promise<void>;
  stopAnalyzing: () => void;
  analyzeAudioElement: (audioElement: HTMLAudioElement) => void;
}

/**
 * Hook for real-time audio analysis using Web Audio API
 * Provides audio levels and frequency data for lip-sync animations
 */
export function useAudioAnalyzer(): UseAudioAnalyzerReturn {
  const [state, setState] = useState<AudioAnalyzerState>({
    audioLevel: 0,
    frequencyData: null,
    isAnalyzing: false,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyzerRef.current) {
      analyzerRef.current.disconnect();
      analyzerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setState({
      audioLevel: 0,
      frequencyData: null,
      isAnalyzing: false,
    });
  }, []);

  // Analyze audio data in animation loop
  const analyze = useCallback(() => {
    if (!analyzerRef.current || !dataArrayRef.current) return;

    const dataArray = dataArrayRef.current;
    analyzerRef.current.getByteFrequencyData(dataArray as any);

    // Calculate average audio level (0-1)
    let sum = 0;
    const len = dataArray.length;
    for (let i = 0; i < len; i++) {
      sum += dataArray[i];
    }
    const average = sum / len;
    const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1

    // Apply some smoothing and emphasis on speech frequencies (85-255 Hz range)
    // Focus on lower-mid frequencies where speech fundamentals are
    const speechBins = Math.floor(len * 0.3);
    let speechSum = 0;
    for (let i = 0; i < speechBins; i++) {
      speechSum += dataArray[i];
    }
    const speechLevel = Math.min((speechSum / speechBins) / 100, 1);

    // Blend overall and speech-focused levels
    const blendedLevel = normalizedLevel * 0.4 + speechLevel * 0.6;

    // Create a copy of the frequency data for state
    const frequencyCopy = new Uint8Array(len);
    frequencyCopy.set(dataArray);

    setState((prev) => ({
      ...prev,
      audioLevel: blendedLevel,
      frequencyData: frequencyCopy,
    }));

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, []);

  // Start analyzing microphone input
  const startAnalyzing = useCallback(async (existingStream?: MediaStream) => {
    cleanup();

    try {
      const stream = existingStream || await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      analyzerRef.current.smoothingTimeConstant = 0.8;

      const bufferLength = analyzerRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyzerRef.current);

      setState((prev) => ({ ...prev, isAnalyzing: true }));
      analyze();
    } catch (error) {
      console.error("Failed to start audio analysis:", error);
    }
  }, [analyze, cleanup]);

  // Analyze audio from an HTML audio element
  const analyzeAudioElement = useCallback((audioElement: HTMLAudioElement) => {
    cleanup();

    try {
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      analyzerRef.current.smoothingTimeConstant = 0.8;

      const bufferLength = analyzerRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);

      setState((prev) => ({ ...prev, isAnalyzing: true }));
      analyze();
    } catch (error) {
      console.error("Failed to analyze audio element:", error);
    }
  }, [analyze, cleanup]);

  const stopAnalyzing = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    ...state,
    startAnalyzing,
    stopAnalyzing,
    analyzeAudioElement,
  };
}

/**
 * Compute lip-sync mouth shape based on audio frequency data
 */
export function computeMouthShape(frequencyData: Uint8Array | null, audioLevel: number): {
  openness: number;
  width: number;
  shape: "closed" | "slightly-open" | "open" | "wide";
} {
  if (!frequencyData || audioLevel < 0.05) {
    return { openness: 0, width: 0.5, shape: "closed" };
  }

  // Mouth openness based on overall level
  const openness = Math.min(audioLevel * 1.5, 1);

  // Width varies with frequency content
  const lowFreqSum = Array.from(frequencyData.slice(0, 10)).reduce((a, b) => a + b, 0) / 10;
  const highFreqSum = Array.from(frequencyData.slice(20, 40)).reduce((a, b) => a + b, 0) / 20;
  const width = 0.3 + (highFreqSum / 255) * 0.4 + (lowFreqSum / 255) * 0.3;

  // Determine discrete shape
  let shape: "closed" | "slightly-open" | "open" | "wide" = "closed";
  if (openness > 0.7) shape = "wide";
  else if (openness > 0.4) shape = "open";
  else if (openness > 0.15) shape = "slightly-open";

  return { openness, width, shape };
}
