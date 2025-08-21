import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "../components/Settings";
import "@testing-library/jest-dom";

describe("Settings Component", () => {
  const defaultProps = {
    mode: "classic",
    setMode: vi.fn(),
    showClue: true,
    setShowClue: vi.fn(),
    setCurrentScreen: vi.fn(),
    soundVolume: 0.5,
    setSoundVolume: vi.fn(),
    setLives: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Settings heading and form elements correctly", () => {
    render(<Settings {...defaultProps} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Game Mode")).toBeInTheDocument();
    expect(screen.getByText("Clues")).toBeInTheDocument();
    expect(screen.getByText("Sound Volume (50%)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to Home" })).toBeInTheDocument();
  });

  it("displays correct game mode options and selected value", () => {
    render(<Settings {...defaultProps} />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("classic");
    expect(screen.getByText("Timed (5s)")).toBeInTheDocument();
    expect(screen.getByText("Classic (Untimed)")).toBeInTheDocument();
    expect(screen.getByText("Multiple Choice (5s)")).toBeInTheDocument();
    expect(screen.getByText("Survival (3 Lives)")).toBeInTheDocument();
  });

  it("updates game mode and resets lives for survival mode", () => {
    render(<Settings {...defaultProps} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "survival" } });
    expect(defaultProps.setMode).toHaveBeenCalledWith("survival");
    expect(defaultProps.setLives).toHaveBeenCalledWith(3);
  });

  it("updates game mode without resetting lives for non-survival mode", () => {
    render(<Settings {...defaultProps} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "timed" } });
    expect(defaultProps.setMode).toHaveBeenCalledWith("timed");
    expect(defaultProps.setLives).not.toHaveBeenCalled();
  });

  it("toggles clues state when clues button is clicked", () => {
    render(<Settings {...defaultProps} />);
    const cluesButton = screen.getByRole("button", { name: "Clues Enabled" });
    fireEvent.click(cluesButton);
    expect(defaultProps.setShowClue).toHaveBeenCalledWith(expect.any(Function));
    expect(defaultProps.setShowClue.mock.calls[0][0](true)).toBe(false);
  });

  it("updates sound volume when slider is changed", () => {
    render(<Settings {...defaultProps} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "0.75" } });
    expect(defaultProps.setSoundVolume).toHaveBeenCalledWith(0.75);
  });

  it("navigates to home when Back to Home button is clicked", () => {
    render(<Settings {...defaultProps} />);
    const backButton = screen.getByRole("button", { name: "Back to Home" });
    fireEvent.click(backButton);
    expect(defaultProps.setCurrentScreen).toHaveBeenCalledWith("home");
  });

  it("applies correct styles to form elements and buttons", () => {
    render(<Settings {...defaultProps} />);
    const select = screen.getByRole("combobox");
    const cluesButton = screen.getByRole("button", { name: "Clues Enabled" });
    const slider = screen.getByRole("slider");
    const backButton = screen.getByRole("button", { name: "Back to Home" });

    expect(select).toHaveClass(
      "rounded-2xl bg-slate-800 border border-white/10 px-4 py-3 text-slate-100 focus:ring-2 focus:ring-rose-500/60"
    );
    expect(cluesButton).toHaveClass(
      "rounded-2xl px-4 py-3 text-sm font-medium transition bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white"
    );
    expect(slider).toHaveClass(
      "w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
    );
    expect(backButton).toHaveClass(
      "rounded-2xl px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium shadow-lg shadow-rose-900/30 transition"
    );
  });

  it("toggles clues button text and styles when clues are disabled", () => {
    render(<Settings {...defaultProps} showClue={false} />);
    const cluesButton = screen.getByRole("button", { name: "Clues Disabled" });
    expect(cluesButton).toBeInTheDocument();
    expect(cluesButton).toHaveClass(
      "rounded-2xl px-4 py-3 text-sm font-medium transition bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600"
    );
  });

  it("displays correct sound volume percentage", () => {
    render(<Settings {...defaultProps} soundVolume={0.25} />);
    expect(screen.getByText("Sound Volume (25%)")).toBeInTheDocument();
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("0.25");
  });
});