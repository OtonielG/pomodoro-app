import { renderHook, act } from "@testing-library/react";
import { useTimer } from "./useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with default focus mode", () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.activeMode).toBe("focus");
    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.isRunning).toBe(false);
  });

  it("toggles isRunning when handleToggle is called", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.handleToggle();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.handleToggle();
    });

    expect(result.current.isRunning).toBe(false);
  });

  it("changes mode and resets time when handleModeChange is called", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.handleModeChange("shortBreak");
    });

    expect(result.current.activeMode).toBe("shortBreak");
    expect(result.current.timeLeft).toBe(300);
    expect(result.current.isRunning).toBe(false);
  });

  it("resets time and stops timer", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.handleToggle();
    });

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.isRunning).toBe(false);
  });

  it("skips to next mode and resets time", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.handleSkip();
    });

    expect(result.current.activeMode).toBe("shortBreak");
    expect(result.current.timeLeft).toBe(300);
    expect(result.current.isRunning).toBe(false);
  });

  it("updates durations and resets current time", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.updateDurations({
        focus: 30,
        shortBreak: 10,
        longBreak: 20,
      });
    });

    expect(result.current.durations.focus).toBe(1800);
    expect(result.current.timeLeft).toBe(1800);
    expect(result.current.isRunning).toBe(false);
  });
});
