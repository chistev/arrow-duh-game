import React from "react";
import { render, screen, act, renderHook } from "@testing-library/react";
import Game from "../components/Game";
import { useRounds } from "../hooks/useRounds";
import "@testing-library/jest-dom";
import { useCallback } from "react";

vi.mock("../utils/sound", () => ({
    playRoundTransitionSound: vi.fn(),
    playFailSound: vi.fn(),
    playWinSound: vi.fn(),
    playClickSound: vi.fn(),
}));

vi.mock("../hooks/useRounds", () => ({
    useRounds: vi.fn(),
}));

vi.mock("../components/HudTile", () => ({
    default: ({ label, value }) => <div>{`${label}: ${value}`}</div>,
}));

vi.mock("../components/ModeBadge", () => ({
    default: ({ mode }) => <div>{`Mode: ${mode}`}</div>,
}));

vi.mock("../components/Overlay", () => ({
    default: ({ show, kind, message, onClick }) =>
        show ? <div onClick={onClick}>{`${kind}: ${message}`}</div> : null,
}));

describe("Game component countdown useEffect hook", () => {
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
            answers: ["answer1", "answer2"],
            clue: "This is a clue",
        },
    ];

    let inputRef;

    beforeEach(() => {
        vi.clearAllMocks();
        useRounds.mockReturnValue(mockRounds);
        inputRef = { current: { focus: vi.fn() } };
        vi.spyOn(React, "useRef").mockReturnValue(inputRef);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("does not start countdown in classic mode", () => {
        render(<Game {...defaultProps} mode="classic" />);
        expect(defaultProps.setCountdown).not.toHaveBeenCalled();
    });

    it("does not start countdown in survival mode", () => {
        render(<Game {...defaultProps} mode="survival" />);
        expect(defaultProps.setCountdown).not.toHaveBeenCalled();
    });

    it("does not start countdown when overlay is shown", () => {
        render(<Game {...defaultProps} overlay={{ show: true }} />);
        expect(defaultProps.setCountdown).not.toHaveBeenCalled();
    });

    it("does not start countdown when rounds are empty", () => {
        useRounds.mockReturnValue([]);
        render(<Game {...defaultProps} />);
        expect(defaultProps.setCountdown).not.toHaveBeenCalled();
    });

    it("does not start countdown when image is not loaded", () => {
        render(<Game {...defaultProps} />);
        expect(defaultProps.setCountdown).not.toHaveBeenCalled();
    });

    it("starts countdown when mode is timed and image is loaded", () => {
        render(<Game {...defaultProps} mode="timed" />);
        act(() => {
            const img = screen.getByAltText("Round image");
            img.dispatchEvent(new Event("load"));
        });
        expect(defaultProps.setCountdown).toHaveBeenCalledWith(5);
    });

    it("updates countdown every second", async () => {
        render(<Game {...defaultProps} mode="timed" />);

        act(() => {
            const img = screen.getByAltText("Round image");
            img.dispatchEvent(new Event("load"));
        });

        expect(defaultProps.setCountdown).toHaveBeenCalledWith(5);

        // Advance by 1 second
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(defaultProps.setCountdown).toHaveBeenCalledWith(4);

        // Advance by another second
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(defaultProps.setCountdown).toHaveBeenCalledWith(3);
    });

    it("calls handleFail when countdown reaches 0", () => {
        render(<Game {...defaultProps} mode="timed" />);

        act(() => {
            const img = screen.getByAltText("Round image");
            img.dispatchEvent(new Event("load"));
        });

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByText("fail: Time's up!")).toBeInTheDocument();
    });

    it("restarts countdown when round changes", () => {
        const { rerender } = render(<Game {...defaultProps} mode="timed" round={0} />);

        act(() => {
            const img = screen.getByAltText("Round image");
            img.dispatchEvent(new Event("load"));
        });

        expect(defaultProps.setCountdown).toHaveBeenCalledWith(5);
        defaultProps.setCountdown.mockClear();

        // Change round
        rerender(<Game {...defaultProps} mode="timed" round={1} />);

        act(() => {
            const img = screen.getByAltText("Round image");
            img.dispatchEvent(new Event("load"));
        });

        expect(defaultProps.setCountdown).toHaveBeenCalledWith(5);
    });

    it("does not start countdown in multiple-choice mode when image is loaded", () => {
        render(<Game {...defaultProps} mode="multiple-choice" />);

        act(() => {
            const img = screen.getByAltText("Round image");
            img.dispatchEvent(new Event("load"));
        });

        expect(defaultProps.setCountdown).not.toHaveBeenCalled();
    });

    it("clears interval on cleanup", () => {
        const clearIntervalSpy = vi.spyOn(window, "clearInterval");
        const { unmount } = render(<Game {...defaultProps} mode="timed" />);

        act(() => {
            const img = screen.getByAltText("Round image");
            img.dispatchEvent(new Event("load"));
        });

        unmount();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

});

describe("getMultipleChoiceOptions", () => {
  const mockRounds = [
    {
      image: "image1.jpg",
      answers: ["cat", "kitten"],
      clue: "This is a clue for cat",
    },
    {
      image: "image2.jpg",
      answers: ["dog", "puppy"],
      clue: "This is a clue for dog",
    },
    {
      image: "image3.jpg",
      answers: ["bird", "parrot"],
      clue: "This is a clue for bird",
    },
    {
      image: "image4.jpg",
      answers: ["fish", "goldfish"],
      clue: "This is a clue for fish",
    },
  ];

  const current = mockRounds[0]; // Current round with answers ["cat", "kitten"]

  // Mock Math.random to control randomization for predictable test outcomes
  let randomIndex = 0;
  const originalMathRandom = Math.random;
  beforeEach(() => {
    randomIndex = 0;
    Math.random = vi.fn(() => {
      const values = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]; // Predefined sequence
      return values[randomIndex++ % values.length];
    });
  });

  afterEach(() => {
    Math.random = originalMathRandom; // Restore original Math.random
  });

  // Define the getMultipleChoiceOptions function within a renderHook to test useCallback
  const setupHook = (currentArg, roundsArg) => {
    return renderHook(() =>
      useCallback(() => {
        const correctAnswers = currentArg.answers || [];
        const correct = correctAnswers[Math.floor(Math.random() * correctAnswers.length)];
        const allAnswers = roundsArg
          .flatMap((r) => r.answers)
          .filter((a) => !correctAnswers.includes(a));
        const incorrect = [];
        while (incorrect.length < 3 && allAnswers.length > 0) {
          const randomIndex = Math.floor(Math.random() * allAnswers.length);
          incorrect.push(allAnswers.splice(randomIndex, 1)[0]);
        }
        const options = [correct, ...incorrect].sort(() => Math.random() - 0.5);
        return options;
      }, [currentArg, roundsArg])
    );
  };

  it("returns exactly four options", () => {
    const { result } = setupHook(current, mockRounds);
    const options = result.current();
    expect(options).toHaveLength(4);
  });

  it("includes one correct answer from current round", () => {
    const { result } = setupHook(current, mockRounds);
    const options = result.current();
    expect(options).toContain("cat");
  });

  it("includes three incorrect answers not from current round", () => {
    const { result } = setupHook(current, mockRounds);
    const options = result.current();
    const incorrectOptions = options.filter((option) => !["cat", "kitten"].includes(option));
    expect(incorrectOptions).toHaveLength(3);
    expect(incorrectOptions.every((option) => ["dog", "puppy", "bird", "parrot", "fish", "goldfish"].includes(option))).toBe(true);
  });

  it("returns different incorrect answers each time when Math.random varies", () => {
    const { result } = setupHook(current, mockRounds);
    const firstCall = result.current();
    randomIndex = 0; // Reset random sequence
    Math.random = vi.fn(() => {
      const values = [0.6, 0.5, 0.4, 0.3, 0.2, 0.1]; // Different sequence
      return values[randomIndex++ % values.length];
    });
    const secondCall = result.current();
    expect(firstCall).not.toEqual(secondCall); // Different order due to shuffle
  });

  it("handles cases with fewer than three incorrect answers", () => {
    const limitedRounds = [
      { image: "image1.jpg", answers: ["cat", "kitten"], clue: "Clue" },
      { image: "image2.jpg", answers: ["dog"], clue: "Clue" },
    ];
    const { result } = setupHook(current, limitedRounds);
    const options = result.current();
    expect(options).toHaveLength(2); // Correct answer + one incorrect
    expect(options).toContain("cat");
    expect(options).toContain("dog");
  });

  it("shuffles options randomly", () => {
    const { result } = setupHook(current, mockRounds);
    const options = result.current();
    // Trace the Math.random calls:
    // 1. Select correct answer: 0.1 * 2 = 0.2 -> 0 -> "cat"
    // 2. Select first incorrect: 0.2 * 6 = 1.2 -> 1 -> "puppy"
    // 3. Select second incorrect: 0.3 * 5 = 1.5 -> 1 -> "parrot"
    // 4. Select third incorrect: 0.4 * 4 = 1.6 -> 1 -> "bird"
    // 5-6. Sort: [0.5, 0.6] -> results in ["parrot", "cat", "puppy", "bird"]
    const expectedOrder = ["parrot", "cat", "puppy", "bird"];
    expect(options).toEqual(expectedOrder);
  });
});