"use client";

import { useLayoutEffect, useRef } from "react";

/** Only measured geometry is written inline; presentation belongs to RazethNav slots. */
export function useGlidingPill(enabled: boolean, index: number, itemsKey: string, pathname: string) {
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!enabled || !list) return;
    let disposed = false;
    const targets = list.querySelectorAll<HTMLElement>("[data-nav-pill-target]");
    const measure = () => {
      if (disposed) return;
      const target = targets[index];
      if (!target) {
        list.dataset.pillReady = "false";
        return;
      }
      const bounds = list.getBoundingClientRect();
      const item = target.getBoundingClientRect();
      if (!item.width || !item.height) {
        list.dataset.pillReady = "false";
        return;
      }
      list.style.setProperty("--Nav-pill-x", `${item.left - bounds.left + list.scrollLeft + 4}px`);
      list.style.setProperty("--Nav-pill-y", `${item.top - bounds.top + list.scrollTop + 4}px`);
      list.style.setProperty("--Nav-pill-width", `${Math.max(0, item.width - 8)}px`);
      list.style.setProperty("--Nav-pill-height", `${Math.max(0, item.height - 8)}px`);
      list.dataset.pillReady = "true";
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(list);
    targets.forEach(target => observer?.observe(target));
    window.addEventListener("resize", measure);
    list.addEventListener("scroll", measure, { passive: true });
    // Khmer/webfont metrics can settle after the initial layout.
    void document.fonts?.ready.then(measure);
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      list.removeEventListener("scroll", measure);
    };
  }, [enabled, index, itemsKey, pathname]);

  return listRef;
}
