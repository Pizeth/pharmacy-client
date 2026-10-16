import { act, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ContactCarousel } from "./ContactCarousel";

it("cycles automatically without visible controls", () => {
  jest.useFakeTimers();
  try {
    render(<ThemeProvider theme={createTheme({ cssVariables: true })}><ContactCarousel /></ThemeProvider>);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "នាយកដ្ឋានធនធានមនុស្ស");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(6000); });
    expect(screen.getByRole("img")).toHaveAttribute("alt", "ក្រសួងមុខងារសាធារណៈ");
    act(() => { jest.advanceTimersByTime(6000); });
    expect(screen.getByRole("img")).toHaveAttribute("alt", "ទំនាក់ទំនង និងសេវាសាធារណៈ");
    act(() => { jest.advanceTimersByTime(6000); });
    expect(screen.getByRole("img")).toHaveAttribute("alt", "នាយកដ្ឋានធនធានមនុស្ស");
  } finally {
    jest.useRealTimers();
  }
});
