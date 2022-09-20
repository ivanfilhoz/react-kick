import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import Hello from ".";

test("says hello", () => {
  render(<Hello />);

  expect(screen.getByText(/hello/i)).toBeTruthy();
});
