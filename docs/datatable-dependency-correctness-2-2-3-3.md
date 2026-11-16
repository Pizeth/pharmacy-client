# DataTable 2.2.3.3 — dependency correctness

Baseline: fetched `origin/master` = `5849b8d2db4daf3f5994adf7c178f9769e09d652`,
October 20, 2026. Initial working tree clean. This report describes local changes
on that source; the SHA does not include the changes in this report.

Status: dependency diagnosis and controlled remeasurement COMPLETE;
production rollout BLOCKED (decision C), browser sticky-height recheck FAIL.
No production subscription optimization approved.
Virtualization and draft PR #31 remain separate.

## Dependency inventory

The feature-bound `useMuiDataTable` family, TanStack store and resource hooks
remain authoritative. `table.state` is a hook-selected snapshot; reading an API
or store imperatively inside a callback does not establish a subscription.
Callbacks can read more than their immediate row. Narrowing the fixture owner
removes incidental parent invalidation and therefore exposes that dependency.

| Consumer | Actual reads / invalidation required | Explicit subscription | Narrowing risk / unnecessary work |
| --- | --- | --- | --- |
| Resource table owner | Hook-selected state, options/data, server lifecycle | Default full feature state in TranslationKey and Document | Broad owner invalidation is costly; narrowing changes the snapshot type and can remove implicit callback invalidation. Keep existing hooks. |
| Table body | Final filter/sort/page model, pin partitions, sticky display order, header/filter geometry | Visibility, order, pinning, sorting, pagination, filters, global filter, expansion, row pinning | Pure selection need not remap body; selection-driven pinning still must. Sorting/filtering legitimately change membership/order. |
| Body row | Own selected/pinned paint, final sticky index, column membership, activation closure | Whole selection and pinning; inner visibility/order/column pinning; density context | Unrelated selection is unnecessary for paint alone, but currently invalidates arbitrary descendant cells/actions. Projecting own boolean loses that implicit global dependency. |
| Body cell | Width, logical pinned geometry, visible/order state; arbitrary `columnDef.cell` callback | AppCell selects sizing/visibility/order/pinning; density and theme direction | Custom callback can read global selection without subscribing. Cell invalidation is inherited from row/owner. Column notification fan-out is not established by parent commit counts. |
| Row checkbox | Own selected flag, descendant selection, `getCanSelect` | Selection atom projected to checked/indeterminate/disabled | Predicate can itself read global state. Do not assume just an own-ID boolean covers selection guards. |
| Header checkbox | All/some selectable rows on current page | Whole selection atom plus parent/model invalidation | Global selection dependency is real. Page/filter changes also affect the page model. |
| Row actions | Hidden/disabled/icon callbacks receive full row and table | No independent subscription; table context and ancestor invalidation | A cross-row guard can become stale when the enclosing row stays selected. Existing full-row dependency preserves selection invalidation. |
| Selection bar / bulk actions | Raw selected IDs/count including off-page IDs; loaded rows for mutation guards | Whole selection; owner data lifecycle | Must retain raw count vs loaded-row distinction. TranslationKey requires exactly one selected and one loaded row; no bulk mutation API added. |
| Detail panel | Expanded state, visible colSpan, resource render callback | Expansion, visibility, column pinning | Expansion/model changes are legitimate. Arbitrary callback dependencies remain implicit; this phase does not narrow them. |
| Card list | Same final model; selection, expansion, pinning; resource header/body/detail/actions | Pagination/sorting/filters/global filter/selection/expanded/pinning; density | All-card selection invalidation currently preserves global callbacks. Table-only row projection cannot imply card optimization. |
| Header / resize / logical columns | Sort indicator, filters, visible/order/size/pinning; theme direction | Existing per-header/cell subscriptions and providers | Must preserve RTL logical offsets, resize and keyboard behavior. No selector change proposed. |
| Display preference / persistence | Requested table/card mode, density and visual state | Presentation providers/controller | Must not manufacture a semantic server request; no second selection/query store. |
| TranslationKey resource | Semantic query, Refine-backed Standard API, mutation dialogs, selection safety | Existing controlled hook state and result reconciliation | Off-page raw IDs must not authorize mutation of an unloaded record. HTTP contract unchanged. |
| Document resource | Refine manual filter/sort/page binding and live result reconciliation | Existing feature hook and lifecycle | Preserve canonical result settlement, selected/pinned/expanded ID safety. No resource-specific dependency added to renderer. |

## Correctness protocol

`selectionDependencies.spec.tsx` uses the real feature-bound TanStack hook,
renderer and store. Its narrow owner is the existing fixture-only full-snapshot
adapter, without a type cast or second store. A custom cell reads global selected
count without subscribing, and a normal row action disables at two selections.
The row-projection counterexample is expected to expose stale output; it is not
an acceptance test that endorses stale behavior. Commit markers distinguish
which row output actually commits.

