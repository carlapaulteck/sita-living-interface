// Cognitive Profile Builder - Infers profile from onboarding behavior
// No labels, no shame - just understanding how users operate

export interface CognitiveDiscoverySignals {
  // Density choice
  densityChoice: "dense" | "focused" | "adaptive";
  densityChoiceTime: number; // ms to decide
  
  // Task organization
  taskOrganization: "freeform" | "structured" | "hybrid";
  taskOrganizationTime: number;
  
  // Change tolerance
  changeTolerance: "low" | "medium" | "high";
  changeToleranceTime: number;
  
  // Progress visualization
  progressVisualization: "timer" | "progress" | "both" | "none";
  progressVisualizationTime: number;
  
  // Emotional calibration
  pileUpResponse: "fewer_choices" | "clearer_steps" | "reassurance" | "silence";
  reminderFeeling: "helpful" | "stressful" | "depends";
  autoChangePreference: "automatic" | "ask_first" | "never";
  
  // Self-recognition tags (optional)
  selfRecognitionTags: string[];
  
  // Meta signals
  skippedSteps: number;
  totalTimeMs: number;
  hesitationPatterns: number[]; // Time between interactions
}

export interface CognitiveProfile {
  // Core dimensions (0-1 scale)
  attention_window: "short" | "medium" | "long";
  initiation_friction: number;
  switching_cost: number;
  structure_preference: number;
  
  // Sensory sensitivity
  sensory_sensitivity: {
    visual: number;
    audio: number;
  };
  
  // Motivation & response
  reward_sensitivity: number;
  predictability_need: number;
  language_softness_preference: number;
  
  // Processing style
  novelty_tolerance: number;
  visual_processing: number;
  
  // Behavioral markers
  density_preference: "dense" | "focused" | "adaptive";
  task_organization: "freeform" | "structured" | "hybrid";
  change_tolerance: "low" | "medium" | "high";
  progress_visualization: "timer" | "progress" | "both" | "none";
  pile_up_response: "fewer_choices" | "clearer_steps" | "reassurance" | "silence";
  reminder_feeling: "helpful" | "stressful" | "depends";
  auto_change_preference: "automatic" | "ask_first" | "never";
  self_recognition_tags: string[];
}

// Decision time thresholds (ms)
const QUICK_DECISION = 2000;
const NORMAL_DECISION = 5000;
const SLOW_DECISION = 10000;

// Self-recognition tag weights
const TAG_WEIGHTS: Record<string, Partial<CognitiveProfile>> = {
  "lose_track_of_time": {
    attention_window: "short",
    initiation_friction: 0.7,
  },
  "too_many_options": {
    structure_preference: 0.9,
    sensory_sensitivity: { visual: 0.8, audio: 0.5 },
  },
  "predictability_helps": {
    predictability_need: 0.9,
    novelty_tolerance: 0.3,
  },
  "starting_is_hard": {
    initiation_friction: 0.9,
    reward_sensitivity: 0.8,
  },
  "notice_small_details": {
    sensory_sensitivity: { visual: 0.9, audio: 0.7 },
    visual_processing: 0.9,
  },
  "background_noise_helps": {
    sensory_sensitivity: { visual: 0.5, audio: 0.3 },
  },
};

