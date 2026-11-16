# DataTable 2.2.3.2 — production-equivalent profiling

Status: COMPLETE; production evidence and all required local validation passed.
Decision **2: bounded optimization helps but virtualization may still be justified**.
No production optimization or virtualization was enabled.

## Baseline and environment

Initial fetched master: 48e881fe67441d9ba8862b8c222daf509fdc05ad.
Measurement source: a0ceb53 on codex/datatable-production-profiling. The user
saved/pushed the harness in that commit during this session. Subsequent master
9b02af0 was inspected: no changes to DataTable, Next config, package files or CI
relative to the initial baseline. Final changes add evidence and deadline tests.

Windows 10.0.26200, Intel i5-1235U, 12 logical CPUs, 15.692 GiB RAM;
Node 24.16.0, Next 16.4.0, React/react-dom 19.3.0, MUI 7.3.11,
TanStack Table 9.2.6, TypeScript 7.0.2. Chrome 153 in Codex's in-app browser,
1440x900. Browser track DPR approximately 1; React track DPR 1.25.
The runs use https://local-hr.razeth.com through the existing local proxy.
No tests, builds or installs ran during samples; other host activity was not
instrumented. No CPU/network throttling was applied.

The initial install mismatch/extraction blocker was resolved by one successful
npm ci after coordination. Missing lucide typings and stale generated dev route
types were repaired. The working npm entry point is C:/Program Files/nodejs/npm.cmd.
Sandboxed tsx had an OS user-info failure; approved unsandboxed commands work.
These were environment failures, not renderer stalls.

## No-code profiling gate and reproduction

Production subscriptions, public types, resource/HTTP policies and dependencies
must remain unchanged in this phase. The existing owner/row probes are fixture
experiments. Do not promote them until global dependency correctness is proven.

Run npm ci and npm run typecheck. Build separately with:

```text
node scripts/datatable-profile.mjs build browser
node scripts/datatable-profile.mjs start browser 8080
node scripts/datatable-profile.mjs build react
node scripts/datatable-profile.mjs start react 8080
```

Only one server may occupy 8080. The helper uses next build, adding --profile
only for react, and next start bound to 127.0.0.1. Separate build/datatable-browser
and build/datatable-react outputs avoid corrupting .next. Each start prints a
fresh random access token; use it on /dev/datatable/profiling. Both build-time
opt-in and matching runtime mode plus the token are required. Normal builds
remain closed even if runtime flags are supplied; no-token production access
was observed as Not Found. Access-gate tests cover denial and exact matching.
Do not deploy these opt-in builds. The existing development server was temporarily
replaced with the user's approval and restored after validation (npm run dev,
port8080; GET /dev/datatable/performance returned200). The viewport override was reset.

## Protocol and limitations

One discarded warm-up and three recorded repetitions per action. Normal/stress
tracks disable committed-output diagnostics. The three comparison variants use
identical diagnostics, ordered default, owner-only, then owner plus row projection.
No randomized/counterbalanced order: causal commit reduction is stronger evidence
than the precise latency ratio. Raw samples are in the three adjacent JSON files;
the appendix calculates median, mean and maximum without discarding outliers.

Mount is a controlled fixture remount, including previous fixture disposal,
React scheduling, and two animation frames. It is not cold navigation, SSR or
hydration. Interactions dispatch table APIs and wait two frames; these are
responsiveness proxies, not native input INP or exact paint/FPS measurements.
DOM element counts are read after timing. Long-task observations overlap action
windows and can count the same task more than once; they are not session totals.
[Long Task API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming)
reports long main-thread tasks, not exclusive layout/paint cost.

