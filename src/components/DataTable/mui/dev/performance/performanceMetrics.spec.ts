import {
  EMPTY_DATA_TABLE_PERFORMANCE_METRICS,
  recordDataTablePerformanceCommit,
} from "./performanceMetrics";

describe(
  "DataTable performance metrics",
  () => {
    it(
      "accumulates mount and update profiler samples without applying machine-specific thresholds",
      () => {
        const mounted =
          recordDataTablePerformanceCommit(
            EMPTY_DATA_TABLE_PERFORMANCE_METRICS,
            "mount",
            12,
            20,
          );

        const updated =
          recordDataTablePerformanceCommit(
            mounted,
            "update",
            8,
            18,
          );

        expect(updated).toEqual({
          commitCount: 2,
          mountCount: 1,
          updateCount: 1,
          lastPhase: "update",
          lastActualDurationMs: 8,
          lastBaseDurationMs: 18,
          totalActualDurationMs: 20,
          averageActualDurationMs: 10,
          maxActualDurationMs: 12,
        });
      },
    );

    it(
      "counts nested updates as updates",
      () => {
        const metrics =
          recordDataTablePerformanceCommit(
            EMPTY_DATA_TABLE_PERFORMANCE_METRICS,
            "nested-update",
            5,
            7,
          );

        expect(
          metrics.updateCount,
        ).toBe(1);

        expect(
          metrics.mountCount,
        ).toBe(0);
      },
    );
  },
);
