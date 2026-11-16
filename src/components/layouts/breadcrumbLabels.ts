"use client";
import { useEffect, useSyncExternalStore } from "react";

const entries = new Map<string, { owner: symbol; label: string }>();
const listeners = new Set<() => void>();
const empty: ReadonlyMap<string, string> = new Map();
let snapshot = empty;
function publish() {
  snapshot = new Map([...entries].map(([path, entry]) => [path, entry.label]));
  listeners.forEach(listener => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
/** Feature pages supply already-loaded names; the shell never fetches resource data. */
export function useBreadcrumbLabel(path: string, label: string | undefined) {
  useEffect(() => {
    if (!label?.trim()) return;
    const owner = Symbol(path);
    entries.set(path, { owner, label: label.trim() });
    publish();
    return () => {
      if (entries.get(path)?.owner !== owner) return;
      entries.delete(path);
      publish();
    };
  }, [path, label]);
}
export function useBreadcrumbLabels() {
  return useSyncExternalStore(subscribe, () => snapshot, () => empty);
}
