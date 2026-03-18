import ReturnIcon from "../assets/return-svgrepo-com.svg?react";
import PlayIcon from "../assets/play-svgrepo-com.svg?react";
import PauseIcon from "../assets/pause-svgrepo-com.svg?react";
import SkipIcon from "../assets/skip-next-svgrepo-com.svg?react";

import { useEffect, useState } from "react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const TIMER_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export default function Timer() {
  const [activeMode, setActiveMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);

  const totalTime = TIMER_DURATIONS[activeMode];
  const progressPercentage =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const isFinished = timeLeft === 0;

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const intervalId = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(intervalId);
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

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <section className="bg-teal-700 w-full p-8 flex flex-col justify-center items-center gap-6 rounded-xl">
      <div className="bg-teal-800/30 w-full rounded-full flex">
        {(Object.keys(TIMER_LABELS) as TimerMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`text-teal-50 w-1/3 h-full p-1 hover:font-semibold cursor-pointer rounded-full ${
              activeMode === mode ? "bg-teal-600" : ""
            }`}
          >
            {TIMER_LABELS[mode]}
          </button>
        ))}
      </div>

      <div className="text-8xl font-bold text-teal-100">
        <span>{formatTime(timeLeft)}</span>
      </div>

      <div className="flex gap-4 justify-center items-center">
        <button
          onClick={handleReset}
          className="bg-teal-800/30 p-3 flex justify-center items-center hover:scale-110 transition-transform duration-300 hover:bg-teal-800/50 cursor-pointer rounded-full"
        >
          <ReturnIcon className="size-6 text-white" />
        </button>

        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            disabled={isFinished}
            className="
              group w-24 h-24 bg-teal-800 flex justify-center items-center
              hover:bg-teal-900 rounded-full cursor-pointer transition-colors
              disabled:bg-teal-900/50 disabled:cursor-not-allowed disabled:pointer-events-none
            "
          >
            <PlayIcon
              className="
                w-10 h-10 text-white transition-all duration-300
                group-hover:w-8 group-hover:h-8
                group-disabled:text-white/50
              "
            />
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="group w-24 h-24 bg-teal-800 flex justify-center items-center hover:bg-teal-900 rounded-full cursor-pointer"
          >
            <PauseIcon className="w-10 h-10 text-white transition-all duration-300 group-hover:w-8 group-hover:h-8" />
          </button>
        )}

        <button
          onClick={handleSkip}
          className="bg-teal-800/30 p-3 flex justify-center items-center hover:scale-110 transition-transform duration-300 hover:bg-teal-800/50 cursor-pointer rounded-full"
        >
          <SkipIcon className="size-6 text-white" />
        </button>
      </div>

      <div className="w-full h-3 bg-teal-950/40 rounded-full">
        <div
          className="h-full bg-teal-300 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </section>
  );
}
