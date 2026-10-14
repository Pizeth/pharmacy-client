import { summarizeSamples } from "./browserMeasurements";

it("reports missing samples as unavailable and preserves the raw sample order", () => {
  expect(summarizeSamples([])).toBeNull();
  const samples = [9, 1, 2];
  expect(summarizeSamples(samples)).toEqual({ median: 2, mean: 4, max: 9 });
  expect(samples).toEqual([9, 1, 2]);
  expect(summarizeSamples([3, 1])).toEqual({ median: 2, mean: 2, max: 3 });
});
