import { useEffect, useState } from "react";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export type TimerDurations = Record<TimerMode, number>;

const DEFAULT_TIMER_DURATIONS: TimerDurations = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const TIMER_STORAGE_KEY = "deepfocus-timer-state";

type StoredTimerState = {
  durations: TimerDurations;
  activeMode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  lastUpdatedAt: number | null;
};

function getInitialState(initialMode: TimerMode): StoredTimerState {
  const defaultState: StoredTimerState = {
    durations: DEFAULT_TIMER_DURATIONS,
    activeMode: initialMode,
    timeLeft: DEFAULT_TIMER_DURATIONS[initialMode],
    isRunning: false,
    lastUpdatedAt: null,
  };

  try {
    const savedState = localStorage.getItem(TIMER_STORAGE_KEY);

    if (!savedState) return defaultState;

    const parsedState: StoredTimerState = JSON.parse(savedState);

    const safeDurations =
      parsedState.durations &&
      typeof parsedState.durations.focus === "number" &&
      typeof parsedState.durations.shortBreak === "number" &&
      typeof parsedState.durations.longBreak === "number"
        ? parsedState.durations
        : DEFAULT_TIMER_DURATIONS;

    const safeActiveMode: TimerMode =
      parsedState.activeMode === "focus" ||
      parsedState.activeMode === "shortBreak" ||
      parsedState.activeMode === "longBreak"
        ? parsedState.activeMode
        : initialMode;

    let safeTimeLeft =
      typeof parsedState.timeLeft === "number"
        ? parsedState.timeLeft
        : safeDurations[safeActiveMode];

    let safeIsRunning =
      typeof parsedState.isRunning === "boolean"
        ? parsedState.isRunning
        : false;

    const safeLastUpdatedAt =
      typeof parsedState.lastUpdatedAt === "number"
        ? parsedState.lastUpdatedAt
        : null;

    if (safeIsRunning && safeLastUpdatedAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() - safeLastUpdatedAt) / 1000,
      );

      safeTimeLeft = Math.max(safeTimeLeft - elapsedSeconds, 0);

      if (safeTimeLeft === 0) {
        safeIsRunning = false;
      }
    }

    return {
      durations: safeDurations,
      activeMode: safeActiveMode,
      timeLeft: safeTimeLeft,
      isRunning: safeIsRunning,
      lastUpdatedAt: safeIsRunning ? Date.now() : null,
    };
  } catch {
    return defaultState;
  }
}

export function useTimer(initialMode: TimerMode = "focus") {
  const [state, setState] = useState<StoredTimerState>(() =>
    getInitialState(initialMode),
  );

  const { durations, activeMode, timeLeft, isRunning } = state;

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const intervalId = window.setInterval(() => {
      setState((previousState) => {
        if (previousState.timeLeft <= 1) {
          return {
            ...previousState,
            timeLeft: 0,
            isRunning: false,
            lastUpdatedAt: null,
          };
        }

        return {
          ...previousState,
          timeLeft: previousState.timeLeft - 1,
          lastUpdatedAt: Date.now(),
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function handleModeChange(mode: TimerMode) {
    setState((previousState) => ({
      ...previousState,
      activeMode: mode,
      timeLeft: previousState.durations[mode],
      isRunning: false,
      lastUpdatedAt: null,
    }));
  }

  function handleReset() {
    setState((previousState) => ({
      ...previousState,
      timeLeft: previousState.durations[previousState.activeMode],
      isRunning: false,
      lastUpdatedAt: null,
    }));
  }

  function handleSkip() {
    const nextMode = activeMode === "focus" ? "shortBreak" : "focus";

    setState((previousState) => ({
      ...previousState,
      activeMode: nextMode,
      timeLeft: previousState.durations[nextMode],
      isRunning: false,
      lastUpdatedAt: null,
    }));
  }

  function handleToggle() {
    setState((previousState) => {
      if (previousState.timeLeft === 0) return previousState;

      const nextIsRunning = !previousState.isRunning;

      return {
        ...previousState,
        isRunning: nextIsRunning,
        lastUpdatedAt: nextIsRunning ? Date.now() : null,
      };
    });
  }

  function updateDurations(newDurationsInMinutes: Record<TimerMode, number>) {
    const newDurationsInSeconds: TimerDurations = {
      focus: newDurationsInMinutes.focus * 60,
      shortBreak: newDurationsInMinutes.shortBreak * 60,
      longBreak: newDurationsInMinutes.longBreak * 60,
    };

    setState((previousState) => ({
      ...previousState,
      durations: newDurationsInSeconds,
      timeLeft: newDurationsInSeconds[previousState.activeMode],
      isRunning: false,
      lastUpdatedAt: null,
    }));
  }

  return {
    activeMode,
    timeLeft,
    isRunning,
    durations,
    handleModeChange,
    handleReset,
    handleSkip,
    handleToggle,
    updateDurations,
  };
}
