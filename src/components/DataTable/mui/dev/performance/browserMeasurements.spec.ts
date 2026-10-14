import { afterTwoFrames, summarizeSamples } from "./browserMeasurements";

it("reports missing samples as unavailable and preserves the raw sample order", () => {
  expect(summarizeSamples([])).toBeNull();
  const samples = [9, 1, 2];
  expect(summarizeSamples(samples)).toEqual({ median: 2, mean: 4, max: 9 });
  expect(samples).toEqual([9, 1, 2]);
  expect(summarizeSamples([3, 1])).toEqual({ median: 2, mean: 2, max: 3 });
});

it("waits for two frames and clears its deadline", async () => {
  jest.useFakeTimers();
  const callbacks: FrameRequestCallback[] = [];
  const request = jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callbacks.push(callback); return callbacks.length;
  });
  try {
    const settled = jest.fn();
    const pending = afterTwoFrames().then(settled);
    callbacks[0](0);
    await Promise.resolve();
    expect(settled).not.toHaveBeenCalled();
    callbacks[1](16);
    await pending;
    expect(settled).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  } finally { request.mockRestore(); jest.useRealTimers(); }
});

it("rejects a stalled frame and cancels queued callbacks", async () => {
  jest.useFakeTimers();
  const request = jest.spyOn(window, "requestAnimationFrame").mockReturnValue(7);
  const cancel = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  try {
    const result = expect(afterTwoFrames()).rejects.toThrow("15-second frame deadline");
    jest.advanceTimersByTime(15_000);
    await result;
    expect(cancel).toHaveBeenCalledWith(7);
  } finally { request.mockRestore(); cancel.mockRestore(); jest.useRealTimers(); }
});
