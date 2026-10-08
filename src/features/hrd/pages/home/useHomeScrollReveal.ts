import { useCallback, useEffect, useRef } from "react";

/** Progressive enhancement: server-rendered content remains visible without JS. */
export function useHomeScrollReveal() {
  const elements = useRef(new Set<HTMLElement>());
  const register = useCallback((element: HTMLElement | null) => {
    if (element) elements.current.add(element);
  }, []);

  useEffect(() => {
    const nodes = Array.from(elements.current);
    if (typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof IntersectionObserver === "undefined") return;

    let previousScrollY = window.scrollY;
    let scrollingDown = true;
    const trackDirection = () => {
      const nextScrollY = window.scrollY;
      if (nextScrollY !== previousScrollY) scrollingDown = nextScrollY > previousScrollY;
      previousScrollY = nextScrollY;
    };
    window.addEventListener("scroll", trackDirection, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      if (preference.matches) return;
      entries.forEach((entry) => {
        const state = entry.isIntersecting
          ? scrollingDown ? "visible" : "static"
          : entry.boundingClientRect.top < 0 ? "static" : "waiting";
        entry.target.setAttribute("data-reveal-state", state);
      });
    }, { threshold: 0 });

    const updateMotion = () => {
      observer.disconnect();
      nodes.forEach((node) => {
        if (preference.matches) {
          node.removeAttribute("data-reveal-state");
          return;
        }
        const bounds = node.getBoundingClientRect();
        node.setAttribute("data-reveal-state", bounds.top < window.innerHeight && bounds.bottom > 0 ? "visible" : "waiting");
        observer.observe(node);
      });
    };
    updateMotion();
    preference.addEventListener("change", updateMotion);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", trackDirection);
      preference.removeEventListener("change", updateMotion);
      nodes.forEach((node) => node.removeAttribute("data-reveal-state"));
    };
  }, []);

  return register;
}
