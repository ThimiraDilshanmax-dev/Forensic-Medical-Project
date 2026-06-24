import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "../Textarea";

describe("Textarea Component", () => {
  test("1. should render text value correctly", () => {
    render(<Textarea value="Notes description" onChange={() => {}} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Notes description");
  });

  test("2. should call onChange with updated value", () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} />);
    const textarea = screen.getByRole("textbox");
    
    fireEvent.change(textarea, { target: { value: "Updated Notes" } });
    expect(handleChange).toHaveBeenCalledWith("Updated Notes");
  });

  test("3. should handle disabled state correctly", () => {
    render(<Textarea value="Immutable description" disabled={true} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("cursor-not-allowed");
  });

  test("4. should render placeholder text correctly", () => {
    render(<Textarea value="" placeholder="Describe injuries..." onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Describe injuries...")).toBeInTheDocument();
  });

  test("5. should configure rows attribute correctly", () => {
    render(<Textarea value="" rows={6} onChange={() => {}} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "6");
  });
});
