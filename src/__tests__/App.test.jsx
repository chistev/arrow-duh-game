import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";

vi.mock("../components/Home", () => ({
  default: ({ setCurrentScreen }) => (
    <div>
      <p>Mock Home</p>
      <button onClick={() => setCurrentScreen("game")}>Go Game</button>
      <button onClick={() => setCurrentScreen("settings")}>Go Settings</button>
      <button onClick={() => setCurrentScreen("results")}>Go Results</button>
    </div>
  ),
}));

vi.mock("../components/Game", () => ({
  default: () => <p>Mock Game</p>,
}));

vi.mock("../components/Settings", () => ({
  default: () => <p>Mock Settings</p>,
}));

vi.mock("../components/Results", () => ({
  default: () => <p>Mock Results</p>,
}));

describe("App stats initialization", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes stats with defaults when localStorage is empty", () => {
    render(<App />);
    const savedStats = JSON.parse(localStorage.getItem("gameStats"));
    expect(savedStats).toEqual({ correct: 0, wrong: 0, streak: 0, rounds: 0 });
  });

  it("initializes stats from localStorage when available", () => {
    const mockStats = { correct: 5, wrong: 2, streak: 3, rounds: 10 };
    localStorage.setItem("gameStats", JSON.stringify(mockStats));

    render(<App />);
    const savedStats = JSON.parse(localStorage.getItem("gameStats"));
    expect(savedStats).toEqual(mockStats);
  });
});

describe("App renderScreen", () => {
  it("renders Home by default", () => {
    render(<App />);
    expect(screen.getByText("Mock Home")).toBeInTheDocument();
  });

  it("renders Game when navigating from Home", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Go Game"));
    expect(screen.getByText("Mock Game")).toBeInTheDocument();
  });

  it("renders Settings when navigating from Home", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Go Settings"));
    expect(screen.getByText("Mock Settings")).toBeInTheDocument();
  });

  it("renders Results when navigating from Home", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Go Results"));
    expect(screen.getByText("Mock Results")).toBeInTheDocument();
  });

  it("renders Home for unknown screen values (default case)", () => {
    const useStateMock = (initialValue) => {
      let state = "unknown_screen";
      const setState = (newValue) => {
        state = newValue;
      };
      return [state, setState];
    };
    
    const originalUseState = React.useState;
    React.useState = useStateMock;
    
    render(<App />);
    expect(screen.getByText("Mock Home")).toBeInTheDocument();
    
    React.useState = originalUseState;
  });
});
