import { useEffect, useCallback } from "react";

interface UseOnboardingKeyboardProps {
  onNext: () => void;
  onPrev: () => void;
  onConfirm?: () => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  enabled?: boolean;
}

export function useOnboardingKeyboard({
  onNext,
  onPrev,
  onConfirm,
  canGoNext = true,
  canGoPrev = true,
  enabled = true,
}: UseOnboardingKeyboardProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          if (canGoNext) {
            event.preventDefault();
            onNext();
          }
          break;
        case "ArrowLeft":
          if (canGoPrev) {
            event.preventDefault();
            onPrev();
          }
          break;
        case "Enter":
          if (onConfirm && canGoNext) {
            event.preventDefault();
            onConfirm();
          }
          break;
        case "Escape":
          // Could be used for skip modal or other actions
          break;
      }
    },
    [onNext, onPrev, onConfirm, canGoNext, canGoPrev, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
