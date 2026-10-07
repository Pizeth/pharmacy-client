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
    if (preference.matches || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-reveal-state", "visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0 });

    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight - 60) return;
      node.setAttribute("data-reveal-state", "waiting");
      observer.observe(node);
    });
    const showAll = () => {
      if (!preference.matches) return;
      nodes.forEach((node) => node.removeAttribute("data-reveal-state"));
      observer.disconnect();
    };
    preference.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", showAll);
      nodes.forEach((node) => node.removeAttribute("data-reveal-state"));
    };
  }, []);

  return register;
}
