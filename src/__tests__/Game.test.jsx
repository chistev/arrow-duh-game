import React from "react";
import { render, screen, act } from "@testing-library/react";
import Game from "../components/Game";
import { useRounds } from "../hooks/useRounds";
import "@testing-library/jest-dom";

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