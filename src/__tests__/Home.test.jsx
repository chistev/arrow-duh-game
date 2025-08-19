import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../components/Home";
import "@testing-library/jest-dom";

describe("Home Component", () => {
  // Mock the setCurrentScreen function
  const setCurrentScreen = vi.fn();

  beforeEach(() => {
    // Clear the mock calls before each test
    setCurrentScreen.mockClear();
  });

  it("renders the Home component correctly", () => {
    render(<Home setCurrentScreen={setCurrentScreen} />);

    // Check for key text elements
    expect(screen.getByText("Guess It!")).toBeInTheDocument();
    expect(screen.getByText("Guess the object in the image!")).toBeInTheDocument();
    expect(screen.getByText("Start Game")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("View Results")).toBeInTheDocument();
    expect(screen.getByText("Challenge your observation skills in Timed or Classic mode!")).toBeInTheDocument();
  });

  it("calls setCurrentScreen with 'game' when Start Game button is clicked", () => {
    render(<Home setCurrentScreen={setCurrentScreen} />);
    const startGameButton = screen.getByText("Start Game");
    fireEvent.click(startGameButton);
    expect(setCurrentScreen).toHaveBeenCalledWith("game");
    expect(setCurrentScreen).toHaveBeenCalledTimes(1);
  });

  it("calls setCurrentScreen with 'settings' when Settings button is clicked", () => {
    render(<Home setCurrentScreen={setCurrentScreen} />);
    const settingsButton = screen.getByText("Settings");
    fireEvent.click(settingsButton);
    expect(setCurrentScreen).toHaveBeenCalledWith("settings");
    expect(setCurrentScreen).toHaveBeenCalledTimes(1);
  });

  it("calls setCurrentScreen with 'results' when View Results button is clicked", () => {
    render(<Home setCurrentScreen={setCurrentScreen} />);
    const resultsButton = screen.getByText("View Results");
    fireEvent.click(resultsButton);
    expect(setCurrentScreen).toHaveBeenCalledWith("results");
    expect(setCurrentScreen).toHaveBeenCalledTimes(1);
  });

  it("renders the logo div with correct styling", () => {
    render(<Home setCurrentScreen={setCurrentScreen} />);
    const logoDiv = screen.getByText("?");
    expect(logoDiv).toHaveClass("h-12 w-12 rounded-2xl bg-rose-600 grid place-items-center font-black text-2xl");
  });

  it("applies correct classes to buttons", () => {
    render(<Home setCurrentScreen={setCurrentScreen} />);
    
    const startGameButton = screen.getByText("Start Game");
    expect(startGameButton).toHaveClass("rounded-2xl px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium shadow-lg shadow-rose-900/30 transition");

    const settingsButton = screen.getByText("Settings");
    expect(settingsButton).toHaveClass("rounded-2xl px-6 py-3 bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition");

    const resultsButton = screen.getByText("View Results");
    expect(resultsButton).toHaveClass("rounded-2xl px-6 py-3 bg-slate-800 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition");
  });
});