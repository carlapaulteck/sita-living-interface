// Cognitive State Types
export type CognitiveState = 
  | "flow" 
  | "distracted" 
  | "overload" 
  | "fatigued" 
  | "hyperfocus" 
  | "recovery"
  | "neutral";

export interface CognitiveStateResult {
  state: CognitiveState;
  confidence: number;
  stressIndex: number;
  focusLevel: number;
  cognitiveBudget: number;
  prediction?: {
    nextState: CognitiveState;
    timeToOnsetMinutes: number;
    confidence: number;
  };
}

export interface SignalAggregates {
  keystrokeLatency: { mean: number; variance: number; count: number };
  scrollVelocity: { mean: number; max: number; directionChanges: number };
  mouseEntropy: { mean: number; recent: number };
  clickHesitation: { mean: number; recent: number };
  focusDuration: { total: number; breaks: number };
  idleTime: { total: number; periods: number };
  tabSwitches: number;
  sessionDuration: number;
}

// State detection thresholds
const STATE_THRESHOLDS = {
  flow: {
    focusMin: 0.7,
    stressMax: 0.3,
    latencyVarianceMax: 50,
    tabSwitchesMax: 2,
  },
  distracted: {
    focusMax: 0.4,
    tabSwitchesMin: 5,
    scrollDirectionChangesMin: 10,
  },
  overload: {
    stressMin: 0.7,
    budgetMax: 0.3,
    latencyIncreasePercent: 30,
  },
  fatigued: {
    latencyIncreasePercent: 20,
    focusDeclinePercent: 25,
    sessionMinutes: 90,
  },
  hyperfocus: {
    focusMin: 0.9,
    tabSwitchesMax: 0,
    sessionMinutes: 60,
    idleTimeMax: 120000, // 2 minutes
  },
  recovery: {
    idleTimeMin: 300000, // 5 minutes
    activityLevel: "low",
  },
};

// Infer cognitive state from signal aggregates
export function inferCognitiveState(
  signals: SignalAggregates,
  historicalBaseline?: SignalAggregates
): CognitiveStateResult {
  // Calculate core metrics
  const focusLevel = calculateFocusLevel(signals);
  const stressIndex = calculateStressIndex(signals, historicalBaseline);
  const cognitiveBudget = calculateCognitiveBudget(signals, historicalBaseline);

  // Detect state
  const { state, confidence } = detectState(signals, focusLevel, stressIndex, cognitiveBudget, historicalBaseline);

  // Predict next state
  const prediction = predictNextState(state, signals, focusLevel, stressIndex, cognitiveBudget);

  return {
    state,
    confidence,
    stressIndex,
    focusLevel,
    cognitiveBudget,
    prediction,
  };
}

function calculateFocusLevel(signals: SignalAggregates): number {
  // Focus based on low tab switches, consistent keystrokes, minimal idle time
  const tabPenalty = Math.min(signals.tabSwitches / 10, 0.5);
  const keystrokeConsistency = signals.keystrokeLatency.count > 10 
    ? Math.max(0, 1 - signals.keystrokeLatency.variance / 200)
    : 0.5;
  const idlePenalty = Math.min(signals.idleTime.periods / 5, 0.3);
  const focusBonusFromDuration = Math.min(signals.focusDuration.total / 1800000, 0.2); // Up to 30 min bonus

  return Math.max(0, Math.min(1, 
    0.5 + keystrokeConsistency * 0.3 - tabPenalty - idlePenalty + focusBonusFromDuration
  ));
}

function calculateStressIndex(signals: SignalAggregates, baseline?: SignalAggregates): number {
  // Stress based on increased latency, rapid scrolling, high hesitation
  let stress = 0.3; // Base stress

  // Latency increase from baseline
  if (baseline && baseline.keystrokeLatency.mean > 0) {
    const latencyIncrease = (signals.keystrokeLatency.mean - baseline.keystrokeLatency.mean) / baseline.keystrokeLatency.mean;
    stress += Math.max(0, latencyIncrease) * 0.3;
  }

  // High scroll velocity indicates rushed behavior
  if (signals.scrollVelocity.max > 2) { // More than 2 pixels/ms
    stress += 0.15;
  }

  // Direction changes indicate searching/confusion
  if (signals.scrollVelocity.directionChanges > 10) {
    stress += 0.1;
  }

  // High click hesitation can indicate uncertainty
  if (signals.clickHesitation.recent > 3000) { // > 3 seconds
    stress += 0.1;
  }

  return Math.max(0, Math.min(1, stress));
}

