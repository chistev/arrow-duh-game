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
        {
            image: "image2.jpg",
            answers: ["dog", "puppy"],
            clue: "Another clue"
        },
        {
            image: "image3.jpg",
            answers: ["bird", "parrot"],
            clue: "Yet another clue"
        }
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
        const form = screen.getByRole("form", { hidden: true });

        fireEvent.change(input, { target: { value: "cat" } });
        fireEvent.submit(form);

        expect(playClickSound).not.toHaveBeenCalled();
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

describe("Game component handleMultipleChoice function", () => {
    const defaultProps = {
        setCurrentScreen: vi.fn(),
        mode: "multiple-choice",
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
        {
            image: "image2.jpg",
            answers: ["dog", "puppy"],
            clue: "Another clue"
        },
        {
            image: "image3.jpg",
            answers: ["bird", "parrot"],
            clue: "Yet another clue"
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        useRounds.mockReturnValue(mockRounds);
        vi.spyOn(React, "useRef").mockReturnValue({ current: { focus: vi.fn() } });
    });

    it("plays click sound when soundVolume is greater than 0", () => {
        render(<Game {...defaultProps} />);
        const choiceButtons = screen.getAllByRole('button', {
            name: /^(?!Guess|Show clue|Skip|Reset Game|View Results|Home|Switch to)/i
        });
        const choiceButton = choiceButtons[0];

        fireEvent.click(choiceButton);
        expect(playClickSound).toHaveBeenCalledWith(0.5);
    });

    it("does not play click sound when soundVolume is 0", () => {
        render(<Game {...defaultProps} soundVolume={0} />);
        const choiceButtons = screen.getAllByRole('button', {
            name: /^(?!Guess|Show clue|Skip|Reset Game|View Results|Home|Switch to)/i
        });
        const choiceButton = choiceButtons[0];

        fireEvent.click(choiceButton);
        expect(playClickSound).not.toHaveBeenCalled();
    });


    it("calls handleFail when choice does not match any answer", () => {
        render(<Game {...defaultProps} />);

        const choiceButtons = screen.getAllByRole('button', {
            name: /^(?!Guess|Show clue|Skip|Reset Game|View Results|Home|Switch to)/i
        });

        const incorrectButton = choiceButtons.find(button =>
            !['cat', 'kitten'].includes(button.textContent.toLowerCase())
        );

        fireEvent.click(incorrectButton);
        expect(screen.getByText(/fail:/)).toBeInTheDocument();
        expect(defaultProps.setStats).toHaveBeenCalled();
    });

    it("does not crash if current.answers is empty or undefined", () => {
        useRounds.mockReturnValue([{ image: "image1.jpg", answers: [], clue: "This is a clue" }]);
        render(<Game {...defaultProps} />);

        const choiceButtons = screen.getAllByRole("button", {
            name: /^(?!Guess|Show clue|Skip|Reset Game|View Results|Home|Switch to)/i
        });
        const choiceButton = choiceButtons[0];

        fireEvent.click(choiceButton);
        expect(screen.getByText(/fail:/)).toBeInTheDocument();
        expect(defaultProps.setStats).toHaveBeenCalled();
    });
});