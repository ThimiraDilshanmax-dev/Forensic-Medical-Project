import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Btn } from "../Btn";

describe("Btn Component", () => {
  test("1. should render children text correctly", () => {
    render(<Btn>Click Me</Btn>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  test("2. should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Btn onClick={handleClick}>Click Me</Btn>);
    
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("3. should handle disabled state and prevent interaction", () => {
    const handleClick = vi.fn();
    render(<Btn onClick={handleClick} disabled={true}>Click Me</Btn>);
    
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50");
    expect(button).toHaveClass("cursor-not-allowed");
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("4. should render with custom icon when provided", () => {
    const mockIcon = <span data-testid="mock-icon">📁</span>;
    render(<Btn icon={mockIcon}>With Icon</Btn>);
    
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    expect(screen.getByText("With Icon")).toBeInTheDocument();
  });

  test("5. should apply correct CSS classes for different variants", () => {
    const { rerender } = render(<Btn variant="danger">Danger Button</Btn>);
    let button = screen.getByRole("button", { name: /danger button/i });
    expect(button).toHaveClass("bg-red-600");

    rerender(<Btn variant="success">Success Button</Btn>);
    button = screen.getByRole("button", { name: /success/i });
    expect(button).toHaveClass("bg-emerald-600");
  });
});
