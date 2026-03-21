import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timer from "../Timer";
import { useTimer } from "../../hooks/useTimer";
import { formatTime } from "../../utils/formatTime";

vi.mock("../../hooks/useTimer", () => ({
  useTimer: vi.fn(),
}));

vi.mock("../../utils/formatTime", () => ({
  formatTime: vi.fn(),
}));

vi.mock("../SettingsModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Settings Modal</div> : null,
}));

vi.mock("../../assets/return-svgrepo-com.svg?react", () => ({
  default: () => <svg data-testid="return-icon" />,
}));

vi.mock("../../assets/play-svgrepo-com.svg?react", () => ({
  default: () => <svg data-testid="play-icon" />,
}));

vi.mock("../../assets/pause-svgrepo-com.svg?react", () => ({
  default: () => <svg data-testid="pause-icon" />,
}));

vi.mock("../../assets/skip-next-svgrepo-com.svg?react", () => ({
  default: () => <svg data-testid="skip-icon" />,
}));

vi.mock("../../assets/settings-gear-svgrepo-com.svg?react", () => ({
  default: () => <svg data-testid="settings-icon" />,
}));

Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
  configurable: true,
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

describe("Timer", () => {
  const mockHandleModeChange = vi.fn();
  const mockHandleReset = vi.fn();
  const mockHandleSkip = vi.fn();
  const mockHandleToggle = vi.fn();
  const mockUpdateDurations = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTimer).mockReturnValue({
      activeMode: "focus",
      timeLeft: 1500,
      isRunning: false,
      durations: {
        focus: 1500,
        shortBreak: 300,
        longBreak: 900,
      },
      handleModeChange: mockHandleModeChange,
      handleReset: mockHandleReset,
      handleSkip: mockHandleSkip,
      handleToggle: mockHandleToggle,
      updateDurations: mockUpdateDurations,
    });

    vi.mocked(formatTime).mockReturnValue("25:00");
  });

  it("renders the current timer value and main controls", () => {
    render(<Timer />);

    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open settings/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("play-icon")).toBeInTheDocument();
    expect(screen.getByTestId("return-icon")).toBeInTheDocument();
    expect(screen.getByTestId("skip-icon")).toBeInTheDocument();
  });

  it("renders the available timer modes", () => {
    render(<Timer />);

    expect(screen.getByRole("button", { name: /focus/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /short/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /long/i })).toBeInTheDocument();
  });

  it("updates the document title with the formatted time", () => {
    render(<Timer />);

    expect(formatTime).toHaveBeenCalledWith(1500);
    expect(document.title).toBe("25:00 - DeepFocus");
  });

  it("calls handleToggle when play button is clicked", async () => {
    const user = userEvent.setup();

    render(<Timer />);

    const playButton = screen.getByRole("button", { name: /start timer/i });
    await user.click(playButton);

    expect(mockHandleToggle).toHaveBeenCalledTimes(1);
  });

  it("calls handleReset when reset button is clicked", async () => {
    const user = userEvent.setup();

    render(<Timer />);

    const resetButton = screen.getByRole("button", { name: /reset timer/i });
    await user.click(resetButton);

    expect(mockHandleReset).toHaveBeenCalledTimes(1);
  });

  it("calls handleSkip when skip button is clicked", async () => {
    const user = userEvent.setup();

    render(<Timer />);

    const skipButton = screen.getByRole("button", { name: /skip session/i });
    await user.click(skipButton);

    expect(mockHandleSkip).toHaveBeenCalledTimes(1);
  });

  it('calls handleModeChange with "shortBreak" when short break button is clicked', async () => {
    const user = userEvent.setup();

    render(<Timer />);

    const shortBreakButton = screen.getByRole("button", { name: /short/i });
    await user.click(shortBreakButton);

    expect(mockHandleModeChange).toHaveBeenCalledTimes(1);
    expect(mockHandleModeChange).toHaveBeenCalledWith("shortBreak");
  });

  it('calls handleModeChange with "focus" when focus button is clicked', async () => {
    const user = userEvent.setup();

    render(<Timer />);

    const focusButton = screen.getByRole("button", { name: /focus/i });
    await user.click(focusButton);

    expect(mockHandleModeChange).toHaveBeenCalledWith("focus");
  });

  it('calls handleModeChange with "longBreak" when long break button is clicked', async () => {
    const user = userEvent.setup();

    render(<Timer />);

    const longBreakButton = screen.getByRole("button", { name: /long/i });
    await user.click(longBreakButton);

    expect(mockHandleModeChange).toHaveBeenCalledWith("longBreak");
  });

  it("opens settings modal when settings button is clicked", async () => {
    const user = userEvent.setup();

    render(<Timer />);

    expect(screen.queryByText("Settings Modal")).not.toBeInTheDocument();

    const settingsButton = screen.getByRole("button", {
      name: /open settings/i,
    });

    await user.click(settingsButton);

    expect(screen.getByText("Settings Modal")).toBeInTheDocument();
  });
});
