import { useState, useEffect, useCallback, useRef } from "react";
import { ScenarioType, scenarios, Scenario } from "@/lib/scenarioData";
import { 
  getEventStore, 
  DemoEvent, 
  EventType, 
  eventTypeLabels,
  eventTypeIcons 
} from "@/lib/eventStore";
import { 
  deriveState, 
  DerivedState, 
  executePackAction,
  simulateTimePassing 
} from "@/lib/stateReducer";

export interface SimulatorState {
  scenario: ScenarioType;
  scenarioData: Scenario;
  derivedState: DerivedState;
  recentEvents: DemoEvent[];
  isPlaying: boolean;
  speed: 1 | 2 | 4;
}

export function useScenarioSimulator(initialScenario: ScenarioType = "service") {
  const [scenario, setScenario] = useState<ScenarioType>(initialScenario);
  const [derivedState, setDerivedState] = useState<DerivedState>(() => 
    deriveState([], initialScenario)
  );
  const [recentEvents, setRecentEvents] = useState<DemoEvent[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  
  const eventStore = getEventStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to event store
  useEffect(() => {
    const unsubscribe = eventStore.subscribe((event) => {
      if (event.scenario === scenario) {
        setRecentEvents(eventStore.getRecentEvents(10, scenario));
        setDerivedState(deriveState(eventStore.getEvents(scenario), scenario));
      }
    });

    return unsubscribe;
  }, [scenario]);

  // Load scenario events on change
  useEffect(() => {
    eventStore.clear();
    eventStore.loadScenarioEvents(scenario);
    setRecentEvents(eventStore.getRecentEvents(10, scenario));
    setDerivedState(deriveState(eventStore.getEvents(scenario), scenario));
  }, [scenario]);

  // Simulation loop
  useEffect(() => {
    if (isPlaying) {
      const baseInterval = 5000; // 5 seconds = 1 simulated minute
      const interval = baseInterval / speed;

      intervalRef.current = setInterval(() => {
        const newEvents = simulateTimePassing(scenario, speed);
        newEvents.forEach((event) => {
          eventStore.push(event);
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, scenario]);

  const changeScenario = useCallback((newScenario: ScenarioType) => {
    setScenario(newScenario);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setPlaybackSpeed = useCallback((newSpeed: 1 | 2 | 4) => {
    setSpeed(newSpeed);
  }, []);

  const injectEvent = useCallback((type: EventType, refId: string, data?: Record<string, any>) => {
    eventStore.push({
      type,
      refId,
      scenario,
      data,
    });
  }, [scenario]);

  const enablePack = useCallback((packId: string) => {
    // First inject the pack enabled event
    eventStore.push({
      type: "pack.enabled",
      refId: packId,
      scenario,
      data: { packId },
    });

    // Then execute pack actions after a short delay
    setTimeout(() => {
      const packEvents = executePackAction(packId, scenario);
      packEvents.forEach((event) => {
        eventStore.push({
          type: event.type,
          refId: event.refId,
          scenario,
          data: event.data,
        });
      });
    }, 1500);
  }, [scenario]);

  const disablePack = useCallback((packId: string) => {
    eventStore.push({
      type: "pack.disabled",
      refId: packId,
      scenario,
      data: { packId },
    });
  }, [scenario]);

  const getEventLabel = useCallback((type: EventType) => {
    return eventTypeLabels[type] || type;
  }, []);

  const getEventIcon = useCallback((type: EventType) => {
    return eventTypeIcons[type] || "📌";
  }, []);

  return {
    scenario,
    scenarioData: scenarios[scenario],
    derivedState,
    recentEvents,
    isPlaying,
    speed,
    changeScenario,
    togglePlay,
    setPlaybackSpeed,
    injectEvent,
    enablePack,
    disablePack,
    getEventLabel,
    getEventIcon,
  };
}
