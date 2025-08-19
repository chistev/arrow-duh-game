import { render, screen } from "@testing-library/react";
import Hudtile from "../components/HudTile";
import "@testing-library/jest-dom";

describe("Hudtile Component", () => {
  it("renders the Hudtile component with label and value", () => {
    render(<Hudtile label="Score" value="100" />);
    
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders label with correct styling", () => {
    render(<Hudtile label="Score" value="100" />);
    
    const labelDiv = screen.getByText("Score");
    expect(labelDiv).toHaveClass("text-sm uppercase tracking-wider text-slate-400");
  });

  it("renders value with correct styling", () => {
    render(<Hudtile label="Score" value="100" />);
    
    const valueDiv = screen.getByText("100");
    expect(valueDiv).toHaveClass("text-2xl font-bold");
  });
});