function calculateCognitiveBudget(signals: SignalAggregates, baseline?: SignalAggregates): number {
  // Budget depletes over session duration and with high cognitive load
  const sessionHours = signals.sessionDuration / 3600000;
  const baseDepletion = Math.min(sessionHours / 4, 0.5); // 4 hours to deplete half

  // Additional depletion from high activity
  const activityDepletion = signals.tabSwitches * 0.02;
  
  // Idle time helps recovery
  const recoveryBonus = Math.min(signals.idleTime.total / 600000, 0.2); // Up to 0.2 for 10 min idle

  return Math.max(0.1, Math.min(1, 1 - baseDepletion - activityDepletion + recoveryBonus));
}

function detectState(
  signals: SignalAggregates,
  focusLevel: number,
  stressIndex: number,
  cognitiveBudget: number,
  baseline?: SignalAggregates
): { state: CognitiveState; confidence: number } {
  const scores: Record<CognitiveState, number> = {
    flow: 0,
    distracted: 0,
    overload: 0,
    fatigued: 0,
    hyperfocus: 0,
    recovery: 0,
    neutral: 0.3, // Base score for neutral
  };

  // Flow detection
  if (focusLevel >= STATE_THRESHOLDS.flow.focusMin && stressIndex <= STATE_THRESHOLDS.flow.stressMax) {
    scores.flow += 0.5;
    if (signals.tabSwitches <= STATE_THRESHOLDS.flow.tabSwitchesMax) {
      scores.flow += 0.3;
    }
    if (signals.keystrokeLatency.variance < STATE_THRESHOLDS.flow.latencyVarianceMax) {
      scores.flow += 0.2;
    }
  }

  // Distracted detection
  if (focusLevel <= STATE_THRESHOLDS.distracted.focusMax) {
    scores.distracted += 0.3;
  }
  if (signals.tabSwitches >= STATE_THRESHOLDS.distracted.tabSwitchesMin) {
    scores.distracted += 0.4;
  }
  if (signals.scrollVelocity.directionChanges >= STATE_THRESHOLDS.distracted.scrollDirectionChangesMin) {
    scores.distracted += 0.2;
  }

  // Overload detection
  if (stressIndex >= STATE_THRESHOLDS.overload.stressMin) {
    scores.overload += 0.4;
  }
  if (cognitiveBudget <= STATE_THRESHOLDS.overload.budgetMax) {
    scores.overload += 0.4;
  }
  if (baseline && signals.keystrokeLatency.mean > baseline.keystrokeLatency.mean * 1.3) {
    scores.overload += 0.2;
  }

  // Fatigued detection
  const sessionMinutes = signals.sessionDuration / 60000;
  if (sessionMinutes >= STATE_THRESHOLDS.fatigued.sessionMinutes) {
    scores.fatigued += 0.3;
    if (baseline && signals.keystrokeLatency.mean > baseline.keystrokeLatency.mean * 1.2) {
      scores.fatigued += 0.4;
    }
    if (focusLevel < 0.5 && cognitiveBudget < 0.5) {
      scores.fatigued += 0.3;
    }
  }

  // Hyperfocus detection
  if (focusLevel >= STATE_THRESHOLDS.hyperfocus.focusMin && 
      signals.tabSwitches <= STATE_THRESHOLDS.hyperfocus.tabSwitchesMax) {
    scores.hyperfocus += 0.4;
    if (sessionMinutes >= STATE_THRESHOLDS.hyperfocus.sessionMinutes) {
      scores.hyperfocus += 0.3;
    }
    if (signals.idleTime.total < STATE_THRESHOLDS.hyperfocus.idleTimeMax) {
      scores.hyperfocus += 0.2;
    }
  }

  // Recovery detection
  if (signals.idleTime.total >= STATE_THRESHOLDS.recovery.idleTimeMin) {
    scores.recovery += 0.6;
    if (signals.keystrokeLatency.count < 10) {
      scores.recovery += 0.3;
    }
  }

  // Find highest scoring state
  let maxState: CognitiveState = "neutral";
  let maxScore = scores.neutral;

  for (const [state, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxState = state as CognitiveState;
    }
  }

  return {
    state: maxState,
    confidence: Math.min(maxScore, 1),
  };
}

