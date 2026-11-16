# DataTable 2.2.3.3 — controlled remeasurement

Status: ordinary-production and separate React profiling COMPLETE.
These are fixture measurements, not approval to ship the row-local projection.
[The correctness proof](datatable-dependency-correctness-2-2-3-3.md) rejects that
rollout because global cell/action dependencies become stale.

## Source and environment

Fetched baseline SHA `5849b8d2db4daf3f5994adf7c178f9769e09d652`, plus the local
changes recorded in this task. No commit was created; do not describe these as
measurements of an unmodified committed checkout. Node24.16.0, Next16.4.2,
React/react-dom19.3.1, MUI7.3.11, TanStack9.3.1, TypeScript7.0.2.
Windows, Codex in-app Chrome155, 1440x900, DPR1, eight reported logical CPUs.
This differs from the October14 host/browser/dependency environment; do not
attribute cross-date timing differences to code alone.

Measured source SHA256:

| File | SHA256 |
| --- | --- |
| ProductionProfiling.tsx | FD726E4312C438B4DC1EBD0CAE93096B82542EDFF1C679A12058754BC2EF5C06 |
| DataTableCardView.tsx | 3CEF9DA6EC7B7F36746BC5BC9B7D1F7DAAD4A7BEBB5F386B7E8C1E2CE1CAD4A8 |
| DrawerAppBar.tsx | 6083B2591CEEA85615F5983DEC5873508D0A4ECBFA150BC1537F7538C1B014F0 |
| useHeaderScrollState.ts | A176DC06CC929F7F1EC19FFE97492A868D50D3A5C46E77CEF26AA544F9176252 |

## Protocol

Use the existing local-only gated build/start script described in
`datatable-performance-2-2-3-2.md`. Ordinary build and React `--profile` build
remain isolated. No tests, installs or builds run during samples. No CPU/network
throttling is configured; other host activity and thermal/JIT/GC drift are not
isolated. This is one browser on one machine, not a latency SLA.

The comparison covers all seven requested densities/modes and all three probes
(21 cases). Each case has one discarded warm-up and three measured repeats of
mount, select, deselect, expand, collapse, sort-desc, sort-asc, filter,
clear-filter, vertical scroll and horizontal scroll. Probe order rotates across
cases, rather than always measuring default first. It is not randomized within
a density, so order/host drift can remain. No production candidate exists.
All comparison variants enable identical committed-output diagnostics; these
are instrumented production-build comparisons, not an uninstrumented latency
baseline. The separate React build additionally enables React Profiler timing.

Elapsed time is dispatch-to-two-animation-frames, not INP or exact paint time.
React actualDuration is separately summed per action and is never merged with
ordinary elapsed time. Committed output counts describe unique identities;
owner/body counts describe commits. Model-read timing includes cached/final
pipeline and pinning reads, not exclusive row-model CPU time. Cards record body
and logical row commits; table-cell commits are null. DOM counts remain distinct
from output commits. Table/card fixtures have different resource output density.

PASS means this fixture's final selection/detail/sort/filter/scroll output was
correct and its run stayed visible, uncancelled and within the deadline. It does
not mean arbitrary global callbacks are safe under the projection. Existing
BLOCKED stop conditions remain; no 500/1000-row stress rerun was necessary for
the dependency decision.

## Ordinary production

All 21 cases PASS, 33 measured actions each, 693 total. No warning/error logs.
Raw repeats, DOM counts, commit vectors and environment are retained in
[the ordinary evidence](datatable-performance-2-2-3-3-browser.json).

Selection elapsed milliseconds, median / mean / maximum:

