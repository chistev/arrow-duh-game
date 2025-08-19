import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Overlay from "../components/Overlay";
import "@testing-library/jest-dom";

describe("Overlay Component", () => {
  it("does not render when show is false", () => {
    render(<Overlay show={false} kind="win" message="You won!" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders win overlay with correct text, emoji, and styles", () => {
    render(<Overlay show={true} kind="win" message="You won!" />);
    const button = screen.getByRole("button", { name: "Continue to next round" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm transition bg-emerald-600/75"
    );

    const messageContainer = screen.getByText("You won!");
    expect(messageContainer).toBeInTheDocument();
    expect(messageContainer).toHaveClass(
      "text-white text-4xl md:text-6xl font-black tracking-tight drop-shadow-xl select-none flex items-center gap-4 animate-bounce"
    );
    expect(messageContainer).toHaveAttribute("aria-live", "assertive");

    const emoji = screen.getByText("🎉");
    expect(emoji).toBeInTheDocument();
  });

  it("renders lose overlay with correct text, emoji, and styles", () => {
    render(<Overlay show={true} kind="lose" message="Try again!" />);
    const button = screen.getByRole("button", { name: "Try again" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm transition bg-rose-600/75"
    );

    const messageContainer = screen.getByText("Try again!");
    expect(messageContainer).toBeInTheDocument();
    expect(messageContainer).toHaveClass(
      "text-white text-4xl md:text-6xl font-black tracking-tight drop-shadow-xl select-none flex items-center gap-4 animate-pulse"
    );
    expect(messageContainer).toHaveAttribute("aria-live", "assertive");

    const emoji = screen.getByText("😕");
    expect(emoji).toBeInTheDocument();
  });

  it("triggers onClick when the overlay button is clicked", () => {
    const handleClick = vi.fn();
    render(
      <Overlay show={true} kind="win" message="You won!" onClick={handleClick} />
    );
    const button = screen.getByRole("button", { name: "Continue to next round" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});