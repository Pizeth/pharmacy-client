import { act, fireEvent, render, screen } from "@testing-library/react";
import { DashboardSystemMonitor } from "./DashboardSystemMonitor";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it("updates the demo, pauses, resumes and resets without accumulating timers", () => {
  const { unmount } = render(<DashboardSystemMonitor />);
  const initial = screen.getByTestId("monitor-cpu").textContent;
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.getByTestId("monitor-cpu").textContent).not.toBe(initial);
  fireEvent.click(screen.getByRole("button", { name: "Pause simulation" }));
  const paused = screen.getByTestId("monitor-cpu").textContent;
  act(() => jest.advanceTimersByTime(4000));
  expect(screen.getByTestId("monitor-cpu")).toHaveTextContent(paused!);
  fireEvent.click(screen.getByRole("button", { name: "Load spike" }));
  expect(screen.getByTestId("monitor-cpu").textContent).not.toBe(paused);
  fireEvent.click(screen.getByRole("button", { name: "Resume simulation" }));
  expect(jest.getTimerCount()).toBe(1);
  fireEvent.click(screen.getByRole("button", { name: "Reset simulation" }));
  expect(screen.getByTestId("monitor-cpu")).toHaveTextContent(initial!);
  expect(screen.getAllByRole("img")).toHaveLength(3);
  expect(screen.getAllByRole("progressbar")).toHaveLength(12);
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});
