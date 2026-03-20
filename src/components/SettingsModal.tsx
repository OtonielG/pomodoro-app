import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TimerMode } from "../hooks/useTimer";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentDurations: Record<TimerMode, number>;
  onSave: (durations: Record<TimerMode, number>) => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  currentDurations,
  onSave,
}: SettingsModalProps) {
  const [formValues, setFormValues] = useState<Record<TimerMode, number>>({
    focus: currentDurations.focus,
    shortBreak: currentDurations.shortBreak,
    longBreak: currentDurations.longBreak,
  });

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        focus: currentDurations.focus,
        shortBreak: currentDurations.shortBreak,
        longBreak: currentDurations.longBreak,
      });
    }
  }, [
    isOpen,
    currentDurations.focus,
    currentDurations.shortBreak,
    currentDurations.longBreak,
  ]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  function handleChange(mode: TimerMode, value: string) {
    setFormValues((prev) => ({
      ...prev,
      [mode]: Number(value),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { focus, shortBreak, longBreak } = formValues;

    if (focus < 1 || shortBreak < 1 || longBreak < 1) return;

    onSave(formValues);
    onClose();
  }

  const isFormInvalid =
    formValues.focus < 1 ||
    formValues.shortBreak < 1 ||
    formValues.longBreak < 1;

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      aria-hidden="true"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="w-full max-w-lg rounded-3xl bg-white/90 p-6 shadow-2xl ring-1 ring-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-6 flex items-center justify-between gap-4">
          <h2
            id="settings-modal-title"
            className="text-xl font-semibold text-teal-900"
          >
            Settings
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings modal"
            className="bg-teal-950 flex justify-center items-center size-10 rounded-full text-teal-100 font-bold cursor-pointer hover:bg-teal-800"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="focus-duration"
              className="mb-2 block text-sm font-medium text-teal-950"
            >
              Focus
            </label>
            <input
              id="focus-duration"
              type="number"
              min={1}
              value={formValues.focus}
              onChange={(event) => handleChange("focus", event.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-3 text-teal-950 outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="short-break-duration"
              className="mb-2 block text-sm font-medium text-teal-950"
            >
              Short Break
            </label>
            <input
              id="short-break-duration"
              type="number"
              min={1}
              value={formValues.shortBreak}
              onChange={(event) =>
                handleChange("shortBreak", event.target.value)
              }
              className="w-full rounded-xl border bg-white px-4 py-3 text-teal-950 outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="long-break-duration"
              className="mb-2 block text-sm font-medium text-teal-950"
            >
              Long Break
            </label>
            <input
              id="long-break-duration"
              type="number"
              min={1}
              value={formValues.longBreak}
              onChange={(event) =>
                handleChange("longBreak", event.target.value)
              }
              className="w-full rounded-xl border bg-white px-4 py-3 text-teal-950 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-teal-100 px-4 py-2 font-medium text-teal-900 hover:bg-teal-600 hover:text-teal-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isFormInvalid}
              className="rounded-xl bg-teal-800 px-4 py-2 font-medium text-white hover:bg-teal-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  );
}
