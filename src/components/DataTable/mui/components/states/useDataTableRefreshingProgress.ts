// src/components/DataTable/mui/components/states/useDataTableRefreshingProgress.ts

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Initial percentage shown when an indeterminate/trickle refresh starts.
 *
 * Starting slightly above zero gives immediate visual feedback.
 */
const TRICKLE_START = 8;

/**
 * Simulated progress never reaches this value while the request is
 * still active.
 *
 * Completion itself is the only thing that advances the indicator to
 * 100%.
 */
const TRICKLE_MAX = 94;

/**
 * Interval between simulated progress increments.
 */
const TRICKLE_INTERVAL_MS = 300;

/**
 * Keep the completed 100% bar visible briefly before hiding it.
 *
 * Without this delay fast requests could reach 100% and disappear
 * before the user can perceive completion.
 */
const COMPLETE_VISIBLE_MS = 220;

export interface UseDataTableRefreshingProgressOptions {
  /**
   * Whether a background refresh is currently active.
   */
  readonly refreshing: boolean;

  /**
   * Optional REAL progress supplied by the request layer.
   *
   * Expected range:
   *
   *   0 .. 100
   *
   * When omitted, a simulated YouTube/NProgress-style trickle is used.
   */
  readonly progress?: number;
}

export interface DataTableRefreshingProgressState {
  /**
   * Whether the progress bar should currently be visible.
   *
   * This remains true briefly after refreshing becomes false so the
   * user can see the bar finish at 100%.
   */
  readonly visible: boolean;

  /**
   * Current displayed percentage.
   */
  readonly value: number;

  /**
   * Whether the value came from actual request progress.
   */
  readonly determinate: boolean;
}

/**
 * Clamp a percentage to the legal progress range.
 */
function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/**
 * Normalize optional externally supplied progress.
 *
 * NaN and Infinity are treated as unavailable rather than leaking
 * invalid values into MUI LinearProgress.
 */
function normalizeExternalProgress(
  progress: number | undefined,
): number | undefined {
  if (progress === undefined || !Number.isFinite(progress)) {
    return undefined;
  }

  return clampProgress(progress);
}

/**
 * Calculate the next simulated progress value.
 *
 * Progress deliberately slows as it approaches TRICKLE_MAX.
 *
 * This is not an estimated completion percentage.
 * It is a visual activity/progress heuristic.
 */
function getNextTrickleValue(current: number): number {
  if (current < 20) {
    return Math.min(current + 6, TRICKLE_MAX);
  }

  if (current < 50) {
    return Math.min(current + 3, TRICKLE_MAX);
  }

  if (current < 75) {
    return Math.min(current + 1.5, TRICKLE_MAX);
  }

  if (current < 88) {
    return Math.min(current + 0.75, TRICKLE_MAX);
  }

  return Math.min(current + 0.25, TRICKLE_MAX);
}

/**
 * Drives the DataTable top refresh indicator.
 *
 * Behavior:
 *
 * No externally supplied progress:
 *
 *   refresh starts
 *       ↓
 *   8%
 *       ↓
 *   progressively slower trickle
 *       ↓
 *   max 94%
 *       ↓
 *   refresh completes
 *       ↓
 *   100%
 *       ↓
 *   hide after a brief completion delay
 *
 *
 * Externally supplied progress:
 *
 *   refreshProgress = 0..100
 *       ↓
 *   render actual percentage
 *       ↓
 *   refresh completes
 *       ↓
 *   guarantee visible 100% completion
 */
export function useDataTableRefreshingProgress(
  options: UseDataTableRefreshingProgressOptions,
): DataTableRefreshingProgressState {
  const { refreshing, progress } = options;

  const externalProgress = normalizeExternalProgress(progress);

  const determinate = externalProgress !== undefined;

  const [visible, setVisible] = useState(refreshing);

  const [value, setValue] = useState(
    refreshing ? (externalProgress ?? TRICKLE_START) : 0,
  );

  const wasRefreshingRef = useRef(refreshing);

  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  /**
   * Handle refresh lifecycle transitions and externally supplied
   * progress values.
   */
  useEffect(() => {
    if (completionTimerRef.current !== undefined) {
      clearTimeout(completionTimerRef.current);

      completionTimerRef.current = undefined;
    }

    const wasRefreshing = wasRefreshingRef.current;

    if (refreshing) {
      setVisible(true);

      /**
       * New refresh operation.
       *
       * Reset simulated progress instead of carrying over the value
       * from the previous request.
       */
      if (!wasRefreshing) {
        setValue(externalProgress ?? TRICKLE_START);
      } else if (externalProgress !== undefined) {
        /**
         * Real progress may move according to the transport layer.
         *
         * We deliberately respect the supplied value rather than
         * applying our fake trickle algorithm.
         */
        setValue(externalProgress);
      }
    } else if (wasRefreshing) {
      /**
       * Request just completed.
       *
       * Always visibly finish the indicator.
       */
      setVisible(true);

      setValue(100);

      completionTimerRef.current = setTimeout(() => {
        setVisible(false);

        setValue(0);

        completionTimerRef.current = undefined;
      }, COMPLETE_VISIBLE_MS);
    } else {
      setVisible(false);

      setValue(0);
    }

    wasRefreshingRef.current = refreshing;

    return () => {
      if (completionTimerRef.current !== undefined) {
        clearTimeout(completionTimerRef.current);

        completionTimerRef.current = undefined;
      }
    };
  }, [externalProgress, refreshing]);

  /**
   * Simulated trickle mode.
   *
   * This effect is completely disabled whenever real progress is
   * available.
   */
  useEffect(() => {
    if (!refreshing || determinate) {
      return;
    }

    const intervalId = setInterval(() => {
      setValue((current) => getNextTrickleValue(current));
    }, TRICKLE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [determinate, refreshing]);

  return {
    visible,
    value,
    determinate,
  };
}