| Case | Default | Narrow owner | Owner + row projection |
| --- | ---: | ---: | ---: |
| 25x8 table | 61.2 / 64.5 / 72.6 | 41.2 / 42.2 / 47.7 | 24.8 / 25.5 / 30.9 |
| 100x8 table | 171.3 / 168.7 / 175.0 | 138.7 / 133.6 / 144.4 | 19.4 / 22.9 / 30.5 |
| 100x16 table | 260.1 / 285.2 / 338.1 | 305.8 / 284.5 / 308.3 | 37.0 / 35.8 / 37.7 |
| 200x8 table | 292.5 / 309.8 / 358.3 | 247.5 / 246.0 / 255.3 | 30.7 / 28.3 / 31.8 |
| 200x16 table | 461.9 / 472.5 / 500.0 | 467.8 / 468.0 / 520.3 | 41.9 / 41.0 / 47.3 |
| 100x16 card | 109.0 / 116.5 / 132.3 | 115.4 / 116.2 / 119.0 | 110.9 / 124.4 / 163.6 |
| 200x16 card | 219.5 / 216.9 / 231.5 | 199.4 / 203.9 / 215.6 | 196.5 / 196.0 / 197.3 |

Every table selection repeat shows all rows/cells under default or owner-only
(25/200,100/800,100/1600,200/1600,200/3200). Row projection shows one row with
8 or16 cells. Owner-only removes owner/body selection commits but not row/cell
fan-out. Card selection retains all100/200 logical rows in every probe: the
table-specific projection has no equivalent effect on the card subscription.
These stable vectors support the diagnosis, not safe generic rollout.

## React profiling

All 21 cases PASS, 33 measured actions each, 693 total. No warning/error logs.
[Raw React evidence](datatable-performance-2-2-3-3-react.json) preserves every
repeat. [Complete per-action statistics](datatable-performance-2-2-3-3-statistics.json)
contains 462 case/action records across both builds with median/mean/max,
DOM counts and committed-output vectors, including deselection, expansion,
sorting and filtering. Null React timings for scroll are not zero.

React selection actualDuration milliseconds, median / mean / maximum:

| Case | Default | Narrow owner | Owner + row projection |
| --- | ---: | ---: | ---: |
| 25x8 table | 38.9 / 39.0 / 41.0 | 24.5 / 24.6 / 25.2 | 2.0 / 2.1 / 2.3 |
| 100x8 table | 150.3 / 146.1 / 150.5 | 103.7 / 102.4 / 103.8 | 3.0 / 3.0 / 3.5 |
| 100x16 table | 219.6 / 221.5 / 229.7 | 185.9 / 189.0 / 197.9 | 3.4 / 3.4 / 3.6 |
| 200x8 table | 238.9 / 239.8 / 263.2 | 224.8 / 224.8 / 244.4 | 2.4 / 2.4 / 2.6 |
| 200x16 table | 386.1 / 386.3 / 390.2 | 371.7 / 390.8 / 445.1 | 3.1 / 3.9 / 5.7 |
| 100x16 card | 82.3 / 81.8 / 82.4 | 79.0 / 79.5 / 80.9 | 81.8 / 81.9 / 86.4 |
| 200x16 card | 169.6 / 175.2 / 193.5 | 185.7 / 193.3 / 211.3 | 153.9 / 154.6 / 156.1 |

Commit vectors match the ordinary build. At 200x16 with the row probe, deselect
commits 1 row/16 cells (React median 2.1ms), while expand/sort still commit 200/3200
(expand median 361.8ms; sort-desc 392.0ms). Filtering to one record commits 1/16;
clear-filter restores 200/3200. Those broad commits reflect valid final-model
changes and are not classified as redundant from counts alone.

## Conclusion and limits

The repeated local-cell fixture improvement is supported by both commit vectors
and timings. It still cannot authorize generic rollout: the adversarial test
proves stale global callbacks, and a subsequent production-resource browser
spot-check found variable-height selected-row overlap. See the dependency report.
No production selection optimization or virtualizer was added. Development
server restored on 8080 and viewport override reset. The development fixture's
diagnostic caption was corrected after capture to describe card instrumentation;
no measured workload code changed in that caption-only edit.
