import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, Calendar, CheckCircle2, Brain, TrendingUp, Coins, Heart, Lightbulb, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  highlightSelector?: string;
  position: "center" | "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Dashboard",
    description: "This is your command center. Let's take a quick tour of the key features that will help you stay in control.",
    icon: Sparkles,
    position: "center",
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "Access your most-used features instantly—Calendar, Habits, Insights, Recovery, and more. One tap away.",
    icon: CheckCircle2,
    position: "top",
  },
  {
    id: "habits",
    title: "Habit Tracking",
    description: "Track your daily habits and build streaks. The system learns your patterns and adapts reminders to your rhythm.",
    icon: CheckCircle2,
    position: "left",
  },
  {
    id: "calendar",
    title: "Smart Calendar",
    description: "Your schedule, intelligently managed. See what's happening now and what's coming up, with energy-aware suggestions.",
    icon: Calendar,
    position: "right",
  },
  {
    id: "cognitive",
    title: "Cognitive Budget",
    description: "Monitor your mental energy throughout the day. The system helps protect you from overload.",
    icon: Brain,
    position: "bottom",
  },
  {
    id: "modules",
    title: "Life Modules",
    description: "Explore Wealth, Life & Health, Mind & Growth, and Sovereignty—your four pillars for holistic growth.",
    icon: Coins,
    position: "center",
  },
  {
    id: "help",
    title: "Always Here to Help",
    description: "Tap the Help button anytime for guides, tips, and support. You're never alone on this journey.",
    icon: HelpCircle,
    position: "center",
  },
];

interface DashboardTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function DashboardTour({ isOpen, onClose, onComplete }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep, onComplete]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen) return null;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    exit: { scale: 0, rotate: 180 },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Spotlight effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              background: [
                "radial-gradient(600px circle at 50% 40%, rgba(147, 112, 219, 0.15), transparent 60%)",
                "radial-gradient(600px circle at 50% 60%, rgba(255, 215, 0, 0.1), transparent 60%)",
                "radial-gradient(600px circle at 50% 40%, rgba(0, 255, 255, 0.1), transparent 60%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0"
          />
        </div>

        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-foreground/10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-foreground/5">
              <span className="text-xs font-medium text-muted-foreground">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[280px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-center"
                >
                  {/* Icon with glow */}
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, type: "spring" }}
                    className="relative mx-auto mb-6"
                  >
                    <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full blur-xl" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-foreground/10 flex items-center justify-center">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-xl font-display font-semibold text-foreground mb-3">
                    {step.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-1.5 pb-4">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentStep ? 1 : -1);
                    setCurrentStep(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-6 bg-primary"
                      : index < currentStep
                      ? "w-1.5 bg-primary/50"
                      : "w-1.5 bg-foreground/20"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4 border-t border-foreground/5 bg-foreground/5">
              <div>
                {isFirstStep ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip Tour
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>

              <Button
                onClick={handleNext}
                size="sm"
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                {isLastStep ? (
                  <>
                    Get Started
                    <Sparkles className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Keyboard hints */}
            <div className="flex items-center justify-center gap-4 py-2 bg-foreground/3 text-xs text-muted-foreground/70">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono">←</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono">→</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono">Enter</kbd>
                Continue
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