function predictNextState(
  currentState: CognitiveState,
  signals: SignalAggregates,
  focusLevel: number,
  stressIndex: number,
  cognitiveBudget: number
): CognitiveStateResult["prediction"] | undefined {
  // State transition predictions based on current trends
  const sessionMinutes = signals.sessionDuration / 60000;

  // Flow → Fatigued (after extended sessions)
  if (currentState === "flow" && sessionMinutes > 45) {
    return {
      nextState: "fatigued",
      timeToOnsetMinutes: Math.max(15, 90 - sessionMinutes),
      confidence: 0.6 + (sessionMinutes / 180),
    };
  }

  // Hyperfocus → Overload (hyperfocus can burn out)
  if (currentState === "hyperfocus" && sessionMinutes > 90) {
    return {
      nextState: "overload",
      timeToOnsetMinutes: Math.max(10, 120 - sessionMinutes),
      confidence: 0.7,
    };
  }

  // Rising stress → Overload
  if (stressIndex > 0.5 && stressIndex < 0.7) {
    const timeToOverload = Math.round((0.7 - stressIndex) / 0.1 * 10); // Rough estimate
    return {
      nextState: "overload",
      timeToOnsetMinutes: timeToOverload,
      confidence: 0.5 + stressIndex * 0.3,
    };
  }

  // Low budget → Fatigued
  if (cognitiveBudget < 0.4 && cognitiveBudget > 0.2) {
    return {
      nextState: "fatigued",
      timeToOnsetMinutes: Math.round(cognitiveBudget * 30),
      confidence: 0.6,
    };
  }

  // Distracted + Low focus → Could transition to recovery if they step away
  if (currentState === "distracted" && focusLevel < 0.3) {
    return {
      nextState: "recovery",
      timeToOnsetMinutes: 5, // If they take a break
      confidence: 0.4,
    };
  }

  return undefined;
}

// Aggregate raw signals into summary
export function aggregateSignals(
  rawSignals: Array<{ signal_type: string; value: number; created_at: string }>
): SignalAggregates {
  const aggregates: SignalAggregates = {
    keystrokeLatency: { mean: 0, variance: 0, count: 0 },
    scrollVelocity: { mean: 0, max: 0, directionChanges: 0 },
    mouseEntropy: { mean: 0, recent: 0 },
    clickHesitation: { mean: 0, recent: 0 },
    focusDuration: { total: 0, breaks: 0 },
    idleTime: { total: 0, periods: 0 },
    tabSwitches: 0,
    sessionDuration: 0,
  };

  const keystrokeLatencies: number[] = [];
  const scrollVelocities: number[] = [];
  const mouseEntropies: number[] = [];
  const clickHesitations: number[] = [];

  for (const signal of rawSignals) {
    switch (signal.signal_type) {
      case "keystroke_latency":
        keystrokeLatencies.push(signal.value);
        break;
      case "scroll_velocity":
        scrollVelocities.push(signal.value);
        break;
      case "mouse_entropy":
        mouseEntropies.push(signal.value);
        break;
      case "click_hesitation":
        clickHesitations.push(signal.value);
        break;
      case "focus_duration":
        aggregates.focusDuration.total += signal.value;
        break;
      case "idle_time":
        aggregates.idleTime.total += signal.value;
        aggregates.idleTime.periods += 1;
        break;
      case "tab_switches":
        aggregates.tabSwitches += signal.value;
        break;
    }
  }

  // Calculate keystroke stats
  if (keystrokeLatencies.length > 0) {
    const mean = keystrokeLatencies.reduce((a, b) => a + b, 0) / keystrokeLatencies.length;
    const variance = keystrokeLatencies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / keystrokeLatencies.length;
    aggregates.keystrokeLatency = { mean, variance, count: keystrokeLatencies.length };
  }

  // Calculate scroll stats
  if (scrollVelocities.length > 0) {
    aggregates.scrollVelocity.mean = scrollVelocities.reduce((a, b) => a + b, 0) / scrollVelocities.length;
    aggregates.scrollVelocity.max = Math.max(...scrollVelocities);
    // Count direction changes by looking at sign changes (simplified)
    aggregates.scrollVelocity.directionChanges = Math.floor(scrollVelocities.length / 5);
  }

  // Calculate mouse entropy
  if (mouseEntropies.length > 0) {
    aggregates.mouseEntropy.mean = mouseEntropies.reduce((a, b) => a + b, 0) / mouseEntropies.length;
    aggregates.mouseEntropy.recent = mouseEntropies[mouseEntropies.length - 1];
  }

  // Calculate click hesitation
  if (clickHesitations.length > 0) {
    aggregates.clickHesitation.mean = clickHesitations.reduce((a, b) => a + b, 0) / clickHesitations.length;
    aggregates.clickHesitation.recent = clickHesitations[clickHesitations.length - 1];
  }

  // Calculate session duration from first to last signal
  if (rawSignals.length > 0) {
    const times = rawSignals.map(s => new Date(s.created_at).getTime());
    aggregates.sessionDuration = Math.max(...times) - Math.min(...times);
  }

  return aggregates;
}
