# DataTable 2.2.3.2 — production-equivalent profiling

Status: BLOCKED at environment gate; phase incomplete. No production
optimization or virtualization approved.

Baseline: fetched `origin/master` and local `master` both resolve to
`48e881fe67441d9ba8862b8c222daf509fdc05ad` on October 14, 2026. Initial working
tree was clean. Previous evidence: `datatable-rerender-diagnosis-2-2-3-1.md`.

## No-code profiling gate

Do not change production subscriptions, render boundaries, public types,
resource policies, HTTP contracts, or dependencies to improve performance in
this phase. First establish a lockfile-matched production build, a safely gated
local fixture, and repeatable baseline measurements. Only optional fixture
instrumentation and its access gate may change before that evidence exists.
The existing row/owner probes remain experiments, not production defaults.
If environment setup fails, stop at an evidence/blocker report rather than
expanding into unrelated application repairs.

## Measurement protocol and stop conditions

- Run normal production browser timings separately from `next build --profile`
  React timings. Normal React production does not supply Profiler callbacks;
  absent samples are unavailable, never zero-duration work.
- Record actual installed versions, build command, commit, browser, viewport,
  hardware, diagnostics/probe settings and background load. Do not run Jest,
  typecheck, builds or dependency installation during browser samples.
- One discarded warm-up and three measured repetitions per case/action.
  Report raw samples, median, mean and maximum. Mount means a clean fixture
  remount; report navigation/hydration separately if measured.
- Normal matrix: 25x8 table/card; 100x8 table; 100x16 table/card; 200x8 table;
  200x16 table/card. Measure select/deselect, expand/collapse, both sort
  directions, filter/clear, vertical/horizontal scroll and mode switching.
  Switching must retain the same table instance; the existing fixture key
  includes display mode and therefore currently measures remount instead.
- Keep 500x16 table stress separate. Attempt 1000x32 only after 500x16
  completes without a timeout or an action taking over five seconds.
- Stop a case after a 15-second action/observation deadline, a browser error,
  incorrect output, or loss of responsiveness. Preserve partial observations,
  mark the missing action BLOCKED and recover to 25x8. Do not average missing
  values or repeatedly retry the largest case.
- Bound recovery to one retry after correcting an identified environment
  issue. Stop the affected measurement track if the same failure recurs.
- Gate optimization comparison on a stable baseline. Compare default,
  narrow-owner-only, and narrow-owner plus row-selection projection with
  identical instrumentation. Do not compare instrumented durations with the
  earlier uninstrumented development baseline.
- DOM counts and committed row/cell identities are separate from browser
  latency and React actual duration. Model reads include cached retrieval and
  pinning-display work; they are not exclusive sorting/filtering CPU time.
- Stop this phase before production integration if custom global-state cells,
  cross-row actions or selected-row pinning require a broader dependency
  contract. Carry that work into 2.2.3.3 with explicit acceptance criteria.

## Initial architecture review

The body subscribes to ordering, filtering, pagination, expansion, column and
row pinning, then maps the final display rows. It does not directly subscribe
to selection. Each row subscribes to the entire selection object by default;
the fixture projection returns only that row's selected boolean. Cells subscribe
to column state but also render through their parent row. Narrow owner alone
cannot eliminate independent row notifications. The owner uses the existing
feature-bound `createTableHook()` family; its type contract must remain intact.

Expansion changes body and detail subscriptions; sorting may legitimately
change physical row order and pinned offsets. Card view has its own whole-list
selection/expansion subscription and renders only a subset of synthetic column
content. A 16-column card case is not 16 mounted values per card. Global
selection bars and TranslationKey actions depend on global counts; a fixture
projection is not proof that those consumers can stop updating.

Existing regression coverage includes row-pinning cross-feature tests,
selection safety, sorting/filtering, pagination, RTL, resize geometry, card
switching, persistence and detail panels. CI runs typecheck, full serial Jest,
and whitespace checks on master pushes and pull requests; it does not build
production or enforce timing thresholds.

## Environment observations

- Windows PowerShell, Node 24.16.0. The `npm.ps1` shim initially failed with
  missing `C:\Users\MCS\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js`.
  Calling `C:\Program Files\nodejs\npm.cmd` works.
- Sandboxed prebuild failed in `tsx` with `uv_os_get_passwd` / ENOMEM. The
  approved unsandboxed build passed feature generation and started compilation.
- Installed Next 16.3.6 and TanStack React Table 9.2.4 differed from committed
  lockfile versions 16.4.0 and 9.2.6. That build was stopped before using it as
  evidence; `npm ci` was started to establish the committed dependency baseline.
