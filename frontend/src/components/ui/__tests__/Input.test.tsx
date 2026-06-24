import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../Input";

describe("Input Component", () => {
  test("1. should render value correctly", () => {
    render(<Input value="Hello World" onChange={() => {}} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Hello World");
  });

  test("2. should trigger onChange when user types", () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    
    fireEvent.change(input, { target: { value: "New Text" } });
    expect(handleChange).toHaveBeenCalledWith("New Text");
  });

  test("3. should respect disabled state", () => {
    render(<Input value="Disabled Value" disabled={true} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("cursor-not-allowed");
  });

  test("4. should render placeholder correctly", () => {
    render(<Input value="" placeholder="Enter name" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  test("5. should support custom password or number type", () => {
    render(<Input value="123" type="number" onChange={() => {}} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("type", "number");
  });
});