export function buildCognitiveProfile(signals: CognitiveDiscoverySignals): CognitiveProfile {
  // Start with neutral defaults
  const profile: CognitiveProfile = {
    attention_window: "medium",
    initiation_friction: 0.5,
    switching_cost: 0.5,
    structure_preference: 0.5,
    sensory_sensitivity: {
      visual: 0.5,
      audio: 0.5,
    },
    reward_sensitivity: 0.5,
    predictability_need: 0.5,
    language_softness_preference: 0.7,
    novelty_tolerance: 0.5,
    visual_processing: 0.5,
    density_preference: signals.densityChoice,
    task_organization: signals.taskOrganization,
    change_tolerance: signals.changeTolerance,
    progress_visualization: signals.progressVisualization,
    pile_up_response: signals.pileUpResponse,
    reminder_feeling: signals.reminderFeeling,
    auto_change_preference: signals.autoChangePreference,
    self_recognition_tags: signals.selfRecognitionTags,
  };
  
  // Infer from density choice
  if (signals.densityChoice === "focused") {
    profile.attention_window = "short";
    profile.sensory_sensitivity.visual = Math.max(profile.sensory_sensitivity.visual, 0.7);
    profile.structure_preference = Math.max(profile.structure_preference, 0.7);
  } else if (signals.densityChoice === "dense") {
    profile.attention_window = "long";
    profile.sensory_sensitivity.visual = Math.min(profile.sensory_sensitivity.visual, 0.4);
  }
  
  // Infer from task organization
  if (signals.taskOrganization === "structured") {
    profile.structure_preference = Math.max(profile.structure_preference, 0.8);
    profile.predictability_need = Math.max(profile.predictability_need, 0.7);
  } else if (signals.taskOrganization === "freeform") {
    profile.structure_preference = Math.min(profile.structure_preference, 0.3);
    profile.novelty_tolerance = Math.max(profile.novelty_tolerance, 0.7);
  }
  
  // Infer from change tolerance
  if (signals.changeTolerance === "low") {
    profile.switching_cost = 0.9;
    profile.predictability_need = Math.max(profile.predictability_need, 0.85);
  } else if (signals.changeTolerance === "high") {
    profile.switching_cost = 0.2;
    profile.novelty_tolerance = Math.max(profile.novelty_tolerance, 0.8);
  }
  
  // Infer from emotional calibration
  switch (signals.pileUpResponse) {
    case "fewer_choices":
      profile.sensory_sensitivity.visual = Math.max(profile.sensory_sensitivity.visual, 0.8);
      profile.structure_preference = Math.max(profile.structure_preference, 0.8);
      break;
    case "clearer_steps":
      profile.initiation_friction = Math.max(profile.initiation_friction, 0.7);
      profile.structure_preference = Math.max(profile.structure_preference, 0.7);
      break;
    case "reassurance":
      profile.language_softness_preference = 0.95;
      profile.reward_sensitivity = Math.max(profile.reward_sensitivity, 0.85);
      break;
    case "silence":
      profile.sensory_sensitivity.audio = Math.max(profile.sensory_sensitivity.audio, 0.9);
      profile.sensory_sensitivity.visual = Math.max(profile.sensory_sensitivity.visual, 0.7);
      break;
  }
  
  if (signals.reminderFeeling === "stressful") {
    profile.language_softness_preference = Math.max(profile.language_softness_preference, 0.9);
    profile.predictability_need = Math.max(profile.predictability_need, 0.7);
  }
  
  if (signals.autoChangePreference === "never") {
    profile.predictability_need = 0.95;
    profile.switching_cost = 0.9;
  } else if (signals.autoChangePreference === "automatic") {
    profile.switching_cost = Math.min(profile.switching_cost, 0.3);
  }
  
  // Apply self-recognition tag weights
  for (const tag of signals.selfRecognitionTags) {
    const weights = TAG_WEIGHTS[tag];
    if (weights) {
      if (weights.attention_window) profile.attention_window = weights.attention_window;
      if (weights.initiation_friction !== undefined) {
        profile.initiation_friction = Math.max(profile.initiation_friction, weights.initiation_friction);
      }
      if (weights.structure_preference !== undefined) {
        profile.structure_preference = Math.max(profile.structure_preference, weights.structure_preference);
      }
      if (weights.predictability_need !== undefined) {
        profile.predictability_need = Math.max(profile.predictability_need, weights.predictability_need);
      }
      if (weights.novelty_tolerance !== undefined) {
        profile.novelty_tolerance = weights.novelty_tolerance;
      }
      if (weights.reward_sensitivity !== undefined) {
        profile.reward_sensitivity = Math.max(profile.reward_sensitivity, weights.reward_sensitivity);
      }
      if (weights.sensory_sensitivity) {
        profile.sensory_sensitivity.visual = Math.max(
          profile.sensory_sensitivity.visual, 
          weights.sensory_sensitivity.visual || 0
        );
        profile.sensory_sensitivity.audio = Math.max(
          profile.sensory_sensitivity.audio,
          weights.sensory_sensitivity.audio || 0
        );
      }
      if (weights.visual_processing !== undefined) {
        profile.visual_processing = Math.max(profile.visual_processing, weights.visual_processing);
      }
    }
  }
  
  // Adjust based on decision timing patterns
  const avgDecisionTime = (
    signals.densityChoiceTime + 
    signals.taskOrganizationTime + 
    signals.changeToleranceTime + 
    signals.progressVisualizationTime
  ) / 4;
  
  if (avgDecisionTime < QUICK_DECISION) {
    // Fast decisions suggest lower initiation friction
    profile.initiation_friction = Math.min(profile.initiation_friction, 0.4);
  } else if (avgDecisionTime > SLOW_DECISION) {
    // Slow decisions suggest higher initiation friction or sensory processing
    profile.initiation_friction = Math.max(profile.initiation_friction, 0.6);
  }
  
  // Hesitation patterns indicate cognitive load sensitivity
  if (signals.hesitationPatterns.length > 0) {
    const avgHesitation = signals.hesitationPatterns.reduce((a, b) => a + b, 0) / signals.hesitationPatterns.length;
    if (avgHesitation > 3000) {
      profile.structure_preference = Math.max(profile.structure_preference, 0.7);
    }
  }
  
  // Skipped steps indicate need for autonomy
  if (signals.skippedSteps > 2) {
    profile.structure_preference = Math.min(profile.structure_preference, 0.4);
  }
  
  return profile;
}

// Generate human-readable adaptation preview
export function generateAdaptationPreview(profile: CognitiveProfile): string[] {
  const adaptations: string[] = [];
  
  if (profile.attention_window === "short") {
    adaptations.push("Fewer simultaneous tasks");
  }
  
  if (profile.sensory_sensitivity.visual > 0.7) {
    adaptations.push("Cleaner, simpler layouts");
  }
  
  if (profile.structure_preference > 0.7) {
    adaptations.push("Step-by-step guidance");
  }
  
  if (profile.predictability_need > 0.7) {
    adaptations.push("Changes announced in advance");
  }
  
  if (profile.switching_cost > 0.7) {
    adaptations.push("Slower visual transitions");
  }
  
  if (profile.language_softness_preference > 0.8) {
    adaptations.push("Gentler, choice-based language");
  }
  
  if (profile.initiation_friction > 0.7) {
    adaptations.push("Clear next steps always visible");
  }
  
  if (profile.reward_sensitivity > 0.8) {
    adaptations.push("More celebration of progress");
  }
  
  // Default if nothing specific
  if (adaptations.length === 0) {
    adaptations.push("Balanced adaptations");
    adaptations.push("Responsive to your patterns");
  }
  
  return adaptations.slice(0, 4);
}
