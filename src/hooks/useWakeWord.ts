import { useState, useEffect, useRef, useCallback, useContext } from "react";

interface UseWakeWordOptions {
  wakeWord?: string;
  wakeWordVariations?: string[];
  onWake?: () => void;
  onSleep?: () => void;
  sensitivity?: number;
  autoRestart?: boolean;
  sleepTimeout?: number;
}

interface UseWakeWordReturn {
  isActive: boolean;
  isListening: boolean;
  isAwake: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetWake: () => void;
  lastHeard: string;
  error: string | null;
  currentWakeWord: string;
}

/**
 * Voice-activated wake word detection hook
 * Listens for a specific phrase (default: "Hey SITA") to activate the avatar
 * Now supports customizable wake words with variations
 */
export function useWakeWord(options: UseWakeWordOptions = {}): UseWakeWordReturn {
  const {
    wakeWord = "hey sita",
    wakeWordVariations = [],
    onWake,
    onSleep,
    sensitivity = 0.6,
    autoRestart = true,
    sleepTimeout = 30000,
  } = options;

  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const wakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Clean up timeout
  const clearWakeTimeout = useCallback(() => {
    if (wakeTimeoutRef.current) {
      clearTimeout(wakeTimeoutRef.current);
      wakeTimeoutRef.current = null;
    }
  }, []);

  // Check if transcript contains wake word (fuzzy matching)
  const matchesWakeWord = useCallback((transcript: string): boolean => {
    const normalized = transcript.toLowerCase().trim();
    const wakeWordNormalized = wakeWord.toLowerCase().trim();
    
    // Direct match
    if (normalized.includes(wakeWordNormalized)) {
      return true;
    }
    
    // Default variations for common misrecognitions
    const defaultVariations = [
      "hey sita",
      "hey cita",
      "hey seeta",
      "a sita",
      "hey cedar",
      "hey seda",
      "hey zita",
      "hay sita",
      "heysita",
      "hey sweater",
      "hey sitter",
    ];
    
    // Combine default with custom variations
    const allVariations = [...defaultVariations, ...wakeWordVariations, wakeWordNormalized];
    
    return allVariations.some(variation => {
      if (normalized.includes(variation.toLowerCase())) return true;
      
      // Check similarity
      const similarity = calculateSimilarity(normalized, variation.toLowerCase());
      return similarity >= sensitivity;
    });
  }, [wakeWord, wakeWordVariations, sensitivity]);

  // Simple similarity calculation (Levenshtein-based ratio)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const costs = [];
    for (let i = 0; i <= shorter.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= longer.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[longer.length] = lastValue;
    }
    
    return (longer.length - costs[longer.length]) / longer.length;
  };

  // Create and configure recognition
  const createRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      console.log("Wake word detection started");
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Wake word detection ended");
      
      // Auto-restart if enabled and still active
      if (autoRestart && isActive && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.log("Restart pending...");
          }
        }, 100);
      }
    };

    recognition.onerror = (event) => {
      console.error("Wake word error:", event.error);
      
      if (event.error === "not-allowed") {
        setError("Microphone access denied");
        setIsActive(false);
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(event.error);
      }
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          console.log("Final transcript:", transcript);
        } else {
          interimTranscript += transcript;
        }
        
        // Check all alternatives
        for (let j = 0; j < event.results[i].length; j++) {
          const alt = event.results[i][j].transcript;
          setLastHeard(alt);
          
          if (matchesWakeWord(alt)) {
            console.log("Wake word detected:", alt);
            setIsAwake(true);
            onWake?.();
            
            // Set auto-sleep timeout based on config
            clearWakeTimeout();
            wakeTimeoutRef.current = setTimeout(() => {
              setIsAwake(false);
              onSleep?.();
            }, sleepTimeout);
            
            return;
          }
        }
      }
    };

    return recognition;
  }, [isSupported, autoRestart, isActive, matchesWakeWord, onWake, onSleep, clearWakeTimeout]);

  // Start listening for wake word
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition not supported");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = createRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      setIsActive(true);
      
      try {
        recognition.start();
      } catch (e) {
        console.error("Failed to start wake word detection:", e);
      }
    }
  }, [isSupported, createRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    setIsActive(false);
    clearWakeTimeout();
    
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setIsAwake(false);
  }, [clearWakeTimeout]);

  // Reset wake state (go back to listening)
  const resetWake = useCallback(() => {
    clearWakeTimeout();
    setIsAwake(false);
    onSleep?.();
  }, [clearWakeTimeout, onSleep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearWakeTimeout();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [clearWakeTimeout]);

  return {
    isActive,
    isListening,
    isAwake,
    startListening,
    stopListening,
    resetWake,
    lastHeard,
    error,
    currentWakeWord: wakeWord,
  };
}

// Type declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