A1–A12 cover select/deselect/multi-select, page select-all/clear, global cells,
cross-row actions, off-page selection, filtering, stable-ID sorting and controlled
external updates. Card action parity is checked separately. The pinning matrix
crosses seven display modes, keepPinnedRows true/false and LTR/RTL, with reverse
selection order, dual-edge offsets, sorting, paging, filtering and deselection.
JSDOM assertions prove identity/order/CSS variables, not browser sticky geometry.

Existing suites remain the regression coverage for resize/order/visibility,
focus/activation exclusion, detail panels, same-instance display switching,
resource mutations and the two Refine integrations. Their results must be
reported after execution, not inferred from source inspection.

## Profiling protocol

The local-only profiling harness now compares default, narrow owner and narrow
owner plus row projection at 25x8, 100x8, 100x16, 200x8, 200x16 table and 100x16,
200x16 card. Probe order rotates between densities. Each case retains one
warm-up and three measured repetitions; it is counterbalanced across cases,
not randomized within a case. No correctness-approved production candidate
exists yet. Ordinary and React profiling builds must remain separate.

Card diagnostics count committed logical rows and body output; cells are null
because cards have no table-cell output. Counts are not speculative renders.
Table diagnostics retain the existing marker semantics. Final model/output
checks and cancellation/visibility/deadline BLOCKED behavior remain in force.

## Validation and decision

Focused execution: A1–A12 and card guard coverage passed (six tests); the
counterexample test confirms the probe commits B but not A, leaving A's count
at one and its action enabled while the live model contains two selections.
Default subscriptions show two and disable the action. All 28 pinning
combinations passed. Typecheck passed after correcting a DOMRect test mock.

Decision **C: not safe to ship the current row-local projection**. Keep existing
production subscriptions. This is a compatible public custom-cell/action
counterexample, not a hypothetical benchmark concern. The current API exposes
arbitrary table reads and contains no declaration that a callback is row-local.

The smallest follow-up contract would retain broad invalidation by default and
allow explicit opt-in dependency declarations for independently subscribed cell,
action, detail and card output. A row-local declaration must never silently
cover a global predicate. A compatible implementation would need global-count
and controlled/off-page tests plus owner snapshot typing before rollout. That
design is not introduced here; no second store, type bypass or feature-hook
replacement is justified by this experiment.

The existing projection remains a diagnostic-only counterfactual. Its simple
fixture can measure local cells, but lower timings cannot approve production
semantics. Performance measurements and browser geometry are recorded separately.

Both production builds completed 21 cases/693 measured actions each, with no
console warnings/errors. Full per-action statistics and raw repeats are in
[the remeasurement report](datatable-performance-2-2-3-3.md). No new speed claim
waives the correctness gate. Full Jest passed 133 suites/779 tests twice; final
standalone typecheck passed. Both optimized builds include successful TypeScript
checks. Final focused DataTable/TranslationKey/Document run passed 98 suites /
563 tests with a fresh cache. Its first attempt raced Next dev's generated
`.next/dev/build/package.json` and exited before running tests; stopping dev and
rerunning resolved it without changing tests or Jest configuration.
`git diff --check` passed. No commit, PR, dependency upgrade or virtualizer added.

## Browser pinning follow-up — FAIL, variable row height

On the restored development server, the real `/admin/i18n` resource loaded 31
records. Selected row 7 first, then row 10 (opposite their display order), and
scrolled the table. Both identities occur exactly once; offsets follow displayed
order (row 10=36px, row 7=73px) rather than click order. Header cells remain sticky
at top 244.25/bottom 280.25; selection/footer controls remain accessible.

However, each selected row is 50.8125px tall because the real translations have
multiple lines. Row 10 bounds 280.25–331.0625, row 7 bounds 317.25–368.0625:
**13.8125px overlap**. The renderer computes offsets from nominal compact density
height 37px in `DataTableBodyRow.tsx`; it does not measure the actual row height.
This is a pre-existing geometry assumption, independent of the selection probe.
The JSDOM tests' 37px CSS-variable assertions do not prove real browser stacking.

Evidence: [geometry](datatable-sticky-height-2026-10-20.json) and
[screenshot](datatable-sticky-height-2026-10-20.jpg). This current follow-up is
not green, even though historical Matrix A completion remains recorded.

The same two selected IDs stay checked in production card mode; bulk edit/delete
remain disabled for two selections. Returned to table and cleared all selections.
No records were created, edited or deleted. Ordinary/React production profiling
consoles were empty; the later dev resource emitted one Next Image warning about
the existing logo.svg fill parent having static positioning, with no errors.

Decision C retains production subscriptions and records this additional blocker.
A scoped follow-up must measure actual pinned-row heights in final display order,
preserve separate detail panels and both sticky edges, and rerun browser geometry
for LTR/RTL and keepPinnedRows combinations. Do not force smaller text or truncate
content to satisfy nominal heights. This proof does not introduce a new geometry
measurement subsystem or silently certify the failing browser case.
