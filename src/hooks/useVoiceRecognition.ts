import { useState, useCallback, useEffect, useRef } from "react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export type VoiceState = "idle" | "listening" | "processing" | "error";

interface UseVoiceRecognitionOptions {
  onTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  autoStopDelay?: number;
  language?: string;
}

export function useVoiceRecognition({
  onTranscript,
  onFinalTranscript,
  autoStopDelay = 2000,
  language = "en-US",
}: UseVoiceRecognitionOptions = {}) {
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setState("listening");
      setErrorMessage(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      onTranscript?.(currentTranscript);

      // Reset auto-stop timer on new speech
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
      }

      if (finalTranscript) {
        autoStopTimeoutRef.current = setTimeout(() => {
          stop();
          onFinalTranscript?.(finalTranscript.trim());
        }, autoStopDelay);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setState("error");
      setErrorMessage(event.error);
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      if (state === "listening") {
        setState("idle");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
      }
      recognition.abort();
    };
  }, [language, autoStopDelay, onTranscript, onFinalTranscript]);

  const start = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;

    try {
      setTranscript("");
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;

    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
    }

    setState("processing");
    recognitionRef.current.stop();

    setTimeout(() => {
      setState("idle");
    }, 300);
  }, []);

  const toggle = useCallback(() => {
    if (state === "listening") {
      stop();
    } else {
      start();
    }
  }, [state, start, stop]);

  return {
    state,
    transcript,
    isSupported,
    errorMessage,
    start,
    stop,
    toggle,
    isListening: state === "listening",
  };
}
