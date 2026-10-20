import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import { useNavigationSearch } from "./useNavigationSearch";

jest.mock("axios");
const get = jest.mocked(axios.get);
const row = { id: 1, userId: 1, title: "Result", body: "Description" };
beforeEach(() => { jest.useFakeTimers(); get.mockReset(); });
afterEach(() => { jest.useRealTimers(); });

it("debounces input and cancels pending work on unmount", async () => {
  get.mockResolvedValue({ data: [row] });
  const view = renderHook(({ value }) => useNavigationSearch(value), { initialProps: { value: "a" } });
  act(() => jest.advanceTimersByTime(250));
  view.rerender({ value: "ab" });
  act(() => jest.advanceTimersByTime(499));
  expect(get).not.toHaveBeenCalled();
  await act(async () => jest.advanceTimersByTime(1));
  expect(get).toHaveBeenCalledTimes(1);
  expect(view.result.current.results).toEqual([row]);
  view.rerender({ value: "abc" });
  view.unmount();
  act(() => jest.advanceTimersByTime(500));
  expect(get).toHaveBeenCalledTimes(1);
});

it("aborts stale requests and ignores their late responses", async () => {
  let resolveOld!: (value: { data: typeof row[] }) => void;
  get.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
  get.mockResolvedValueOnce({ data: [{ ...row, title: "Newest" }] });
  const view = renderHook(({ value }) => useNavigationSearch(value), { initialProps: { value: "old" } });
  await act(async () => jest.advanceTimersByTime(500));
  const oldSignal = get.mock.calls[0][1]?.signal;
  view.rerender({ value: "new" });
  expect(oldSignal?.aborted).toBe(true);
  await act(async () => jest.advanceTimersByTime(500));
  await act(async () => resolveOld({ data: [row] }));
  expect(view.result.current.results[0].title).toBe("Newest");
  view.rerender({ value: " " });
  expect(view.result.current.results).toEqual([]);
  expect(view.result.current.loading).toBe(false);
});

it("reports request failures and clears them with the query", async () => {
  get.mockRejectedValue(new Error("Unavailable"));
  const view = renderHook(({ value }) => useNavigationSearch(value), { initialProps: { value: "query" } });
  await act(async () => jest.advanceTimersByTime(500));
  expect(view.result.current.error).toBe("Unavailable");
  expect(view.result.current.loading).toBe(false);
  view.rerender({ value: "" });
  expect(view.result.current.error).toBeNull();
});
