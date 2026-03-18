import SettingsIcon from "../assets/settings-gear-svgrepo-com.svg?react";
import TimerIcon from "../assets/time-quarter-to-svgrepo-com.svg?react";

export default function Header() {
  return (
    <header className="w-full md:w-1/2 lg:w-2/5 px-8 flex justify-between">
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl font-bold text-teal-50">DeepFocus</h1>
        <TimerIcon className="size-8 text-teal-50" />
      </div>

      <button className="group bg-teal-800 p-3 rounded-full flex justify-center items-center hover:scale-115 transition-transform duration-300 cursor-pointer">
        <SettingsIcon className="size-6 text-teal-50 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-120" />
      </button>
    </header>
  );
}
