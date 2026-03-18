import SettingsIcon from "../assets/settings-gear-svgrepo-com.svg?react";
import TimerIcon from "../assets/time-quarter-to-svgrepo-com.svg?react";

export default function Header() {
  return (
    <header className="w-full md:w-1/2 lg:w-2/5 px-4 sm:px-6 md:px-8 flex justify-between items-center">
      <div className="flex gap-2 sm:gap-3 items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-50">
          DeepFocus
        </h1>
        <TimerIcon className="size-6 sm:size-7 md:size-8 lg:size-9 text-teal-50" />
      </div>

      <button className="group bg-teal-800 p-2.5 sm:p-3 md:p-3.5 rounded-full flex justify-center items-center hover:scale-110 transition-transform duration-300 cursor-pointer">
        <SettingsIcon className="size-5 sm:size-6 md:size-7 text-teal-50 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" />
      </button>
    </header>
  );
}
