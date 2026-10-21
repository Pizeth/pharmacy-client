# Variable-height sticky rows — 2.2.3.4

Base: master `0cb91e2510baf156442bd3ef4f9e0d79da9c2d36`.
Branch: `codex/datatable-sticky-row-heights`. Track A has priority; selection
subscriptions remain unchanged and virtualization remains unapproved.

## Root cause and implementation

The previous renderer multiplied a nominal density height (compact: 37px) by
the sticky row index. Actual TranslationKey rows are 50.8125px, producing the
confirmed 13.8125px overlap. A combined top/bottom ID list could also count rows
from the opposite pin band.

The body now measures only mounted sticky data rows after commit, before paint.
A body-scoped ResizeObserver tracks their border boxes, including wrapping,
content, density and container changes. Mounted-node measurements are retained
across ordinary commits. Modern notifications supply border-box sizes without
layout reads, then apply cumulative fractional heights through existing runtime CSS
variables. No scroll handler, render-time layout read, resource logic, virtualizer,
or second table state store is introduced. Identical CSS values are not rewritten.

Top and bottom bands are independent. Top offsets sum preceding top rows;
bottom offsets sum following bottom rows. Select-sticky also sums following top
rows for its second edge, retaining one physical row per TanStack identity.
Detail panels remain separate rows and are excluded. Final displayed order,
including retained off-page pins, determines stacking. Static top/bottom,
top-and-bottom and selection-static modes retain normal document flow.

The observer disconnects on reconciliation/unmount, ignores late callbacks and
detached rows, and retains no measurements across table/card remounts. Initial
unavailable/zero measurements use the density fallback; a later resize replaces
it. Without ResizeObserver, initial layout is measured but later asynchronous
size changes are not tracked until remount. Modern supported browsers provide it.

## Browser evidence — October 21

Historical before evidence: `datatable-sticky-height-2026-10-20.json` and `.jpg`.
Reverse selection (7 then 10), compact TranslationKey table, scrolled:

| Row | Actual height | Old offset | Measured offset | Actual top | Actual bottom |
| --- | ---: | ---: | ---: | ---: | ---: |
| 10 | 50.8125 | 36 | 36 | 323.921875 | 374.734375 |
| 7 | 50.8125 | 73 | 86.8125 | 374.734375 | 425.546875 |

Observed overlap: **0px**, formerly **13.8125px**. Content geometry was unchanged.
Screenshot: `datatable-sticky-height-2026-10-21.jpg`.
Raw follow-up bounds: `datatable-sticky-height-2026-10-21.json`.
These are local development browser measurements, not production profiling.

| Cases | Result | Browser evidence |
| --- | --- | --- |
| T1–T2 single/equal heights | PASS | First deselection removes its contribution; compact50.8125px pair has0px overlap |
| T3–T4 two/three unequal heights | PASS | Fixture45.03125/65.046875/37px; scrolled bounds touch at416.34375 and481.390625px |
| T5 reverse selection | PASS | Real7 then10 renders10 then7, offsets36/86.8125px |
| T6 first/middle deselection | PASS | Real remaining offset resets to72px in spacious density; fixture middle removal changes row7 offset146.078125→81.03125px |
| T7 sort | PASS | Descending fixture and real query follow displayed order without duplicates or offset overlap |
| T8 filter | PASS | Real auth query settles to1–5 of5; fixture retain=true preserves pins, false leaves matching row2 |
| T9 pagination | PASS | Next page retains selected7/2 once each, with displayed-order offsets36/73px |
| T10 density | PASS | Real spacious rows70.8125px use72/142.8125px offsets; compact restored |
| T11 width/wrapping | PASS | Column280→130px changes row2 height45.03125→125.09375px; next offset81.03125→161.09375px; bounds touch at496.40625px; widening restores offsets |
| T12 container resize | PASS | Real1000/1440 widths and fixture900/420 container preserve measured geometry |
| T13 content | PASS | Heights85.0625/105.078125/65.046875 update offsets36/121.0625/226.140625px |
| T14 detail expansion | PASS | Real and fixture preserve data-row heights; separate panel excluded |
| T15 table/card/table | PASS | Same instance preserves selection and recreates correct measurements |
| T16 RTL | PASS | Vertical offsets unchanged; logical columns change independently |

All seven modes were exercised: sticky/select-sticky use measured geometry;
top/bottom/top-and-bottom/select-top/select-bottom remain computed position
`static`, with variable-height flow and unique IDs. Explicit sticky bands use
independent sums (bottom9 offset37px, bottom4 offset0px), also after filtering
and paging. Automated coverage retains28 mode/keep/direction combinations.
Changing the fixture's keepPinnedRows option needs a row-model change to
invalidate TanStack's cached pin partition; filter/clear preceded the restored
true case. This existing option-cache behavior was not changed.

Headers, pagination and selection toolbar stayed reachable. Two real selections
keep bulk mutation guards disabled. No duplicate IDs, observer loops, unexpected
horizontal overflow or offset-induced scroll jumps were found. Native sticky
rows retain natural-flow gaps until reaching their edge. If pinned heights plus
header exceed viewport height, both bands cannot fit simultaneously; no content
clipping or height cap was introduced. Arbitrarily overfilled bands are not
certified by this repair.

Transient HMR while the component changed shape produced a nested-tbody warning.
Final clean-load verification after all source changes reported **no warnings
or errors**. An earlier logo-position warning predates this fix. Input timeouts
were inspected for settled state before retrying.

## Validation

`npm ci` passed after briefly releasing the repository dev server's Windows SWC
file lock; server restored. Existing peer warnings and five high audit findings
were reported; dependency versions were not changed.
Final focused geometry/pinning/dependency/navigation: **13 suites /81 tests PASS**.
Deterministic tests additionally prove ordinary commits reuse measurements and
border-box notifications update offsets without another bounding-rectangle read.
The new mount test caught a child-layout-effect timing issue; the measurement
owner now owns the tbody ref and measures after its attachment.
Final full suite: **139 suites /796 tests PASS**, serial411.101s, with `--roots src`
as recommended by navigation architecture to exclude generated `.next` files.
Typecheck and `git diff --check` PASS. No assertion or timeout was weakened.
Track A is complete for this protocol. Selection remains deferred (decision C);
see `datatable-selection-dependency-contract.md`.

## Changed files

- `src/components/DataTable/mui/components/DataTableBody.tsx`
- `src/components/DataTable/mui/components/DataTableStickyRowMeasurements.tsx`
- `src/components/DataTable/mui/row-pinning/stickyHeights.ts`
- `src/components/DataTable/mui/components/rowPinning.spec.tsx`
- `src/components/DataTable/mui/components/stickyHeights.spec.tsx`
- `src/components/DataTable/mui/dev/DataTableAcceptance.tsx`
- `src/components/DataTable/mui/dev/DataTableStickyHeightAcceptance.tsx`
- `docs/datatable-roadmap.md`
- `docs/datatable-browser-matrix.md`
- `docs/datatable-virtualization-2-2-3.md`
- `docs/datatable-selection-dependency-contract.md`
- `docs/datatable-sticky-height-2-2-3-4.md`
- `docs/datatable-sticky-height-2026-10-21.json`
- `docs/datatable-sticky-height-2026-10-21.jpg`
- `docs/navbar-responsive-regression-2026-10-20.md`
- `docs/navbar-restoration-2026-10-21.json`
