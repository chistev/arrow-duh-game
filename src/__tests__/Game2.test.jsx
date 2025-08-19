import React from "react";
import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import Game from "../components/Game";
import { useRounds } from "../hooks/useRounds";
import { playClickSound } from "../utils/sound";
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
    default: ({ label, value }) => <div>{`${label}: ${value}`}</div>,
}));

vi.mock("../components/ModeBadge", () => ({
    default: ({ mode }) => <div>{`Mode: ${mode}`}</div>,
}));

vi.mock("../components/Overlay", () => ({
    default: ({ show, kind, message, onClick }) =>
        show ? <div onClick={onClick}>{`${kind}: ${message}`}</div> : null,
}));

describe("Game component onSubmit function", () => {
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
            clue: "This is a clue",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        useRounds.mockReturnValue(mockRounds);
        vi.spyOn(React, "useRef").mockReturnValue({ current: { focus: vi.fn() } });
    });

    it("does nothing if input is empty", () => {
        render(<Game {...defaultProps} />);
        const input = screen.getByPlaceholderText("Type your guess…");
        const form = screen.getByRole("form");

        fireEvent.change(input, { target: { value: "" } });
        fireEvent.submit(form);

        expect(playClickSound).not.toHaveBeenCalled();
        expect(defaultProps.setStats).not.toHaveBeenCalled();
    });

    it("does nothing if rounds are empty", () => {
        useRounds.mockReturnValue([]);
        render(<Game {...defaultProps} />);
        expect(screen.getByText("Loading rounds...")).toBeInTheDocument();
    });

    it("plays click sound when soundVolume is greater than 0 and input is valid", () => {
        render(<Game {...defaultProps} />);
        const input = screen.getByPlaceholderText("Type your guess…");
        const form = screen.getByRole("form");

        fireEvent.change(input, { target: { value: "cat" } });
        fireEvent.submit(form);

        expect(playClickSound).toHaveBeenCalledWith(0.5);
    });

    it("does not play click sound when soundVolume is 0", () => {
        render(<Game {...defaultProps} soundVolume={0} />);
        const input = screen.getByPlaceholderText("Type your guess…");
        const form = screen.getByRole("form", { hidden: true }); // Add hidden option

        fireEvent.change(input, { target: { value: "cat" } });
        fireEvent.submit(form);

        expect(playClickSound).not.toHaveBeenCalled();
    });

    it("calls handleWin when input matches an answer (case and whitespace insensitive)", () => {
        render(<Game {...defaultProps} />);
        const input = screen.getByPlaceholderText("Type your guess…");
        const form = screen.getByRole("form");

        fireEvent.change(input, { target: { value: " KITTEN " } });
        fireEvent.submit(form);

        expect(screen.getByText(/win:/)).toBeInTheDocument();
        expect(defaultProps.setStats).toHaveBeenCalled();
    });

    it("calls handleFail when input does not match any answer", () => {
        render(<Game {...defaultProps} />);
        const input = screen.getByPlaceholderText("Type your guess…");
        const form = screen.getByRole("form", { name: /guess-form/i });

        fireEvent.change(input, { target: { value: "dog" } });
        fireEvent.submit(form);

        expect(screen.getByText(/fail:/)).toBeInTheDocument();
        expect(defaultProps.setStats).toHaveBeenCalled();
    });

    it("prevents default form submission", () => {
        render(<Game {...defaultProps} />);
        const input = screen.getByPlaceholderText("Type your guess…");
        const form = screen.getByRole("form", { name: /guess-form/i });

        const preventDefault = vi.fn();

        fireEvent.change(input, { target: { value: "cat" } });
        const event = createEvent.submit(form);
        event.preventDefault = preventDefault;
        fireEvent(form, event);

        expect(preventDefault).toHaveBeenCalled();
    });
});