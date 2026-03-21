import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsModal from "../SettingsModal";

describe("SettingsModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: () => {},
    onSave: () => {},
    currentDurations: {
      focus: 25,
      shortBreak: 5,
      longBreak: 15,
    },
  };

  it("does not render when closed", () => {
    render(<SettingsModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    render(<SettingsModal {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SettingsModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByLabelText(/close settings modal/i));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SettingsModal {...defaultProps} onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking outside the modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SettingsModal {...defaultProps} onClose={onClose} />);

    const dialog = screen.getByRole("dialog");
    const backdrop = dialog.parentElement;

    expect(backdrop).toBeInTheDocument();

    await user.click(backdrop!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<SettingsModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("disables save button and does not save when one field is 0", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<SettingsModal {...defaultProps} onSave={onSave} />);

    const focusInput = screen.getByLabelText(/focus/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.clear(focusInput);
    await user.type(focusInput, "0");

    expect(saveButton).toBeDisabled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave with the updated values", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<SettingsModal {...defaultProps} onSave={onSave} />);

    const focusInput = screen.getByLabelText(/focus/i);
    const shortBreakInput = screen.getByLabelText(/short break/i);
    const longBreakInput = screen.getByLabelText(/long break/i);

    await user.clear(focusInput);
    await user.type(focusInput, "30");

    await user.clear(shortBreakInput);
    await user.type(shortBreakInput, "10");

    await user.clear(longBreakInput);
    await user.type(longBreakInput, "20");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      focus: 30,
      shortBreak: 10,
      longBreak: 20,
    });
  });

  it("calls onClose after saving", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <SettingsModal {...defaultProps} onSave={onSave} onClose={onClose} />,
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
