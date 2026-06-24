import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormSection } from "../FormSection";

vi.mock("lucide-react", () => ({
  ChevronUp: () => <svg data-testid="chevron-up" />,
  ChevronDown: () => <svg data-testid="chevron-down" />
}));

describe("FormSection Component", () => {
  test("1. should render title correctly", () => {
    render(
      <FormSection title="Section Title">
        <div>Child Content</div>
      </FormSection>
    );
    expect(screen.getByText("Section Title")).toBeInTheDocument();
  });

  test("2. should render children content inside section", () => {
    render(
      <FormSection title="Section Title">
        <div data-testid="child-element">Child Content</div>
      </FormSection>
    );
    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  test("3. should render custom badge inside header if provided", () => {
    render(
      <FormSection title="Section Title" badge={<span data-testid="mock-badge">Badge</span>}>
        <div>Child Content</div>
      </FormSection>
    );
    expect(screen.getByTestId("mock-badge")).toBeInTheDocument();
  });

  test("4. should handle collapse toggle when collapsible is true", () => {
    render(
      <FormSection title="Collapsible Section" collapsible={true}>
        <div data-testid="content">Toggle Content</div>
      </FormSection>
    );

    const button = screen.getByRole("button", { name: /Collapsible Section/i });
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-up")).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(button);
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();

    // Click to expand
    fireEvent.click(button);
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  test("5. should not toggle expand/collapse when collapsible is false", () => {
    render(
      <FormSection title="Static Section" collapsible={false}>
        <div data-testid="content">Static Content</div>
      </FormSection>
    );

    const button = screen.getByRole("button", { name: /Static Section/i });
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.queryByTestId("chevron-up")).not.toBeInTheDocument();

    // Try to collapse (should not work)
    fireEvent.click(button);
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
