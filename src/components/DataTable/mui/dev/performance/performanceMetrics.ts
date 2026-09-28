// src/components/DataTable/mui/dev/performance/performanceMetrics.ts

import type {
  ProfilerOnRenderCallback,
} from "react";

export type DataTablePerformancePhase =
  Parameters<ProfilerOnRenderCallback>[1];

export interface DataTablePerformanceMetrics {
  readonly commitCount: number;
  readonly mountCount: number;
  readonly updateCount: number;
  readonly lastPhase?: DataTablePerformancePhase;
  readonly lastActualDurationMs: number;
  readonly lastBaseDurationMs: number;
  readonly totalActualDurationMs: number;
  readonly averageActualDurationMs: number;
  readonly maxActualDurationMs: number;
}

export const EMPTY_DATA_TABLE_PERFORMANCE_METRICS:
  DataTablePerformanceMetrics = {
    commitCount: 0,
    mountCount: 0,
    updateCount: 0,
    lastActualDurationMs: 0,
    lastBaseDurationMs: 0,
    totalActualDurationMs: 0,
    averageActualDurationMs: 0,
    maxActualDurationMs: 0,
  };

/**
 * Pure accumulator for React Profiler samples.
 *
 * There is deliberately no pass/fail threshold here. Performance decisions
 * must compare repeatable measurements in the same browser/build environment
 * rather than encode machine-specific CI timing limits.
 */
export function recordDataTablePerformanceCommit(
  previous: DataTablePerformanceMetrics,
  phase: DataTablePerformancePhase,
  actualDurationMs: number,
  baseDurationMs: number,
): DataTablePerformanceMetrics {
  const commitCount =
    previous.commitCount + 1;

  const totalActualDurationMs =
    previous.totalActualDurationMs +
    actualDurationMs;

  return {
    commitCount,
    mountCount:
      previous.mountCount +
      (phase === "mount" ? 1 : 0),
    updateCount:
      previous.updateCount +
      (phase === "update" ||
      phase === "nested-update"
        ? 1
        : 0),
    lastPhase: phase,
    lastActualDurationMs:
      actualDurationMs,
    lastBaseDurationMs:
      baseDurationMs,
    totalActualDurationMs,
    averageActualDurationMs:
      totalActualDurationMs /
      commitCount,
    maxActualDurationMs:
      Math.max(
        previous.maxActualDurationMs,
        actualDurationMs,
      ),
  };
}
