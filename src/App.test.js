import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Black-Scholes calculator title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Black-Scholes Option Calculator/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders Greeks Analysis section", () => {
  render(<App />);
  const greeksElement = screen.getByText(/Greeks Analysis/i);
  expect(greeksElement).toBeInTheDocument();
});
