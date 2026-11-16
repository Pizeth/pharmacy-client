"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// shoryuken.gif: 16 frames, each with a 100ms delay.
export const SHORYUKEN_DURATION_MS = 1600;
const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

export function useScrollToTop() {
  const [isScrolling, setIsScrolling] = useState(false);
  const frame = useRef<number | null>(null);
  const detach = useRef<(() => void) | null>(null);

  const cleanup = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    detach.current?.();
    detach.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const scrollToTop = useCallback(() => {
    if (frame.current !== null) return;
    const distance = window.scrollY;
    if (distance <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    setIsScrolling(true);
    const startedAt = performance.now();
    const finish = () => { cleanup(); setIsScrolling(false); };
    const interrupt = (event: Event) => {
      if (event instanceof KeyboardEvent && !scrollKeys.has(event.key)) return;
      finish();
    };
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    detach.current = () => {
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("keydown", interrupt);
    };

    const step = (now: number) => {
      const progress = Math.min(Math.max((now - startedAt) / SHORYUKEN_DURATION_MS, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // Explicit instant steps avoid competing with a global CSS scroll-behavior.
      window.scrollTo({ top: distance * (1 - eased), behavior: "instant" });
      if (progress < 1) frame.current = requestAnimationFrame(step);
      else finish();
    };
    frame.current = requestAnimationFrame(step);
  }, [cleanup]);

  return { isScrolling, scrollToTop };
}
