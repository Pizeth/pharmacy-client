"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/** Existing demo endpoint shape; replace transport here when real search is ready. */
export interface NavigationSearchResult {
  id: number;
  userId: number;
  title: string;
  body: string;
}
export function useNavigationSearch(value: string) {
  const [results, setResults] = useState<NavigationSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setResults([]);
    setError(null);
    setLoading(false);
    if (!value.trim()) return () => controller.abort();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get<NavigationSearchResult[] | NavigationSearchResult>("https://jsonplaceholder.typicode.com/posts", {
          signal: controller.signal
        });
        if (controller.signal.aborted) return;
        setResults(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "An error occurred");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);
  return {
    results,
    error,
    loading
  };
}
