// Results.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Results from "../components/Results";
import "@testing-library/jest-dom";

// Mock HudTile component to match actual rendering
vi.mock("../components/HudTile", () => ({
  default: ({ label, value }) => (
    <div data-testid="hud-tile">
      <div className="text-sm uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  ),
}));

// Mock achievements module
vi.mock("../components/achievements", () => ({
  loadAchievements: () => ({
    ach1: { unlocked: "2025-08-20T12:00:00Z" },
    ach2: null,
  }),
  ACHIEVEMENTS: [
    {
      id: "ach1",
      name: "First Win",
      description: "Win your first game",
    },
    {
      id: "ach2",
      name: "High Score",
      description: "Achieve a high score",
    },
  ],
}));

describe("Results Component", () => {
  const defaultProps = {
    stats: { correct: 5, wrong: 2, streak: 3, rounds: 10 },
    setStats: vi.fn(),
    setRound: vi.fn(),
    setCurrentScreen: vi.fn(),
    mode: "classic",
    lives: 3,
    setLives: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Results heading and stats correctly", () => {
    render(<Results {...defaultProps} />);
    expect(screen.getByText("Results")).toBeInTheDocument();
    expect(screen.getByText("Rounds Played")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Wrong")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Longest Streak")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays Lives Remaining in survival mode", () => {
    render(<Results {...defaultProps} mode="survival" />);
    expect(screen.getByText("Lives Remaining")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("Longest Streak")).not.toBeInTheDocument();
  });

  it("renders achievements with correct styles and unlock status", () => {
    render(<Results {...defaultProps} />);
    const achievement1 = screen.getByText("First Win");
    const achievement2 = screen.getByText("High Score");

    expect(achievement1).toBeInTheDocument();
    expect(achievement1.closest("div")).toHaveClass(
      "p-4 rounded-2xl border bg-emerald-600/20 border-emerald-500/40"
    );
    expect(screen.getByText(/Unlocked on/)).toBeInTheDocument();

    expect(achievement2).toBeInTheDocument();
    expect(achievement2.closest("div")).toHaveClass(
      "p-4 rounded-2xl border bg-slate-800/60 border-white/10"
    );
    expect(screen.getByText("Not unlocked yet")).toBeInTheDocument();
  });

  it("triggers Play Again button with correct state updates", () => {
    render(<Results {...defaultProps} />);
    const playAgainButton = screen.getByRole("button", { name: "Play Again" });
    fireEvent.click(playAgainButton);

    expect(defaultProps.setStats).toHaveBeenCalledWith({
      correct: 0,
      wrong: 0,
      streak: 0,
      rounds: 0,
    });
    expect(defaultProps.setRound).toHaveBeenCalledWith(0);
    expect(defaultProps.setLives).toHaveBeenCalledWith(3);
    expect(defaultProps.setCurrentScreen).toHaveBeenCalledWith("game");
  });

  it("triggers Back to Home button with correct navigation", () => {
    render(<Results {...defaultProps} />);
    const backButton = screen.getByRole("button", { name: "Back to Home" });
    fireEvent.click(backButton);

    expect(defaultProps.setCurrentScreen).toHaveBeenCalledWith("home");
  });

  it("applies correct Tailwind classes to buttons", () => {
    render(<Results {...defaultProps} />);
    const playAgainButton = screen.getByRole("button", { name: "Play Again" });
    const backButton = screen.getByRole("button", { name: "Back to Home" });

    expect(playAgainButton).toHaveClass(
      "rounded-2xl px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium shadow-lg shadow-rose-900/30 transition"
    );
    expect(backButton).toHaveClass(
      "rounded-2xl px-6 py-3 bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition"
    );
  });
});