import { useEffect, useState } from "react";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export type TimerDurations = Record<TimerMode, number>;

const DEFAULT_TIMER_DURATIONS: TimerDurations = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function useTimer(initialMode: TimerMode = "focus") {
  const [durations, setDurations] = useState<TimerDurations>(
    DEFAULT_TIMER_DURATIONS,
  );
  const [activeMode, setActiveMode] = useState<TimerMode>(initialMode);
  const [timeLeft, setTimeLeft] = useState(
    DEFAULT_TIMER_DURATIONS[initialMode],
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const intervalId = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsRunning(false);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  function handleModeChange(mode: TimerMode) {
    setActiveMode(mode);
    setTimeLeft(durations[mode]);
    setIsRunning(false);
  }

  function handleReset() {
    setTimeLeft(durations[activeMode]);
    setIsRunning(false);
  }

  function handleSkip() {
    const nextMode = activeMode === "focus" ? "shortBreak" : "focus";
    handleModeChange(nextMode);
  }

  function handleToggle() {
    if (timeLeft === 0) return;
    setIsRunning((prev) => !prev);
  }

  function updateDurations(newDurationsInMinutes: Record<TimerMode, number>) {
    const newDurationsInSeconds: TimerDurations = {
      focus: newDurationsInMinutes.focus * 60,
      shortBreak: newDurationsInMinutes.shortBreak * 60,
      longBreak: newDurationsInMinutes.longBreak * 60,
    };

    setDurations(newDurationsInSeconds);
    setTimeLeft(newDurationsInSeconds[activeMode]);
    setIsRunning(false);
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
