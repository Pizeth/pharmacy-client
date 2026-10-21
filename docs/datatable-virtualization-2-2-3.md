# Conditional DataTable virtualization architecture — 2.2.3

Status: architecture review justified by October 13 Matrix B; no virtualization
implementation or dependency introduced.

## October 21 — geometry repair, selection gate preserved

2.2.3.4 Track A repairs the measured13.8125px sticky-row overlap using mounted
data-row heights and independent edge sums. See the [repair record](datatable-sticky-height-2-2-3-4.md).
This does not change production selection subscriptions or resolve their
dependency gate. Decision C remains; the [contract notes](datatable-selection-dependency-contract.md)
define prerequisites for later opt-in work. Existing2.2.3.3 profiling evidence
is retained without a costly rerun. No virtualization implementation is approved.

## October 20 — dependency gate outcome

The 2.2.3.3 real-table adversarial proof rejects rollout of the current row-local
diagnostic projection: selecting a second row can leave the first row's global
count cell and mutation guard stale. Production subscriptions remain unchanged
(decision C). See [the dependency report](datatable-dependency-correctness-2-2-3-3.md).
An explicit compatible callback-dependency contract needs separate design before
selection narrowing can ship. Fixture performance reductions cannot waive this
gate or approve a virtualizer; full-model sort/expansion costs remain separate.
The real resource browser also shows 13.8125px selected-row overlap from nominal
37px sticky offsets applied to 50.8125px rows. Record that geometry blocker and
measure actual pinned heights before certifying variable-height pinning.

## October 14 — production evidence and recommendation

Decision **2: bounded optimization helps but virtualization may still be justified**.
See [2.2.3.2 report](datatable-performance-2-2-3-2.md) for separate ordinary
production and React-profile measurements. Selection fan-out is confirmed:
200x16 default commits 200 rows/3200 cells, owner-only still commits all of them,
row projection commits one row/16 cells. React selection median falls from399.9
ms to3.4 ms. Expansion/sort still commits the full list. Large stress DOM counts
coincide with multi-second work but do not isolate layout or prove virtualization
is the right solution. Absolute browser timings drift; no universal SLA claimed.

No production optimization or virtualizer was enabled. First complete2.2.3.3:
prove compatible row-local/global dependencies, custom cells, resource action
policies, off-page selection and selected-row pinning/keepPinnedRows. Repeat
counterbalanced production measurements after correctness. Residual rendering,
body remapping and layout require separate attribution before virtualization.
Keep the existing feature-bound hook family and public resource contracts.
PR #31 extraction stays separate. Earlier development evidence follows.

## Evidence and limits

Measured the existing development-only React Profiler fixture on Windows in the
Codex in-app browser. The tested checkout is master `b2a2950` plus the tested
client-pagination fix on `codex/datatable-matrix-a-closeout`.

| Rows × columns | Mode | Average actual duration | Maximum actual duration |
| --- | --- | ---: | ---: |
| 25 × 8 | Table | 118.04 ms | 296.70 ms |
| 25 × 8 | Card | 80.31 ms | 166.20 ms |
| 100 × 16 | Table | 831.78 ms | 1511.40 ms |
| 100 × 16 | Card | 256.42 ms | 434.40 ms |
| 200 × 16 | Table | 1166.43 ms | 1709.70 ms |
| 200 × 16 | Card | 520.15 ms | 751.80 ms |
| 100 × 8 | Table diagnostic | 356.67 ms | 544.40 ms |
| 200 × 8 | Table diagnostic | 769.67 ms | 1032.50 ms |

Each interaction sample includes the clean mount, three selection/expansion/two
sort cycles, and the fixture's additional commits. Eight-column diagnostics
reduce the risk of deciding solely from the denser sixteen-column fixture.
The fixture executes locally: these timings contain no API request latency.

The 500 × 16 table averages 2701.14 ms. The 1000 × 32 clean mount takes
15839.40 ms and repeated browser observation/input deadlines prevent completion
of its interaction protocol. Those stress findings are supporting evidence.

These are development-mode measurements on one machine, not production timing
thresholds or real backend datasets. Current resource defaults are 25 rows;
100/200 are reachable page-size choices. Production profiling remains necessary
before choosing the implementation and rollout policy.

## Decision

Proceed to conditional 2.2.3 architecture review. The reachable 100/200-row
densities show material renderer cost, so closing 2.2 by declaring all normal
densities responsive would contradict the evidence. Matrix B's stress
interaction completion remains blocked and recorded in the matrix.

## Bounded implementation path

1. Profile the production/profiling build at the same 25/100/200 densities. Find
   whether unnecessary whole-table subscriptions or parent rerenders dominate.
   Compare a bounded rerender optimization before choosing a virtualizer.
2. If costly mounted rows remain the dominant cause, add optional vertical row
   virtualization inside the MUI presentation layer. Keep the current renderer
   as the default and reference path. Avoid simultaneous column virtualization.
3. Feed virtualization the existing TanStack final display order and stable row
   identities. Preserve the shared query, selection, expansion, and persistence
   controllers; do not add a separate data/query model.
4. Keep sticky header and selected/pinned-row bands outside the scrolling window
   where required. Remove those identities from the ordinary virtual range to
   prevent duplicate rows or unexplained gaps. Preserve keepPinnedRows=false
   and off-page selection semantics.
5. Support variable row and expanded-detail heights through measured rendered
   items and scroll anchoring. Density changes and detail expansion must
   invalidate height estimates without losing selection or focus.
6. Preserve logical start/end pinned columns, intrinsic/native width geometry,
   horizontal scroll, RTL, fullscreen, and the fixed shared footer.
7. Keyboard navigation must bring the target row into the rendered range before
   transferring focus. Maintain accessible table semantics and total/index
   information when rows are omitted from the DOM.
8. Treat cards separately. Their costs differ from the table, and no card
   virtualization should follow automatically from a table decision. Preserve
   flip focus/inert behavior and explicit touch controls.

## Acceptance before rollout

- Repeat the baseline and compare mount/update/DOM counts at the same densities.
- Prove selection, pinning, expansion, resize, width, sorting, filters,
  pagination, persistence, row activation, and fullscreen through Matrix A.
- Verify LTR/RTL and all densities, keyboard focus, narrow layouts, and card
  switching without manufacturing transport requests.
- Establish production evidence of improvement, not only smaller DOM counts.
- Keep Refine and resource field knowledge outside the renderer.

PR #31 stays draft/donor. The core/MUI extraction remains separate from this
bounded performance work; do not mechanically merge the extraction branch.

## 2.2.3.1 — rerender diagnosis (October 13)

Committed-output measurements and the repeatable fixture probes are documented
in `docs/datatable-rerender-diagnosis-2-2-3-1.md`. Selection fan-out is confirmed:
at 100×8, whole-selection row subscriptions commit every row and all 800 cells,
even with a narrow table-owner subscription. A fixture-only row-specific
projection commits only row 1 and its eight cells. Expansion/sorting still
commit the full displayed list; independent cell-store notifications are not
proven. Timed model reads are cached/inclusive reads, not exclusive pipeline
CPU attribution. Production selector behavior remains unchanged.

Proceed next to 2.2.3.2 production-equivalent profiling and a bounded optimization
comparison; virtualization implementation remains unapproved.
