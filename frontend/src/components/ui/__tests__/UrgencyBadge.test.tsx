import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UrgencyBadge } from "../UrgencyBadge";

describe("UrgencyBadge Component", () => {
  test("1. should render routine status label", () => {
    render(<UrgencyBadge urgency="routine" />);
    expect(screen.getByText("routine")).toBeInTheDocument();
  });

  test("2. should render urgent status label", () => {
    render(<UrgencyBadge urgency="urgent" />);
    expect(screen.getByText("urgent")).toBeInTheDocument();
  });

  test("3. should render stat status label", () => {
    render(<UrgencyBadge urgency="stat" />);
    expect(screen.getByText("stat")).toBeInTheDocument();
  });

  test("4. should apply correct styles for stat urgency", () => {
    render(<UrgencyBadge urgency="stat" />);
    const badge = screen.getByText("stat");
    expect(badge).toHaveClass("bg-red-100");
    expect(badge).toHaveClass("text-red-800");
  });

  test("5. should apply correct styles for urgent urgency", () => {
    render(<UrgencyBadge urgency="urgent" />);
    const badge = screen.getByText("urgent");
    expect(badge).toHaveClass("bg-orange-100");
    expect(badge).toHaveClass("text-orange-800");
  });
});
