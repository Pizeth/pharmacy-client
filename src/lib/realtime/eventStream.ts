/** Incremental SSE decoder; limits frame size and supports split UTF-8/chunks. */
export async function readEventStream(
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  onData: (data: string) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let idle: ReturnType<typeof setTimeout>;
  const cancel = () => { void reader.cancel().catch(() => undefined); };
  const resetIdle = () => { clearTimeout(idle); idle = setTimeout(cancel, 45000); };
  signal.addEventListener("abort", cancel, { once: true });
  resetIdle();
  try {
    while (!signal.aborted) {
      const result = await reader.read();
      if (result.done) break;
      resetIdle();
      buffer = (buffer + decoder.decode(result.value, { stream: true })).replace(/\r\n/g, "\n");
      let end: number;
      while ((end = buffer.indexOf("\n\n")) !== -1) {
        if (end > 65536) throw new Error("Live event exceeds frame limit.");
        const frame = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        const data = frame.split("\n").filter(line => line.startsWith("data:"))
          .map(line => line.slice(5).replace(/^ /, "")).join("\n");
        if (data && !signal.aborted) onData(data);
      }
      if (buffer.length > 65536) throw new Error("Live event exceeds frame limit.");
    }
  } finally {
    clearTimeout(idle!);
    signal.removeEventListener("abort", cancel);
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
