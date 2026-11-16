export function summarizeSamples(values: readonly number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return {
    median: (sorted[middle] + sorted[Math.floor((sorted.length - 1) / 2)]) / 2,
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: Math.max(...values),
  };
}

/** A responsiveness proxy, not a claim about exact paint completion or INP. */
export function afterTwoFrames(): Promise<void> {
  return new Promise((resolve, reject) => {
    let first = 0;
    let second = 0;
    const timeout = window.setTimeout(() => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      reject(new Error("BLOCKED: 15-second frame deadline"));
    }, 15_000);
    first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        clearTimeout(timeout);
        resolve();
      });
    });
  });
}
