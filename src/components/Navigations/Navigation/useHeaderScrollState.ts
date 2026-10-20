"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
const compactAttributes = ["data-desktop-compact", "data-mobile-scrolled"] as const;

/** Measure the current responsive expanded layout, even when already compact.
 * Both layouts are flushed with transitions suppressed and attributes restored
 * synchronously, so a resize does not paint an intermediate expanded header.
 */
function readExpandedHeight(header: HTMLElement) {
  const saved = compactAttributes.map(name => [name, header.getAttribute(name)] as const);
  header.setAttribute("data-header-measuring", "true");
  try {
    for (const [name] of saved) header.removeAttribute(name);
    return header.getBoundingClientRect().height;
  } finally {
    for (const [name, value] of saved) {
      if (value !== null) header.setAttribute(name, value);
    }
    header.getBoundingClientRect();
    header.removeAttribute("data-header-measuring");
  }
}

/** Track compact-header scrolling and when the footer social section is visible. */
export function useHeaderScrollState() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const expandedHeight = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [state, setState] = useState({
    scrolled: false,
    footerVisible: false
  });
  useEffect(() => {
    let frame = 0;
    let refreshGeometry = false;
    const measure = () => {
      frame = 0;
      const header = headerRef.current;
      if (header && refreshGeometry) expandedHeight.current = readExpandedHeight(header);
      refreshGeometry = false;
      // Retain the expanded measurement while compact so shrinking the header
      // cannot also move the scroll threshold and cause flicker.
      if (header && !header.hasAttribute("data-desktop-compact") && !header.hasAttribute("data-mobile-scrolled")) {
        expandedHeight.current = Math.max(expandedHeight.current, header.getBoundingClientRect().height);
      }
      setHeaderHeight(expandedHeight.current);
      const footer = document.querySelector("[data-site-footer]");
      const bounds = footer?.getBoundingClientRect();
      const footerVisible = !!bounds && bounds.top < window.innerHeight - 24 && bounds.bottom > 0;
      setState(previous => {
        const threshold = expandedHeight.current;
        const scrolled = threshold > 0 && window.scrollY > (previous.scrolled ? Math.max(0, threshold - 16) : threshold);
        return previous.scrolled === scrolled && previous.footerVisible === footerVisible ? previous : {
          scrolled,
          footerVisible
        };
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const refreshExpandedHeight = () => {
      const header = headerRef.current;
      if (header && !header.hasAttribute("data-desktop-compact") && !header.hasAttribute("data-mobile-scrolled")) {
        expandedHeight.current = header.getBoundingClientRect().height;
      }
      schedule();
    };
    const resize = () => {
      refreshGeometry = true;
      schedule();
    };
    if (headerRef.current) expandedHeight.current = readExpandedHeight(headerRef.current);
    measure();
    window.addEventListener("scroll", schedule, {
      passive: true
    });
    window.addEventListener("resize", resize);
    window.addEventListener("pageshow", schedule);
    window.addEventListener("popstate", schedule);
    const header = headerRef.current;
    header?.addEventListener("transitionend", refreshExpandedHeight);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    if (headerRef.current) observer.observe(headerRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pageshow", schedule);
      window.removeEventListener("popstate", schedule);
      header?.removeEventListener("transitionend", refreshExpandedHeight);
    };
  }, [pathname]);
  return {
    ...state,
    headerRef,
    headerHeight
  };
}
