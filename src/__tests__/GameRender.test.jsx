import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Game from "../components/Game";
import { useRounds } from "../hooks/useRounds";
import "@testing-library/jest-dom";

vi.mock("../utils/sound", () => ({
  playClickSound: vi.fn(),
  playRoundTransitionSound: vi.fn(),
  playWinSound: vi.fn(),
  playFailSound: vi.fn(),
}));

vi.mock("../hooks/useRounds", () => ({
  useRounds: vi.fn(),
}));

vi.mock("../components/HudTile", () => ({
  default: ({ label, value, pulse }) => (
    <div className={pulse ? "pulse" : ""}>{`${label}: ${value}`}</div>
  ),
}));

vi.mock("../components/ModeBadge", () => ({
  default: ({ mode }) => <div>{`Mode: ${mode}`}</div>,
}));

vi.mock("../components/Overlay", () => ({
  default: ({ show, kind, message, onClick }) =>
    show ? (
      <div onClick={onClick} data-testid="overlay">
        {`${kind}: ${message}`}
      </div>
    ) : null,
}));

describe("Game component rendering", () => {
  const defaultProps = {
    setCurrentScreen: vi.fn(),
    mode: "timed",
    setMode: vi.fn(),
    stats: { correct: 0, wrong: 0, streak: 0, rounds: 0 },
    setStats: vi.fn(),
    round: 0,
    setRound: vi.fn(),
    showClue: false,
    setShowClue: vi.fn(),
    countdown: 5,
    setCountdown: vi.fn(),
    soundVolume: 0.5,
    lives: 3,
    setLives: vi.fn(),
  };

  const mockRounds = [
    {
      image: "image1.jpg",
      answers: ["cat", "kitten"],
      clue: "This is a clue for cat",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useRounds.mockReturnValue(mockRounds);
    vi.spyOn(React, "useRef").mockReturnValue({ current: { focus: vi.fn() } });
  });

  it("renders header with title and mode switch button", () => {
    render(<Game {...defaultProps} />);
    expect(screen.getByText("Guess It!")).toBeInTheDocument();
    expect(screen.getByText("Guess the object in the image.")).toBeInTheDocument();
    expect(screen.getByText("Switch to Classic")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders HUD tiles with correct stats", () => {
    render(<Game {...defaultProps} />);
    expect(screen.getByText("Round: 1/1")).toBeInTheDocument();
    expect(screen.getByText("Streak: 0")).toBeInTheDocument();
    expect(screen.getByText("Correct: 0")).toBeInTheDocument();
    expect(screen.getByText("Timer: 5s")).toBeInTheDocument();
  });

  it("renders clue button when clue is hidden", () => {
    render(<Game {...defaultProps} showClue={false} />);
    expect(screen.getByText("Show clue")).toBeInTheDocument();
    expect(screen.queryByText("This is a clue for cat")).not.toBeInTheDocument();
  });

  it("renders clue text when showClue is true", () => {
    render(<Game {...defaultProps} showClue={true} />);
    expect(screen.getByText("Clue")).toBeInTheDocument();
    expect(screen.getByText("This is a clue for cat")).toBeInTheDocument();
  });

  it("renders input form in timed mode", () => {
    render(<Game {...defaultProps} mode="timed" />);
    expect(screen.getByPlaceholderText("Type your guess…")).toBeInTheDocument();
    expect(screen.getByText("Guess")).toBeInTheDocument();
  });

  it("renders footer buttons", () => {
    render(<Game {...defaultProps} />);
    expect(screen.getByText("Show Clue")).toBeInTheDocument();
    expect(screen.getByText("Skip ↦")).toBeInTheDocument();
    expect(screen.getByText("Reset Game")).toBeInTheDocument();
    expect(screen.getByText("View Results")).toBeInTheDocument();
  });

  it("navigates to results screen when view results button is clicked", () => {
    render(<Game {...defaultProps} />);
    const resultsButton = screen.getByText("View Results");
    fireEvent.click(resultsButton);
    expect(defaultProps.setCurrentScreen).toHaveBeenCalledWith("results");
  })})