- Installed Next CLI documentation exposes `next build --profile`; its
  additional overhead must be labeled. The current route returns `notFound()`
  outside development. Its counters update through Profiler callbacks, so
  merely opening the route in an ordinary production build is insufficient.
- `npm ci` subsequently emitted many `TAR_ENTRY_ERROR ENOENT` extraction
  warnings. Process inspection found this task's `npm ci` (PID 24812) and a
  separate `npm i` (PID 16588). The second process's working directory was not
  established, so concurrent writes to this repository are suspected, not
  proven. This task stopped its own install and asked for coordination; it
  did not stop the other process. The other installer remained active and
  `node_modules/typescript/bin/tsc` was absent at the last check.

## Results and validation at the stop point

| Required case | Production mount/interactions | React commits / DOM / long tasks |
| --- | --- | --- |
| 25x8 table and card | BLOCKED: dependency/build gate | Not measured |
| 100x8 table | BLOCKED: dependency/build gate | Not measured |
| 100x16 table and card | BLOCKED: dependency/build gate | Not measured |
| 200x8 table | BLOCKED: dependency/build gate | Not measured |
| 200x16 table and card | BLOCKED: dependency/build gate | Not measured |
| 500x16 table stress | BLOCKED: normal baseline unavailable | Not measured |
| 1000x32 conditional stress | Not attempted: prerequisite unmet | Not measured |

No browser timing samples were collected. The available browser surface is
Codex's in-app browser; no profiling page was launched because no valid
production build was established. No medians, averages or maxima are available.
This is an environment blocker, not evidence of a DataTable renderer stall.

`npm run typecheck`, `npm run test:datatable -- --runInBand`, and
`npm test -- --runInBand` are BLOCKED/not run against the incomplete installation.
`git diff --check` passed. No new instrumentation or behavior was implemented,
so no new focused instrumentation tests exist. The prebuild generator produced
only line-ending churn, which was removed; application source is unchanged.
No commit/push or new GitHub Actions run is claimed. The checkout remains on
`master` at the baseline SHA above, with documentation edits for resumption.

## Decision

**3. Evidence remains insufficient; further profiling is required.** This is an
interim decision while environment setup is blocked, not phase completion.
No new performance numbers or production speedup claims.

The development evidence confirms selection subscription fan-out, including
its causal reduction through the fixture projection. It does not establish
production interaction latency, DOM/layout dominance, or the sufficiency of
bounded optimization. Body remapping, stable props and expansion boundaries
remain candidates; current inclusive model-read timings cannot attribute their
exclusive cost. Sorting/filtering may require full-list work.

## Exact continuation and proposed 2.2.3.3

Finish 2.2.3.2 first:

1. Resolve the concurrent dependency installation, run one successful `npm ci`,
   and verify installed versions against the lockfile.
2. Establish ordinary and React-profiling production builds. Keep diagnostic
   access disabled by default, use a distinct local output directory and a
   loopback-only server, and verify the normal production route returns 404.
   A Host-header check alone is not a sufficient exposure boundary.
3. Add only the missing fixture timing/reporting capability, with unavailable
   metrics labeled explicitly. Preserve same-instance mode switches. Test gate
   denial and collector semantics before measuring.
4. Execute the bounded matrix above with raw repeat samples. Compare the three
   existing subscription modes at 100x8 and 200x16 using equal instrumentation.
5. Run typecheck, focused DataTable tests, full serial Jest and whitespace
   validation. Commit/push only the validated work and verify Actions for that
   exact commit. Do not label the phase complete without repeatable evidence.

Proposed 2.2.3.3 is **bounded selection-dependency correctness proof**, conditional
on that production comparison confirming a useful improvement. Its scope is to
design an explicit dependency boundary for row-local versus global-state cell
content and row actions, then prove it before changing defaults. Keep the current
feature-bound hook and public resource contracts. Acceptance requires:

- Global selected counts and off-page selections remain correct; selecting a
  second row updates first-row mutation guards and custom global-state cells.
- Every selected-row pinning mode, `keepPinnedRows` setting, filter/page
  transition and pin offset remains correct without duplicate physical rows.
- Sorting, filtering, pagination, expansion/details, resize, logical pinning,
  LTR/RTL, keyboard focus, and same-instance table/card persistence pass existing
  regressions plus focused tests for the new dependency contract.
- Identical production measurement conditions show fewer unnecessary committed
  outputs and a repeatable latency benefit at 100/200 rows, without regressions
  at 25 rows. Timing is evidence, not a hardware-specific CI threshold.
- If a compatible dependency boundary cannot be demonstrated, retain current
  production defaults and document the broader proposal. Virtualization and
  PR #31 extraction remain outside this phase.
