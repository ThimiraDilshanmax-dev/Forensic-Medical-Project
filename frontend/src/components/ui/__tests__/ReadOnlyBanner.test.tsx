import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadOnlyBanner } from "../ReadOnlyBanner";

// Mock the Eye icon from lucide-react to prevent icon import issues during tests
vi.mock("lucide-react", () => ({
  Eye: () => <svg data-testid="eye-icon" />
}));

describe("ReadOnlyBanner Component", () => {
  test("1. should render text label correctly", () => {
    render(<ReadOnlyBanner text="Viewing historical record" />);
    expect(screen.getByText("Viewing historical record")).toBeInTheDocument();
  });

  test("2. should render mock Eye icon successfully", () => {
    render(<ReadOnlyBanner text="Testing icon" />);
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });

  test("3. should apply amber warning color classes", () => {
    render(<ReadOnlyBanner text="Color check" />);
    const banner = screen.getByText("Color check").parentElement;
    expect(banner).toHaveClass("bg-amber-50");
    expect(banner).toHaveClass("text-amber-700");
  });

  test("4. should render flex layout container", () => {
    render(<ReadOnlyBanner text="Layout check" />);
    const banner = screen.getByText("Layout check").parentElement;
    expect(banner).toHaveClass("flex");
    expect(banner).toHaveClass("items-center");
  });

  test("5. should support rendering dynamic messages", () => {
    const dynamicMsg = `Opened by System on ${new Date().toLocaleDateString()}`;
    render(<ReadOnlyBanner text={dynamicMsg} />);
    expect(screen.getByText(dynamicMsg)).toBeInTheDocument();
  });
});