React timings are summed Profiler actualDuration in the separate --profile build.
[React Profiler](https://react.dev/reference/react/Profiler) adds overhead. Never
subtract these from ordinary browser timings or compare the two as identical
workloads. Missing callbacks are null, including scroll actions; normal production
has no React timing samples. Diagnostic counts measure committed output, not
speculative function invocation or DOM mutations.

Normal timings drifted substantially (100x8 was slower than 100x16; 200x16 mount
ranged 399.7–1417.3 ms). JIT, GC, thermal and external host load were not isolated.
Do not infer monotonic scaling, exact speedup factors or universal budgets from
these three samples. Stable commit vectors and the separate React comparison
support the bounded architectural decision despite that timing limitation.

## Stop conditions

Stop on incorrect output, hidden/cancelled page, a 15-second action/frame deadline,
or sustained browser unresponsiveness; retain partial samples as BLOCKED and
recover to 25x8. Permit only one recovery after a diagnosed environment issue.
1000x32 is enabled after 500x16 passes and every recorded action stays below five
seconds. Warm-ups are discarded and are not part of that five-second eligibility
check; they still have the 15-second deadline. No largest-case retry loop.
A browser observation briefly timed out during 1000x32, but the existing run
completed all actions within its deadline; it was not restarted or fabricated.

## Normal production results

All eight normal cases passed: 39 measured samples each. Selection, expansion,
sort order, filtered row count, and same-store table/card switching were checked.
Switching preserved seeded selection and expansion. These synthetic checks do not
replace resource-specific cross-row policy acceptance.

| Case | Mount median ms | Select median ms | Mounted elements / rows / cells / cards |
| --- | ---: | ---: | --- |
| 25x8 table | 182.7 | 99.0 | 371 / 25 / 200 / 0 |
| 25x8 card | 130.2 | 71.0 | 431 / 0 / 0 / 25 |
| 100x8 table | 460.7 | 321.4 | 1046 / 100 / 800 / 0 |
| 100x16 table | 178.1 | 141.0 | 1982 / 100 / 1600 / 0 |
| 100x16 card | 132.5 | 81.1 | 1706 / 0 / 0 / 100 |
| 200x8 table | 209.8 | 156.6 | 1946 / 200 / 1600 / 0 |
| 200x16 table | 692.5 | 744.5 | 3682 / 200 / 3200 / 0 |
| 200x16 card | 684.1 | 494.4 | 3406 / 0 / 0 / 200 |

Cards render a subset of fixture fields; a 16-column card case does not mount
16 values per card. Vertical scroll moved in every case. Horizontal overflow
exists at 16/32 table columns (observed offsets 904/3144); eight-column table
and card horizontal samples are **N/A/no-op**, not horizontal-scroll certification.
No continuous native scrolling, FPS trace or layout CPU breakdown was captured.

## Controlled subscription comparison

Six cases passed in ordinary production and again in the React profiling build,
33 measured actions per case in each build. All triplets are retained.

| Case / experiment | Browser select median ms | Owner/body/row/cell commits | React select median ms |
| --- | ---: | --- | ---: |
| 100x8 default | 269.6 | 1 / 1 / 100 / 800 | 120.4 |
| 100x8 owner | 138.4 | 0 / 0 / 100 / 800 | 96.5 |
| 100x8 row | 18.7 | 0 / 0 / 1 / 8 | 3.6 |
| 200x16 default | 509.9 | 1 / 1 / 200 / 3200 | 399.9 |
| 200x16 owner | 480.4 | 0 / 0 / 200 / 3200 | 373.5 |
| 200x16 row | 42.0 | 0 / 0 / 1 / 16 | 3.4 |

Commit vectors were identical across repeats in both builds. Narrow owner alone
removes owner/body commits but leaves every independently subscribed row/cell.
Row projection removes that selection fan-out, confirming the previous diagnosis
under production-equivalent conditions. It does not establish that arbitrary
custom cells or resource actions can safely ignore global state.

Expansion and sorting still commit all rows/cells in every experiment. At 200x16
row projection, browser expansion median is 464.9 ms and descending sort 636.3 ms;
React medians are 370.4 and 379.4 ms respectively. Body remapping/stable props and
render boundaries remain candidates, not measured exclusive causes. Ordering
and expanded content legitimately change; not every full-list commit is waste.
Inclusive model-read maximum was 6.3 ms in the ordinary comparison. It includes
cached/final display/pinning reads, not an isolated sort/filter CPU profile.
No evidence here attributes the remaining cost specifically to layout or proves
independent cell-store notification as the cause.

## Separate stress evidence

Both stress cases passed 33 recorded actions; no mode-switch stress was requested.
500x16 maximum recorded action 1533.9 ms qualified the 1000x32 run.

| Case | Mount median / mean / max ms | Select median / mean / max ms | Elements / cells | Max observed long task ms |
| --- | --- | --- | --- | ---: |
| 500x16 | 1519.5 / 1514.4 / 1533.9 | 1073.2 / 1112.0 / 1210.1 | 8782 / 8000 | 1499 |
| 1000x32 | 3881.2 / 3962.6 / 4291.1 | 3610.5 / 3622.3 / 4347.7 | 33554 / 32000 | 4362 |

Large mounted trees coincide with multi-second work. This supports retaining
virtualization as a possible later option, not declaring DOM/layout dominance.
Stress completion is not a normal-density responsiveness pass. The historical
development stress blocker remains historical; this production run completed.

## Implementation and validation

Only an opt-in production fixture, access gate/helper, same-instance fixture
callback and measurement/deadline tests were added. Existing probes are reused.
Normal renderer defaults, feature-bound createTableHook, public contracts and
resource policies are unchanged. No virtualizer or new dependency was added.
The user's a0ceb53 also preserves installation lockfile metadata changes.

Both isolated production builds and the final ordinary npm run build passed.
The ordinary production profiling URL displayed Not Found. Final validation:

- npm run typecheck: PASS.
- npm run test:datatable -- --runInBand: 95 suites, 526 tests PASS (143.566 s).
- npm test -- --runInBand: 124 suites, 717 tests PASS (194.71 s).
- git diff --check: PASS.
- GitHub Actions: consult the final PR checks for the exact head SHA; CI is
  verified separately after push, and must pass before merging.

Browser comparison console error/warning capture was empty in both builds.
Access tests cover the disabled normal-build mode; timer tests cover two-frame
settling, timeout cancellation and unavailable-statistics semantics.

## Decision and exact next phase

Bounded selection optimization helps, but does not solve expansion/sort/mount
costs. Proceed to 2.2.3.3 dependency correctness proof before production rollout;
virtualization stays conditional. Further counterbalanced profiling and layout
traces are needed before attributing residual cost or choosing a virtualizer.

Proposed 2.2.3.3 is **bounded selection-dependency correctness proof**, supported by the production comparison above. Its scope is to
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


## Complete action statistics

All cells are median / mean / maximum milliseconds, computed from the raw triplets.
No-op horizontal intervals are retained for audit but are not scroll measurements.

### Ordinary normal

| Case | Action | Median / mean / maximum ms |
| --- | --- | --- |
| 25x8 table | mount | 182.7 / 180.7 / 192.7 |
| 25x8 table | select | 99.0 / 102.2 / 123.2 |
| 25x8 table | deselect | 116.5 / 116.2 / 116.8 |
| 25x8 table | expand | 132.7 / 127.5 / 133.0 |
| 25x8 table | collapse | 117.5 / 117.1 / 133.1 |
| 25x8 table | sort-desc | 115.9 / 122.0 / 134.5 |
| 25x8 table | sort-asc | 136.4 / 139.2 / 148.9 |
| 25x8 table | filter | 53.3 / 67.1 / 101.7 |
| 25x8 table | clear-filter | 149.2 / 142.4 / 163.4 |
| 25x8 table | scroll-vertical | 32.7 / 32.3 / 33.3 |
| 25x8 table | scroll-horizontal | 33.0 / 33.1 / 33.3 |
| 25x8 table | switch-card | 127.6 / 123.8 / 130.0 |
| 25x8 table | switch-table | 152.6 / 145.6 / 165.2 |
| 25x8 card | mount | 130.2 / 129.8 / 131.0 |
| 25x8 card | select | 71.0 / 75.2 / 85.4 |
| 25x8 card | deselect | 82.9 / 83.9 / 86.1 |
| 25x8 card | expand | 83.1 / 81.9 / 83.3 |
| 25x8 card | collapse | 83.1 / 83.1 / 83.2 |
| 25x8 card | sort-desc | 99.5 / 94.4 / 100.2 |
| 25x8 card | sort-asc | 100.2 / 111.5 / 135.0 |
| 25x8 card | filter | 33.4 / 33.9 / 36.5 |
| 25x8 card | clear-filter | 117.1 / 120.3 / 127.8 |
| 25x8 card | scroll-vertical | 32.9 / 32.9 / 33.6 |
| 25x8 card | scroll-horizontal | 33.1 / 33.1 / 33.2 |
| 25x8 card | switch-table | 168.3 / 168.5 / 185.7 |
| 25x8 card | switch-card | 116.1 / 116.9 / 133.5 |
| 100x8 table | mount | 460.7 / 422.0 / 476.9 |
| 100x8 table | select | 321.4 / 321.3 / 322.0 |
| 100x8 table | deselect | 299.8 / 319.5 / 358.8 |
| 100x8 table | expand | 353.1 / 387.4 / 475.7 |
| 100x8 table | collapse | 353.2 / 339.8 / 366.6 |
| 100x8 table | sort-desc | 373.5 / 402.6 / 463.9 |
| 100x8 table | sort-asc | 410.8 / 404.6 / 416.6 |
| 100x8 table | filter | 73.9 / 74.1 / 85.4 |
| 100x8 table | clear-filter | 389.7 / 421.5 / 490.9 |
| 100x8 table | scroll-vertical | 23.1 / 25.1 / 31.9 |
| 100x8 table | scroll-horizontal | 32.6 / 32.8 / 33.2 |
| 100x8 table | switch-card | 412.2 / 329.0 / 442.7 |
| 100x8 table | switch-table | 395.6 / 326.8 / 457.1 |
| 100x16 table | mount | 178.1 / 187.4 / 209.7 |
| 100x16 table | select | 141.0 / 154.8 / 189.9 |
| 100x16 table | deselect | 133.0 / 154.9 / 199.4 |
| 100x16 table | expand | 133.5 / 155.3 / 199.9 |
| 100x16 table | collapse | 149.7 / 157.0 / 183.5 |
| 100x16 table | sort-desc | 229.1 / 217.9 / 257.0 |
| 100x16 table | sort-asc | 226.0 / 224.7 / 250.5 |
| 100x16 table | filter | 55.4 / 63.8 / 86.3 |
| 100x16 table | clear-filter | 157.3 / 183.8 / 254.9 |
| 100x16 table | scroll-vertical | 26.6 / 24.9 / 27.4 |
| 100x16 table | scroll-horizontal | 33.2 / 32.6 / 36.7 |
| 100x16 table | switch-card | 111.2 / 123.1 / 147.6 |
| 100x16 table | switch-table | 182.5 / 187.8 / 207.4 |
| 100x16 card | mount | 132.5 / 137.4 / 161.2 |
| 100x16 card | select | 81.1 / 87.9 / 105.5 |
| 100x16 card | deselect | 113.8 / 109.8 / 115.9 |
| 100x16 card | expand | 83.1 / 88.6 / 99.9 |
| 100x16 card | collapse | 83.2 / 110.6 / 165.4 |
| 100x16 card | sort-desc | 99.5 / 112.7 / 150.4 |
| 100x16 card | sort-asc | 94.7 / 112.7 / 151.2 |
| 100x16 card | filter | 30.9 / 29.4 / 33.4 |
| 100x16 card | clear-filter | 99.9 / 116.5 / 149.7 |
| 100x16 card | scroll-vertical | 33.1 / 33.0 / 33.1 |
| 100x16 card | scroll-horizontal | 33.1 / 33.3 / 33.9 |
| 100x16 card | switch-table | 190.5 / 193.0 / 206.6 |
| 100x16 card | switch-card | 124.8 / 126.9 / 134.2 |
| 200x8 table | mount | 209.8 / 210.6 / 212.2 |
| 200x8 table | select | 156.6 / 160.4 / 168.5 |
| 200x8 table | deselect | 149.5 / 155.0 / 166.5 |
| 200x8 table | expand | 151.9 / 156.4 / 166.6 |
| 200x8 table | collapse | 165.7 / 165.6 / 166.2 |
| 200x8 table | sort-desc | 202.2 / 200.7 / 209.1 |
| 200x8 table | sort-asc | 281.4 / 260.8 / 294.6 |
| 200x8 table | filter | 44.0 / 43.5 / 51.1 |
| 200x8 table | clear-filter | 185.3 / 188.8 / 204.2 |
| 200x8 table | scroll-vertical | 30.5 / 34.5 / 49.0 |
| 200x8 table | scroll-horizontal | 32.8 / 29.3 / 32.9 |
| 200x8 table | switch-card | 233.3 / 233.9 / 251.5 |
| 200x8 table | switch-table | 197.1 / 196.1 / 203.9 |
| 200x16 table | mount | 692.5 / 836.5 / 1417.3 |
| 200x16 table | select | 744.5 / 658.4 / 965.4 |
| 200x16 table | deselect | 632.0 / 655.2 / 964.4 |
| 200x16 table | expand | 551.7 / 656.0 / 1129.1 |
| 200x16 table | collapse | 664.1 / 734.8 / 1115.4 |
| 200x16 table | sort-desc | 1374.0 / 1180.4 / 1447.1 |
| 200x16 table | sort-asc | 1300.2 / 1148.8 / 1501.9 |
| 200x16 table | filter | 178.7 / 147.7 / 195.7 |
| 200x16 table | clear-filter | 1416.3 / 1217.4 / 1544.2 |
| 200x16 table | scroll-vertical | 66.1 / 66.3 / 72.6 |
| 200x16 table | scroll-horizontal | 29.2 / 29.4 / 32.6 |
| 200x16 table | switch-card | 814.9 / 689.1 / 863.9 |
| 200x16 table | switch-table | 1589.7 / 1260.2 / 1632.1 |
| 200x16 card | mount | 684.1 / 710.4 / 825.8 |
| 200x16 card | select | 494.4 / 419.5 / 538.0 |
| 200x16 card | deselect | 600.6 / 598.2 / 614.7 |
| 200x16 card | expand | 521.3 / 529.4 / 566.7 |
| 200x16 card | collapse | 532.2 / 542.5 / 590.9 |
| 200x16 card | sort-desc | 645.7 / 542.5 / 651.7 |
| 200x16 card | sort-asc | 600.0 / 513.5 / 662.6 |
| 200x16 card | filter | 66.2 / 59.9 / 75.3 |
| 200x16 card | clear-filter | 809.9 / 664.7 / 834.4 |
| 200x16 card | scroll-vertical | 29.2 / 28.9 / 32.1 |
| 200x16 card | scroll-horizontal | 29.9 / 29.6 / 31.7 |
| 200x16 card | switch-table | 1587.9 / 1233.9 / 1602.3 |
| 200x16 card | switch-card | 857.1 / 679.3 / 874.1 |

### Ordinary controlled comparison

| Case | Action | Median / mean / maximum ms |
| --- | --- | --- |
| 100x8 default | mount | 362.5 / 355.4 / 492.2 |
| 100x8 default | select | 269.6 / 265.9 / 372.8 |
| 100x8 default | deselect | 266.1 / 332.9 / 500.7 |
| 100x8 default | expand | 316.1 / 326.4 / 497.8 |
| 100x8 default | collapse | 223.9 / 296.5 / 516.3 |
| 100x8 default | sort-desc | 300.0 / 344.5 / 550.8 |
| 100x8 default | sort-asc | 225.6 / 272.9 / 422.2 |
| 100x8 default | filter | 65.3 / 65.8 / 87.3 |
| 100x8 default | clear-filter | 233.2 / 245.5 / 334.9 |
| 100x8 default | scroll-vertical | 31.1 / 30.0 / 32.9 |
| 100x8 default | scroll-horizontal | 32.6 / 30.7 / 32.9 |
| 200x16 default | mount | 681.2 / 731.4 / 859.0 |
| 200x16 default | select | 509.9 / 532.8 / 600.5 |
| 200x16 default | deselect | 482.8 / 487.6 / 499.5 |
| 200x16 default | expand | 467.1 / 489.0 / 534.0 |
| 200x16 default | collapse | 500.5 / 509.7 / 531.8 |
| 200x16 default | sort-desc | 656.9 / 663.2 / 713.8 |
| 200x16 default | sort-asc | 613.4 / 668.0 / 786.7 |
| 200x16 default | filter | 103.7 / 97.8 / 106.8 |
| 200x16 default | clear-filter | 615.7 / 609.6 / 617.5 |
| 200x16 default | scroll-vertical | 44.8 / 44.6 / 52.0 |
| 200x16 default | scroll-horizontal | 36.7 / 39.2 / 64.2 |
| 100x8 owner | mount | 194.8 / 194.4 / 195.1 |
| 100x8 owner | select | 138.4 / 155.9 / 202.2 |
| 100x8 owner | deselect | 135.8 / 136.6 / 143.3 |
| 100x8 owner | expand | 148.0 / 145.6 / 158.8 |
| 100x8 owner | collapse | 132.8 / 134.2 / 137.2 |
| 100x8 owner | sort-desc | 170.1 / 169.7 / 172.1 |
| 100x8 owner | sort-asc | 193.3 / 191.9 / 198.4 |
| 100x8 owner | filter | 51.7 / 51.7 / 59.4 |
| 100x8 owner | clear-filter | 168.8 / 174.0 / 186.8 |
| 100x8 owner | scroll-vertical | 31.0 / 30.8 / 33.0 |
| 100x8 owner | scroll-horizontal | 32.9 / 32.9 / 32.9 |
| 200x16 owner | mount | 709.4 / 707.2 / 760.0 |
| 200x16 owner | select | 480.4 / 490.4 / 523.1 |
| 200x16 owner | deselect | 463.4 / 459.1 / 465.6 |
| 200x16 owner | expand | 432.5 / 438.0 / 449.2 |
| 200x16 owner | collapse | 451.0 / 489.5 / 567.3 |
| 200x16 owner | sort-desc | 606.6 / 618.0 / 642.2 |
| 200x16 owner | sort-asc | 698.1 / 728.2 / 817.8 |
| 200x16 owner | filter | 106.7 / 106.8 / 107.8 |
| 200x16 owner | clear-filter | 605.5 / 597.2 / 623.5 |
| 200x16 owner | scroll-vertical | 42.5 / 42.7 / 57.7 |
| 200x16 owner | scroll-horizontal | 39.4 / 35.8 / 42.1 |
| 100x8 row | mount | 182.8 / 192.0 / 212.1 |
| 100x8 row | select | 18.7 / 18.9 / 21.0 |
| 100x8 row | deselect | 33.1 / 33.1 / 33.3 |
| 100x8 row | expand | 149.7 / 145.6 / 154.4 |
| 100x8 row | collapse | 147.0 / 143.3 / 149.8 |
| 100x8 row | sort-desc | 182.9 / 180.0 / 189.2 |
| 100x8 row | sort-asc | 182.4 / 195.5 / 222.5 |
| 100x8 row | filter | 44.7 / 45.2 / 46.9 |
| 100x8 row | clear-filter | 165.5 / 184.3 / 237.3 |
| 100x8 row | scroll-vertical | 32.0 / 31.7 / 32.9 |
| 100x8 row | scroll-horizontal | 32.8 / 32.3 / 33.1 |
| 200x16 row | mount | 620.9 / 624.6 / 636.2 |
| 200x16 row | select | 42.0 / 39.4 / 43.6 |
| 200x16 row | deselect | 38.6 / 41.3 / 49.7 |
| 200x16 row | expand | 464.9 / 469.6 / 500.0 |
| 200x16 row | collapse | 497.4 / 527.9 / 601.9 |
| 200x16 row | sort-desc | 636.3 / 637.7 / 650.9 |
| 200x16 row | sort-asc | 653.7 / 672.6 / 728.2 |
| 200x16 row | filter | 95.5 / 96.7 / 103.2 |
| 200x16 row | clear-filter | 676.4 / 655.2 / 694.8 |
| 200x16 row | scroll-vertical | 38.1 / 41.2 / 51.1 |
| 200x16 row | scroll-horizontal | 32.9 / 30.6 / 34.1 |

### Ordinary stress

| Case | Action | Median / mean / maximum ms |
| --- | --- | --- |
| 500x16 table | mount | 1519.5 / 1514.4 / 1533.9 |
| 500x16 table | select | 1073.2 / 1112.0 / 1210.1 |
| 500x16 table | deselect | 1132.2 / 1110.6 / 1150.1 |
| 500x16 table | expand | 1301.2 / 1290.0 / 1334.0 |
| 500x16 table | collapse | 1150.8 / 1081.6 / 1241.2 |
| 500x16 table | sort-desc | 1396.6 / 1352.6 / 1499.8 |
| 500x16 table | sort-asc | 1364.0 / 1296.9 / 1425.1 |
| 500x16 table | filter | 155.5 / 159.0 / 171.6 |
| 500x16 table | clear-filter | 1329.8 / 1252.7 / 1371.4 |
| 500x16 table | scroll-vertical | 37.5 / 37.3 / 41.4 |
| 500x16 table | scroll-horizontal | 38.2 / 39.1 / 43.3 |
| 1000x32 table | mount | 3881.2 / 3962.6 / 4291.1 |
| 1000x32 table | select | 3610.5 / 3622.3 / 4347.7 |
| 1000x32 table | deselect | 3203.1 / 3213.6 / 3314.4 |
| 1000x32 table | expand | 3392.6 / 3401.8 / 3583.7 |
| 1000x32 table | collapse | 3212.3 / 3464.2 / 4135.5 |
| 1000x32 table | sort-desc | 4161.1 / 3881.2 / 4181.7 |
| 1000x32 table | sort-asc | 3762.7 / 3754.9 / 3844.8 |
| 1000x32 table | filter | 322.5 / 328.8 / 353.3 |
| 1000x32 table | clear-filter | 3384.0 / 3678.9 / 4373.0 |
| 1000x32 table | scroll-vertical | 51.6 / 56.0 / 66.6 |
| 1000x32 table | scroll-horizontal | 42.4 / 46.8 / 55.8 |

### React actual duration (separate profile build)

| Case | Action | Median / mean / maximum ms |
| --- | --- | --- |
| 100x8 table default | mount | 154.1 / 147.1 / 156.1 |
| 100x8 table default | select | 120.4 / 123.0 / 130.8 |
| 100x8 table default | deselect | 142.0 / 138.1 / 161.4 |
| 100x8 table default | expand | 127.6 / 127.1 / 135.8 |
| 100x8 table default | collapse | 127.0 / 126.7 / 127.1 |
| 100x8 table default | sort-desc | 118.5 / 118.9 / 124.8 |
| 100x8 table default | sort-asc | 115.6 / 114.8 / 118.7 |
| 100x8 table default | filter | 19.5 / 20.5 / 22.9 |
| 100x8 table default | clear-filter | 130.8 / 131.7 / 150.7 |
| 100x8 table default | scroll-vertical | unavailable |
| 100x8 table default | scroll-horizontal | unavailable |
| 200x16 table default | mount | 468.1 / 496.6 / 603.9 |
| 200x16 table default | select | 399.9 / 411.9 / 447.7 |
| 200x16 table default | deselect | 422.4 / 411.8 / 425.3 |
| 200x16 table default | expand | 418.2 / 445.3 / 516.1 |
| 200x16 table default | collapse | 405.0 / 414.6 / 457.8 |
| 200x16 table default | sort-desc | 412.5 / 424.7 / 464.4 |
| 200x16 table default | sort-asc | 414.1 / 413.2 / 421.5 |
| 200x16 table default | filter | 29.9 / 29.9 / 32.3 |
| 200x16 table default | clear-filter | 417.1 / 420.8 / 436.3 |
| 200x16 table default | scroll-vertical | unavailable |
| 200x16 table default | scroll-horizontal | unavailable |
| 100x8 table owner | mount | 131.9 / 143.2 / 168.8 |
| 100x8 table owner | select | 96.5 / 98.7 / 105.4 |
| 100x8 table owner | deselect | 96.8 / 97.5 / 101.9 |
| 100x8 table owner | expand | 105.4 / 114.3 / 140.6 |
| 100x8 table owner | collapse | 94.6 / 100.3 / 113.1 |
| 100x8 table owner | sort-desc | 111.7 / 112.7 / 115.9 |
| 100x8 table owner | sort-asc | 117.3 / 117.2 / 121.4 |
| 100x8 table owner | filter | 16.0 / 16.1 / 17.1 |
| 100x8 table owner | clear-filter | 112.0 / 111.9 / 113.0 |
| 100x8 table owner | scroll-vertical | unavailable |
| 100x8 table owner | scroll-horizontal | unavailable |
| 200x16 table owner | mount | 429.9 / 429.7 / 430.2 |
| 200x16 table owner | select | 373.5 / 371.8 / 377.4 |
| 200x16 table owner | deselect | 355.5 / 358.7 / 370.4 |
| 200x16 table owner | expand | 360.9 / 379.1 / 416.5 |
| 200x16 table owner | collapse | 359.7 / 361.9 / 372.6 |
| 200x16 table owner | sort-desc | 400.2 / 394.7 / 400.8 |
| 200x16 table owner | sort-asc | 399.0 / 412.9 / 449.5 |
| 200x16 table owner | filter | 35.2 / 34.9 / 40.3 |
| 200x16 table owner | clear-filter | 411.1 / 408.8 / 418.4 |
| 200x16 table owner | scroll-vertical | unavailable |
| 200x16 table owner | scroll-horizontal | unavailable |
| 100x8 table row | mount | 132.8 / 135.4 / 148.9 |
| 100x8 table row | select | 3.6 / 3.2 / 3.7 |
| 100x8 table row | deselect | 1.2 / 1.5 / 2.2 |
| 100x8 table row | expand | 100.3 / 99.1 / 105.6 |
| 100x8 table row | collapse | 109.1 / 106.7 / 111.1 |
| 100x8 table row | sort-desc | 119.1 / 117.5 / 129.7 |
| 100x8 table row | sort-asc | 126.6 / 124.4 / 129.7 |
| 100x8 table row | filter | 15.9 / 15.6 / 16.7 |
| 100x8 table row | clear-filter | 122.9 / 119.8 / 125.1 |
| 100x8 table row | scroll-vertical | unavailable |
| 100x8 table row | scroll-horizontal | unavailable |
| 200x16 table row | mount | 431.2 / 431.9 / 434.7 |
| 200x16 table row | select | 3.4 / 3.4 / 3.5 |
| 200x16 table row | deselect | 3.2 / 11.1 / 27.3 |
| 200x16 table row | expand | 370.4 / 367.1 / 376.9 |
| 200x16 table row | collapse | 370.4 / 370.6 / 389.8 |
| 200x16 table row | sort-desc | 379.4 / 383.3 / 394.1 |
| 200x16 table row | sort-asc | 386.9 / 389.0 / 395.5 |
| 200x16 table row | filter | 28.0 / 29.9 / 36.4 |
| 200x16 table row | clear-filter | 403.3 / 423.6 / 471.6 |
| 200x16 table row | scroll-vertical | unavailable |
| 200x16 table row | scroll-horizontal | unavailable |
