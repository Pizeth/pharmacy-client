# DataTable 2.2.3.1 — committed-output diagnosis

Baseline: fetched master `ddb145934609ee379da3a1dfa2ba5e8888bf38fa` (PR #40). Work branch:
`codex/datatable-rerender-diagnosis`. Windows, Codex in-app browser,
development React build, `/dev/datatable/performance`, October 13, 2026.

## Finding

Selection update fan-out is confirmed in the fixture. With 100 rows and eight
columns, changing only row 1 selection commits the subscribed output of every
row and all 800 cells. Narrowing the table owner's subscription alone does not
remove this fan-out. A fixture-only row-specific selection projection reduces
the same action to row 1 and its eight cells.

This is evidence for a bounded subscription/render optimization before adding
virtualization. Production resource selectors and renderer behavior remain at
their existing defaults. No dependency, virtualizer, or core extraction added.

## How the instrumentation works

- Diagnostics are off by default. Only the development fixture supplies the
  internal observer context; normal resources render no commit markers.
- Null DOM markers inside the subscribed body/row/cell output count layout
  effects. These identify committed output, including subscription-child
  commits, rather than counting component-function invocations that React may
  replay or abandon. Mount effects can replay in Strict Mode and are excluded
  by beginning a fresh action window before each operation.
- Each action records affected row IDs and distinct cell identities, plus
  total commits per row. The visible per-row report identifies the affected
  rows and cell count for each row.
- React Profiler duration is recorded per action window, including any
  additional zero-duration commits. It is not a sum of row/cell CPU timings.
- `modelReadMs` times final display-row retrieval, including the TanStack
  pipeline read and pinning-display helper. It includes cached reads and can
  include computation. Strict Mode may execute this read twice. It is **not**
  an exclusive measurement of every internal row-model computation.
- `stateDispatchMs` separately times synchronous state-setter work. Neither
  interval should be subtracted from or added to React duration: they can
  overlap computation and omit work outside their boundaries.
- Instrumentation adds overhead. These durations cannot replace Matrix B's
  uninstrumented baseline or establish production latency/FPS.
- The diagnostic counters currently instrument table output, not card output.
  Row/cell counts refer to `DataTableBodyRow`/`DataTableBodyCell` subscribed
  output; detail-panel cells, headers, and unmounts are not included.

## Default subscription results

One isolated action of each kind, after mounting. All listed row output
commits occurred once per row, and each affected cell output committed once.

| Density | Action | Owner/body commits | Row IDs committed | Distinct cells | React actual total ms | Model-read ms | Dispatch ms |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 25 × 8 | Select row 1 | 1 / 1 | 1–25 | 200 | 333.6 | 0.1 | 1.3 |
| 25 × 8 | Expand row 1 | 1 / 1 | 1–25 | 200 | 136.9 | 0.1 | 1.8 |
| 25 × 8 | Name sort | 1 / 1 | 1–25 | 200 | 123.0 | 0.4 | 1.7 |
| 25 × 8 | Filter Record 0001 | 1 / 1 | 1 | 8 | 132.5 | 1.0 | 1.9 |
| 100 × 8 | Select row 1 | 1 / 1 | 1–100 | 800 | 417.8 | 0.0 | 4.3 |
| 100 × 8 | Expand row 1 | 1 / 1 | 1–100 | 800 | 300.7 | 0.2 | 4.9 |
| 100 × 8 | Name sort | 1 / 1 | 1–100 | 800 | 402.5 | 0.3 | 3.8 |
| 100 × 8 | Filter Record 0001 | 1 / 1 | 1 | 8 | 35.5 | 1.2 | 3.4 |
| 200 × 16 | Select row 1 | 1 / 1 | 1–200 | 3200 | 2242.4 | 0.1 | 28.2 |
| 200 × 16 | Expand row 1 | 1 / 1 | 1–200 | 3200 | 2346.6 | 0.4 | 19.7 |
| 200 × 16 | Name sort | 1 / 1 | 1–200 | 3200 | 2171.4 | 0.7 | 21.5 |
| 200 × 16 | Filter Record 0001 | 1 / 1 | 1 | 16 | 274.3 | 3.3 | 22.4 |

The eight-column cell identities are `name`, `value-1` through `value-6`, and
`status`, for each affected row. The sixteen-column case has `value-1` through
`value-14`. Filtering commits the surviving row's output; removed rows unmount
and do not count as committed rendered row output.

Some exploratory captures overlapped typechecking. Their identity counts are
the primary finding; the following repeated comparison was captured after
typecheck completed, without Jest running.

## Controlled selection comparison

Both modes use the narrow fixture owner selector (global filter only). The
fixture adapts its returned state snapshot to the renderer's existing full
instance type without altering the underlying store or production hook API.
Changing experiment mode remounts the fixture, then each selection operation
starts a new diagnostic window. The same counter instrumentation is present
in both modes.

| Row-selection projection | Repeat | Owner/body commits | Affected rows/cells | React actual total ms | Dispatch ms |
| --- | ---: | --- | --- | ---: | ---: |
| Whole selection object | 1 | 0 / 0 | 100 / 800 | 735.0 | 6.7 |
| Whole selection object | 2 | 0 / 0 | 100 / 800 | 486.3 | 8.6 |
| Whole selection object | 3 | 0 / 0 | 100 / 800 | 766.6 | 6.5 |
| Row 1 selected boolean | 1 | 0 / 0 | 1 / 8 | 17.9 | 6.3 |
| Row 1 selected boolean | 2 | 0 / 0 | 1 / 8 | 10.7 | 4.3 |
| Row 1 selected boolean | 3 | 0 / 0 | 1 / 8 | 15.5 | 3.8 |

There are zero body model reads in these selection windows. This isolates the
row subscription path from body remapping. Returning to the whole-selection
mode restores the all-row/all-cell fan-out. Development timing remains noisy;
the repeated affected-identity difference is stronger evidence than a speedup
percentage.

Expansion and sorting still commit all 100 rows/800 cells with the narrow-owner
and row-specific selection probes enabled. Body remapping remains a separate
target. Filtering to one record changes result membership, so its one-row
commit is expected. No claim is made that every sort/filter commit is redundant.

## Cause and next work

The installed TanStack `Subscribe` uses shallow comparison. Selecting one row
replaces the selection object, so every row selector that returns that entire
object sees a changed value. The installed `useTable` also documents that an
omitted selector subscribes its owner to every registered state slice.

Runtime results confirm that narrowing only the owner is insufficient and that
row-specific selection projection removes the measured selection fan-out when
the owner is also narrow. Cell output follows rerendered row output even though
column state did not change; this does not prove an independent cell-store
notification. Do not blame the column-state subscriber from these results.

Next: 2.2.3.2, controlled production-equivalent profiling, followed by a bounded
optimization comparison. Preserve cross-row mutation guards and custom cell
dependencies: resource actions may legitimately depend on the global selected
count, and select-sticky can also change pinning/body layout. A fixture result
does not automatically validate those resource cases.

Selection projection, row-group/detail subscriptions, and stable row/cell props
are candidate optimization scopes. Prove custom cell content, global selection
policies, pinning offsets, expansion, filtering, sorting, width, focus and RTL
before applying any production optimization. Virtualization remains unapproved.

## Reproduction

1. Open the development fixture; choose Table, 100 rows, eight columns.
2. Enable rerender diagnostics; leave both subscription probes at default.
3. Reset measurement; toggle selection, expansion, sort, and name filter once
   each. Read the per-row report after each settled action.
4. Use narrow owner subscription; reset and repeat.
5. Also use row-specific selection probe; reset and repeat selection three
   times. Return to default row subscription and repeat to confirm fan-out.
6. Disable diagnostics and restore both default subscriptions before running
   the original performance baseline. The fixture remains development-only.

Automated coverage checks action-window reset, unique identities versus repeated
commits, timing/return/error preservation, absence of added DOM nodes, and
uncommitted Suspense output not contributing commit counts.

Validation: typecheck passed; focused DataTable suite passed 93 suites / 522
tests. A concurrent full run hit one existing HRD test's five-second timeout;
the serial full-suite rerun passed 122 suites / 713 tests (151.494 seconds).
No timeout setting or HRD source was changed. Whitespace check passed. Browser
console had no warnings/errors. Disabling diagnostics restores and disables both
subscription probes, preventing the original baseline from retaining a probe.
