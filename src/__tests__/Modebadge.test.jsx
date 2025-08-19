// ModeBadge.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import ModeBadge from "../components/ModeBadge";
import "@testing-library/jest-dom";

describe("ModeBadge Component", () => {
  it("renders Timed mode with correct text and styles", () => {
    render(<ModeBadge mode="timed" />);
    const badge = screen.getByText("Timed");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium border-rose-500/40 bg-rose-500/15 text-rose-200"
    );
    expect(badge.querySelector("span")).toHaveClass(
      "h-2 w-2 rounded-full bg-current opacity-70"
    );
  });

  it("renders Classic mode with correct text and styles", () => {
    render(<ModeBadge mode="classic" />);
    const badge = screen.getByText("Classic");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
    );
    expect(badge.querySelector("span")).toHaveClass(
      "h-2 w-2 rounded-full bg-current opacity-70"
    );
  });

  it("renders Multiple Choice mode with correct text and styles", () => {
    render(<ModeBadge mode="multiple-choice" />);
    const badge = screen.getByText("Multiple Choice");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium border-blue-500/40 bg-blue-500/15 text-blue-200"
    );
    expect(badge.querySelector("span")).toHaveClass(
      "h-2 w-2 rounded-full bg-current opacity-70"
    );
  });

  it("renders Survival mode with correct text and styles", () => {
    render(<ModeBadge mode="survival" />);
    const badge = screen.getByText("Survival");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium border-purple-500/40 bg-purple-500/15 text-purple-200"
    );
    expect(badge.querySelector("span")).toHaveClass(
      "h-2 w-2 rounded-full bg-current opacity-70"
    );
  });

  it("applies only base classes when an invalid mode is provided", () => {
    render(<ModeBadge mode="invalid" />);
    const badge = screen.getByText("Survival"); // Fallback to Survival text
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium"
    );
    expect(badge).not.toHaveClass(
      "border-rose-500/40",
      "border-emerald-500/40",
      "border-blue-500/40",
      "border-purple-500/40"
    );
    expect(badge.querySelector("span")).toHaveClass(
      "h-2 w-2 rounded-full bg-current opacity-70"
    );
  });
});