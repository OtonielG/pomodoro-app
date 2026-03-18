import { useEffect, useState } from "react";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function useTimer(initialMode: TimerMode = "focus") {
  const [activeMode, setActiveMode] = useState<TimerMode>(initialMode);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS[initialMode]);
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
    setTimeLeft(TIMER_DURATIONS[mode]);
    setIsRunning(false);
  }

  function handleReset() {
    setTimeLeft(TIMER_DURATIONS[activeMode]);
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

  return {
    activeMode,
    timeLeft,
    isRunning,
    setIsRunning,
    handleModeChange,
    handleReset,
    handleSkip,
    handleToggle,
  };
}
