import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { DataTableRefreshingIndicator } from "./DataTableRefreshingIndicator";
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        refreshingIndicator: { borderRadius: "7px" },
      },
    },
  },
});
function indicator(refreshing: boolean, progress?: number) {
  return (
    <ThemeProvider theme={theme}>
      <DataTableRefreshingIndicator
        refreshing={refreshing}
        progress={progress}
      />
    </ThemeProvider>
  );
}
it("themes real progress and retains the idle layout slot after completion", () => {
  jest.useFakeTimers();
  try {
    const { rerender, container, unmount } = render(indicator(true, 40));
    const bar = screen.getByRole("progressbar", { name: "Loading table data" });
    expect(bar).toHaveClass(dataTableClasses.refreshingIndicator);
    expect(bar).toHaveStyle({ height: "2px", borderRadius: "7px" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    rerender(indicator(false));
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(
      container.querySelector(`.${dataTableClasses.refreshingIndicator}`),
    ).toHaveStyle({ height: "2px", visibility: "hidden" });
    unmount();
  } finally {
    jest.useRealTimers();
  }
});
it("keeps simulated refresh progress labelled as refreshing", () => {
  const { unmount } = render(indicator(true));
  const bar = screen.getByRole("progressbar", {
    name: "Refreshing table data",
  });
  expect(bar).toHaveAttribute("aria-valuetext", "Refreshing table data");
  expect(Number(bar.getAttribute("aria-valuenow"))).toBeLessThan(100);
  unmount();
});
