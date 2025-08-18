import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useRounds } from "../hooks/useRounds";
import "@testing-library/jest-dom";

global.fetch = vi.fn();

function TestComponent() {
  const rounds = useRounds();
  return (
    <div data-testid="rounds">
      {rounds.map((r) => (
        <span key={r.id}>{r.clue}</span>
      ))}
    </div>
  );
}

describe("useRounds hook", () => {
  const mockRounds = [
    {
      id: 1,
      image: "https://example.com/cat.jpg",
      answers: ["cat", "kitten"],
      clue: "House pet",
    },
    {
      id: 2,
      image: "https://example.com/dog.jpg",
      answers: ["dog", "puppy"],
      clue: "Barks loudly",
    },
  ];

  const fallbackRounds = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop",
      answers: ["cat", "kitten", "feline"],
      clue: "House pet that says meow",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      answers: ["shoe", "sneakers", "footwear"],
      clue: "You wear them on your feet",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop&ixid=1SAnrIxw5OY",
      answers: ["laptop", "notebook", "portable computer"],
      clue: "Portable computer",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    fetch.mockReset();
  });

  it("returns empty array initially", () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<TestComponent />);
    expect(screen.getByTestId("rounds").children.length).toBe(0);
  });

  it("fetches and shuffles rounds from rounds.json", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRounds),
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/rounds.json");
      expect(screen.getByText("House pet")).toBeInTheDocument();
      expect(screen.getByText("Barks loudly")).toBeInTheDocument();
    });
  });

  it("returns fallback rounds on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch rounds data"));

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<TestComponent />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/rounds.json");
      expect(
        screen.getByText("House pet that says meow")
      ).toBeInTheDocument();
      expect(screen.getByText("You wear them on your feet")).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("returns fallback rounds when response not ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByText("Portable computer")).toBeInTheDocument();
    });
  });
});