import ReturnIcon from "../assets/return-svgrepo-com.svg?react";
import PlayIcon from "../assets/play-svgrepo-com.svg?react";
import PauseIcon from "../assets/pause-svgrepo-com.svg?react";
import SkipIcon from "../assets/skip-next-svgrepo-com.svg?react";
import SettingsIcon from "../assets/settings-gear-svgrepo-com.svg?react";

import { useEffect, useRef, useState } from "react";
import { useTimer, type TimerMode } from "../hooks/useTimer";
import { formatTime } from "../utils/formatTime";
import SettingsModal from "./SettingsModal";

const TIMER_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

function playSound(audioRef: React.RefObject<HTMLAudioElement | null>) {
  if (!audioRef.current) return;

  audioRef.current.currentTime = 0;
  audioRef.current.play().catch(() => {
    console.log("Audio blocked by browser");
  });
}

export default function Timer() {
  const {
    activeMode,
    timeLeft,
    isRunning,
    durations,
    handleModeChange,
    handleReset,
    handleSkip,
    handleToggle,
    updateDurations,
  } = useTimer();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  const totalTime = durations[activeMode];
  const progressPercentage =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const isFinished = timeLeft === 0;

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - DeepFocus`;
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      playSound(alarmSoundRef);
    }
  }, [timeLeft]);

  function handlePlayPause() {
    handleToggle();
    playSound(clickSoundRef);
  }

  return (
    <section className="w-[min(92vw,720px)] rounded-xl bg-teal-700 p-[clamp(1rem,2vw,2rem)] flex flex-col items-center justify-center gap-[clamp(1rem,2vw,1.5rem)]">
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 rounded-full bg-teal-800/30 p-1 flex items-center gap-1 overflow-hidden">
          {(Object.keys(TIMER_LABELS) as TimerMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`
                flex-1 min-w-0 rounded-full
                px-[clamp(0.4rem,1vw,0.75rem)] py-[clamp(0.45rem,1vw,0.7rem)]
                text-teal-50 text-center font-medium
                text-[clamp(0.65rem,1.2vw,1rem)]
                whitespace-nowrap transition-all duration-300
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

        <button
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open settings"
          className="group bg-teal-900/90 p-2.5 rounded-full hover:bg-teal-800 cursor-pointer shrink-0 ring-1 ring-white/10 transition-colors"
        >
          <SettingsIcon className="size-[clamp(1.1rem,2vw,1.5rem)] text-white transition-transform duration-300 group-hover:rotate-180" />
        </button>
      </div>

      <div className="font-bold text-teal-100 leading-none">
        <span className="text-[clamp(3rem,12vw,6rem)]">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-[clamp(0.75rem,2vw,1rem)]">
        <button
          aria-label="Reset timer"
          onClick={handleReset}
          className="rounded-full bg-teal-800/30 p-[clamp(0.65rem,1.4vw,1rem)] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 hover:bg-teal-800/50"
        >
          <ReturnIcon className="size-[clamp(1.1rem,2vw,1.75rem)] text-white" />
        </button>

        <button
          onClick={handlePlayPause}
          disabled={isFinished}
          aria-label="Start timer"
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
          aria-label="Skip session"
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentDurations={{
          focus: durations.focus / 60,
          shortBreak: durations.shortBreak / 60,
          longBreak: durations.longBreak / 60,
        }}
        onSave={updateDurations}
      />
    </section>
  );
}
