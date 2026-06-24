import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge Component", () => {
  test("1. should render mapped label for 'complete' status", () => {
    render(<Badge status="complete" />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  test("2. should render mapped label for 'in_progress' status", () => {
    render(<Badge status="in_progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  test("3. should render raw status value for unknown statuses", () => {
    render(<Badge status="unknown-status-value" />);
    expect(screen.getByText("unknown-status-value")).toBeInTheDocument();
  });

  test("4. should apply correct CSS classes for a known status", () => {
    render(<Badge status="draft" />);
    const badge = screen.getByText("Draft");
    expect(badge).toHaveClass("bg-amber-100");
    expect(badge).toHaveClass("text-amber-800");
  });

  test("5. should apply fallback gray CSS classes for unknown status", () => {
    render(<Badge status="custom-status" />);
    const badge = screen.getByText("custom-status");
    expect(badge).toHaveClass("bg-gray-100");
    expect(badge).toHaveClass("text-gray-700");
  });
});
