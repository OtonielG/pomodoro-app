import ReturnIcon from "../assets/return-svgrepo-com.svg?react";
import PlayIcon from "../assets/play-svgrepo-com.svg?react";
import PauseIcon from "../assets/pause-svgrepo-com.svg?react";
import SkipIcon from "../assets/skip-next-svgrepo-com.svg?react";

import { useEffect, useRef, useState } from "react";

interface Time {
  minutes: number;
  seconds: number;
  label: TimesSet;
}

interface DefaultTimes {
  focus: Time;
  shortBreak: Time;
  longBreak: Time;
}

const initialTimers: DefaultTimes = {
  focus: { minutes: 25, seconds: 0, label: "focus" },
  shortBreak: { minutes: 5, seconds: 0, label: "shortBreak" },
  longBreak: { minutes: 15, seconds: 0, label: "longBreak" },
};

type TimesSet = "focus" | "shortBreak" | "longBreak";

export default function Timer() {
  const [timer, setTimer] = useState<Time>(initialTimers.focus);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const timerActive = useRef(timer);

  useEffect(() => {
    if (!isPlaying) return;

    const pomodoroTimer = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds === 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }

        if (prev.minutes === 0 && prev.seconds === 1) {
          setIsPlaying(false);
          setIsDisabled(true);
        }

        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 100);

    return () => clearInterval(pomodoroTimer);
  }, [isPlaying]);

  function handleTimerChange(id: TimesSet) {
    if (isDisabled) {
      setIsDisabled(false);
    }

    setTimer(initialTimers[id]);
    timerActive.current = initialTimers[id];
    setIsPlaying(false);
  }

  function resetTimer() {
    if (isDisabled) {
      setIsDisabled(false);
    }

    setTimer(timerActive.current);
    setIsPlaying(false);
  }

  function skipTimer() {
    if (timerActive.current.label !== "focus") {
      handleTimerChange("focus");
      return;
    }

    handleTimerChange("shortBreak");
  }

  const totalSeconds = timerActive.current.minutes * 60;
  const remainingSeconds = timer.minutes * 60 + timer.seconds;
  const elapsedSeconds = totalSeconds - remainingSeconds;
  const progressPercent =
    totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0;

  return (
    <section className="bg-teal-700 w-full p-8 flex flex-col justify-center items-center gap-6 rounded-xl">
      <div className="bg-teal-800/30 w-full rounded-full">
        <button
          onClick={() => handleTimerChange("focus")}
          className={`text-teal-50 w-1/3 h-full p-1 
          hover:font-semibold cursor-pointer rounded-full 
          ${timerActive.current.label === "focus" && "bg-teal-600"}`}
        >
          Focus
        </button>
        <button
          onClick={() => handleTimerChange("shortBreak")}
          className={`text-teal-50 w-1/3 h-full p-1 
          hover:font-semibold cursor-pointer rounded-full 
          ${timerActive.current.label === "shortBreak" && "bg-teal-600"}`}
        >
          Short Break
        </button>
        <button
          onClick={() => handleTimerChange("longBreak")}
          className={`text-teal-50 w-1/3 h-full p-1 
          hover:font-semibold cursor-pointer rounded-full 
          ${timerActive.current.label === "longBreak" && "bg-teal-600"}`}
        >
          Long Break
        </button>
      </div>
      <div className="text-8xl font-bold text-teal-100">
        <span>
          {timer.minutes.toString().padStart(2, "0")}:
          {timer.seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <button
          onClick={resetTimer}
          className="bg-teal-800/30 p-3 flex justify-center items-center hover:scale-110 transition-transform duration-300 hover:bg-teal-800/50 cursor-pointer rounded-full"
        >
          <ReturnIcon className="size-6 text-white" />
        </button>
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            disabled={isDisabled}
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
            onClick={() => setIsPlaying(false)}
            className="group w-24 h-24 bg-teal-800 flex justify-center items-center hover:bg-teal-900 rounded-full cursor-pointer"
          >
            <PauseIcon className="w-10 h-10 text-white transition-all duration-300 group-hover:w-8 group-hover:h-8" />
          </button>
        )}
        <button
          onClick={skipTimer}
          className="bg-teal-800/30 p-3 flex justify-center items-center hover:scale-110 transition-transform duration-300 hover:bg-teal-800/50 cursor-pointer rounded-full"
        >
          <SkipIcon className="size-6 text-white" />
        </button>
      </div>
      <div className="w-full h-3 bg-teal-950/40 rounded-full">
        <div
          className="h-full bg-teal-300 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
}
