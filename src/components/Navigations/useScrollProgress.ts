"use client";

import { useEffect, useRef } from "react";

/** Scroll geometry stays outside React's render cycle. */
export function useScrollProgress() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let frame: number | undefined;
    const measure = () => {
      frame = undefined;
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      const progress = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
      ref.current?.style.setProperty("--BackToTop-progress", String(progress));
    };
    const schedule = () => { frame ??= window.requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(document.documentElement);
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
}
