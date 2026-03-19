import TimerIcon from "../assets/time-quarter-to-svgrepo-com.svg?react";

export default function Header() {
  return (
    <header className="w-full flex justify-center items-center gap-2">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-50">
        DeepFocus
      </h1>
      <TimerIcon className="size-6 sm:size-7 md:size-8 lg:size-9 text-teal-50" />
    </header>
  );
}
