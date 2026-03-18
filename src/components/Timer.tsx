import ReturnIcon from "../assets/return-svgrepo-com.svg?react";
import PlayIcon from "../assets/play-svgrepo-com.svg?react";
import PauseIcon from "../assets/pause-svgrepo-com.svg?react";
import SkipIcon from "../assets/skip-next-svgrepo-com.svg?react";

import { useEffect, useState, useRef } from "react";

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

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function playSound(audioRef: React.RefObject<HTMLAudioElement | null>) {
  if (!audioRef.current) return;

  audioRef.current.currentTime = 0;
  audioRef.current.play().catch(() => {
    console.log("Audio blocked by browser");
  });
}

export default function Timer() {
  const [activeMode, setActiveMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);

  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

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
          playSound(alarmSoundRef);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - DeepFocus`;
  }, [timeLeft]);

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

  return (
    <section className="w-[min(92vw,720px)] rounded-xl bg-teal-700 p-[clamp(1rem,2vw,2rem)] flex flex-col items-center justify-center gap-[clamp(1rem,2vw,1.5rem)]">
      <div className="w-full rounded-full bg-teal-800/30 p-1 flex items-center gap-1 overflow-hidden">
        {(Object.keys(TIMER_LABELS) as TimerMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`
              flex-1 min-w-0 rounded-full
              px-[clamp(0.4rem,1vw,0.75rem)] py-[clamp(0.45rem,1vw,0.7rem)]
              text-teal-50 text-center font-medium
              text-[clamp(0.65rem,1.2vw,1rem)]
              whitespace-nowrap
              transition-all
              duration-300
              hover:font-bold cursor-pointer
              ${activeMode === mode ? "bg-teal-600" : ""}
            `}
          >
            {mode === "focus" && "Focus"}

            {mode === "shortBreak" && (
              <>
                <span className="sm:hidden">Short</span>
                <span className="hidden sm:inline">Short Break</span>
              </>
            )}

            {mode === "longBreak" && (
              <>
                <span className="sm:hidden">Long</span>
                <span className="hidden sm:inline">Long Break</span>
              </>
            )}
          </button>
        ))}
      </div>

      <div className="font-bold text-teal-100 leading-none">
        <span className="text-[clamp(3rem,12vw,6rem)]">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-[clamp(0.75rem,2vw,1rem)]">
        <button
          onClick={handleReset}
          className="rounded-full bg-teal-800/30 p-[clamp(0.65rem,1.4vw,1rem)] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:bg-teal-800/50"
        >
          <ReturnIcon className="size-[clamp(1.1rem,2vw,1.75rem)] text-white" />
        </button>

        <button
          onClick={() => {
            setIsRunning((prev) => !prev);
            playSound(clickSoundRef);
          }}
          disabled={isFinished}
          className="
            group flex items-center justify-center
            w-[clamp(5rem,10vw,7rem)] h-[clamp(5rem,10vw,7rem)]
            rounded-full bg-teal-800
            cursor-pointer transition-colors
            hover:bg-teal-900
            disabled:bg-teal-900/50 disabled:cursor-not-allowed disabled:pointer-events-none
          "
        >
          {isRunning ? (
            <PauseIcon className="w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)] text-white transition-all duration-300 group-hover:scale-90" />
          ) : (
            <PlayIcon
              className="
                w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)]
                text-white transition-all duration-300
                group-hover:scale-90
                group-disabled:text-white/50
              "
            />
          )}
        </button>

        <button
          onClick={handleSkip}
          className="rounded-full bg-teal-800/30 p-[clamp(0.65rem,1.4vw,1rem)] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:bg-teal-800/50"
        >
          <SkipIcon className="size-[clamp(1.1rem,2vw,1.75rem)] text-white" />
        </button>
      </div>

      <div className="w-full h-[clamp(0.6rem,1vw,0.75rem)] rounded-full bg-teal-950/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-300 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <audio ref={clickSoundRef} src="/sounds/click-sound.mp3" preload="auto" />
      <audio ref={alarmSoundRef} src="/sounds/alarm-sound.mp3" preload="auto" />
    </section>
  );
}
