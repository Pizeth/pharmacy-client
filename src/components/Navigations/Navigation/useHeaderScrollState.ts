"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Track compact-header scrolling and when the footer social section is visible. */
export function useHeaderScrollState() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const expandedHeight = useRef(0);
  const [state, setState] = useState({ scrolled: false, footerVisible: false });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const header = headerRef.current;
      // Retain the expanded measurement while compact so shrinking the header
      // cannot also move the scroll threshold and cause flicker.
      if (header && !header.hasAttribute("data-desktop-compact") && !header.hasAttribute("data-mobile-scrolled")) {
        expandedHeight.current = Math.max(expandedHeight.current, header.getBoundingClientRect().height);
      }
      const footer = document.querySelector("[data-site-footer]");
      const bounds = footer?.getBoundingClientRect();
      const footerVisible = !!bounds && bounds.top < window.innerHeight - 24 && bounds.bottom > 0;
      setState(previous => {
        const threshold = expandedHeight.current;
        const scrolled = threshold > 0 && window.scrollY > (previous.scrolled ? Math.max(0, threshold - 16) : threshold);
        return previous.scrolled === scrolled && previous.footerVisible === footerVisible
          ? previous : { scrolled, footerVisible };
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const refreshExpandedHeight = () => {
      const header = headerRef.current;
      if (header && !header.hasAttribute("data-desktop-compact") && !header.hasAttribute("data-mobile-scrolled")) {
        expandedHeight.current = header.getBoundingClientRect().height;
      }
      schedule();
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refreshExpandedHeight);
    const header = headerRef.current;
    header?.addEventListener("transitionend", refreshExpandedHeight);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    if (headerRef.current) observer.observe(headerRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refreshExpandedHeight);
      header?.removeEventListener("transitionend", refreshExpandedHeight);
    };
  }, [pathname]);

  return { ...state, headerRef };
}
