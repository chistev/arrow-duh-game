// src/__tests__/sound.test.js
import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import { getAudioContext, playWinSound, playFailSound, playClickSound, playRoundTransitionSound } from "../utils/sound";

// Mock the AudioContext and its methods
const mockOscillator = {
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    type: "",
    frequency: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
    },
};

const mockGainNode = {
    connect: vi.fn(),
    gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
    },
};

const mockAudioContext = {
    createOscillator: vi.fn(() => mockOscillator),
    createGain: vi.fn(() => mockGainNode),
    currentTime: 0,
    destination: {},
};

// Mock window.AudioContext before tests
beforeAll(() => {
    global.window = global.window || {};
    window.AudioContext = vi.fn(() => mockAudioContext);
    window.webkitAudioContext = vi.fn(() => mockAudioContext);
});

describe("Sound Module", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("playWinSound", () => {
        it("configures oscillator and gain for win sound with default volume", () => {
            playWinSound();
            expect(mockAudioContext.createOscillator).toHaveBeenCalled();
            expect(mockAudioContext.createGain).toHaveBeenCalled();
            expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
            expect(mockOscillator.type).toBe("sine");
            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(600, 0);
            expect(mockOscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(800, 0.3);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
            expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.001, 0.5);
            expect(mockOscillator.start).toHaveBeenCalledWith(0);
            expect(mockOscillator.stop).toHaveBeenCalledWith(0.5);
        });

        it("applies custom volume to win sound", () => {
            playWinSound(0.5);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.5 * 0.5, 0);
        });
    });

    describe("playFailSound", () => {
        it("configures oscillator and gain for fail sound with default volume", () => {
            playFailSound();
            expect(mockAudioContext.createOscillator).toHaveBeenCalled();
            expect(mockAudioContext.createGain).toHaveBeenCalled();
            expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
            expect(mockOscillator.type).toBe("square");
            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(300, 0);
            expect(mockOscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(200, 0.4);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.4, 0);
            expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.001, 0.4);
            expect(mockOscillator.start).toHaveBeenCalledWith(0);
            expect(mockOscillator.stop).toHaveBeenCalledWith(0.4);
        });

        it("applies custom volume to fail sound", () => {
            playFailSound(0.7);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.4 * 0.7, 0);
        });
    });

    describe("playClickSound", () => {
        it("configures oscillator and gain for click sound with default volume", () => {
            playClickSound();
            expect(mockAudioContext.createOscillator).toHaveBeenCalled();
            expect(mockAudioContext.createGain).toHaveBeenCalled();
            expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
            expect(mockOscillator.type).toBe("triangle");
            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(1000, 0);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.3, 0);
            expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.001, 0.1);
            expect(mockOscillator.start).toHaveBeenCalledWith(0);
            expect(mockOscillator.stop).toHaveBeenCalledWith(0.1);
        });

        it("applies custom volume to click sound", () => {
            playClickSound(0.2);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.3 * 0.2, 0);
        });
    });

    describe("playRoundTransitionSound", () => {
        it("configures oscillator and gain for round transition sound with default volume", () => {
            playRoundTransitionSound();
            expect(mockAudioContext.createOscillator).toHaveBeenCalled();
            expect(mockAudioContext.createGain).toHaveBeenCalled();
            expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
            expect(mockOscillator.type).toBe("sine");
            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(500, 0);
            expect(mockOscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(700, 0.2);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.4, 0);
            expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.001, 0.3);
            expect(mockOscillator.start).toHaveBeenCalledWith(0);
            expect(mockOscillator.stop).toHaveBeenCalledWith(0.3);
        });

        it("applies custom volume to round transition sound", () => {
            playRoundTransitionSound(0.8);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.4 * 0.8, 0);
        });
    });
});