# DataTable 2.2.3.5 — independent selection output contracts

October 22, 2026. **Outcome B — Contract established, rollout deferred.**
This is a correctness milestone, not a completed production optimization.

## Source and scope

Base: `9b75b0372938767d01874f43cc0bd401011a7a40`, fetched `origin/master`;
branch `codex/datatable-selection-dependencies`. The original working tree was
clean. Windows, Node24.16.0, npm11.14.1, installed TanStack9.3.1, Next16.4.2.
The earlier139-suite/796-test record is historical, not this master's test count.

New code consists of an internal experimental output boundary, a development-only
acceptance route/fixture, and adversarial tests. Production renderer, public
barrels, feature-bound hook, resource code, transport and sticky measurements are
unchanged. No dependency, virtualizer, environment, HRD/navigation or PR #31 change.

## Production dependency ownership

| Output | Actual dependency and existing invalidation |
| --- | --- |
| Table owner | `useMuiDataTable` defaults to the full state snapshot; React table context follows that wrapper |
| Body | Sorting, pagination, filters, expansion, pinning/columns; inherits owner invalidation for other changes |
| Selected row paint | Own ID is sufficient for paint, but current whole-selection row subscription also invalidates arbitrary descendants |
| Row checkbox | Independently subscribes to selection atom, projects checked/indeterminate/eligibility; eligibility may be global |
| Header checkbox | Page/global selection and eligibility, independently subscribed |
| Selection bar / bulk actions | Raw selected identities/count, loaded rows and resource policy; independently subscribed, count includes unloaded IDs |
| Custom cell | Arbitrary; AppCell subscribes to column sizing/visibility/order/pinning, selection-dependent content normally inherits row/owner updates |
| Row actions | Hidden/disabled policies can read any row, aggregate, external policy or `table.state`; normally inherit row/React context invalidation |
| Row activation | Event callback can read global/external inputs; no local declaration inferred from its row parameter |
| Expansion/detail | Independent expansion/column subscription; arbitrary callback invocation itself has no independent selection subscription |
| Card header/body/metadata/actions/detail | Card list independently subscribes to full selection; each callback may have different dependencies; table column locality cannot authorize card narrowing |
| Selected pin bands | Selection coordination, row pinning and final sorted/filtered/page model; physical heights remain body-scoped |
| Filtered count | Selection plus filtered model; cannot replace raw selected identities/count |
| Off-page count | Raw authoritative selection includes IDs absent from current loaded/filtered/page models |

The installed `useTable` returns a selected `state` snapshot, while core methods
and `store.get()` read live state. Its stable AppTable provider uses the actual
hook wrapper. `Object.assign({}, subscribed, {state: subscribed.store.get()})`
in an experimental fixture does **not** repair that provider's state contract.
This distinction is observed in tests/browser, not inferred from commit counts.

## Implemented experimental type contract

`mui/diagnostics/SelectionDependencyBoundary.tsx` is deliberately absent from
public MUI barrels and production integrations. It accepts the real feature-bound
`Subscribe` component, a `render: () => ReactNode`, and a discriminated declaration:

```ts
type Dependency =
  | { selectionDependency: "row"; rowId: string }
  | { selectionDependency?: "global"; rowId?: never };
```

Undeclared output subscribes to the complete authoritative state. The explicit
local variant excludes only other rows' selection: it projects all non-selection
state plus `Boolean(rowSelection[rowId])`. React memoization uses ordinary prop
comparison, with no comparator that silently drops external inputs. A local
renderer must have a stable callback whose dependency list contains every
external input; a changed render callback, source, row ID or normal React context
still invalidates it. TypeScript describes the promise; it cannot prove that an
arbitrary closure never reads another row. Each consumer therefore needs proof.

There is no copied selection state or second store. Global descendants have
their own subscriptions and update beneath a local parent that skips its commit.
Counts, explicit other-row dependencies and filtered models deliberately use the
broad path; no speculative public selector taxonomy was introduced.

## Critical adversarial evidence

The existing `selectionDependencies.spec.tsx` unsafe-projection counterexample is
retained unchanged. The new suite uses the actual MUI renderer and feature-bound
hook, with layout-effect commit markers and DOM assertions alongside model state.

After A is selected, select B:

| Two-row / seven-column fixture | Full-owner/default row subscriptions | Experimental owner/row + independent outputs |
| --- | ---: | ---: |
| Owner committed | 1 | 0 |
| Body committed | 1 | 0 |
| Unique row IDs committed | a,b | b |
| Unique physical table cells committed | 14 | 7 |
| A own-selection output committed | 0 | 0 |
| A global-count output committed | 1 | 1 |
| A nested global output committed | 1 | 1 |
| A displayed global/nested counts | 2 / 2 | 2 / 2 |
| A live-store aggregate guard | disabled | disabled |

The default fixture already uses the experimental local output for its explicit
own-selection column; its global cell, other-row callback and action are legacy
unwrapped callbacks. Thus14→7 compares physical renderer subscription fan-out;
it is not a comparison of untouched production resources or a latency benchmark.
In card mode both card row IDs commit, physical table-cell commits are zero, and
the explicit own-selection output on A still skips B while global A becomes2.
No component render-function invocation is counted as a committed output.

### Remaining blockers are executable negative proofs

1. **D6 callback snapshot:** an existing action reading
   `table.state.rowSelection ?? {}` stays enabled with two selections under the
   narrowed owner, despite independent action rerenders and live count2. The
   hook-provided context has the narrowed shape. The default owner disables it.
   Without the defensive empty fallback, an existing full-snapshot callback can
   throw instead. Changing consumers to live reads is not backward compatibility.
2. **D21 card snapshot:** switch to cards before selecting A/B. Broad card commits
   still display callback snapshot0 versus raw/live2. Default displays2 and
   disables the guard. Switching modes after selecting can incidentally refresh
   the adapter and hide the bug, so the test fixes the operation order explicitly.
3. **D19 nullable detail:** expand A while the callback returns null for zero
   selection, then select A. Default shows detail1; experimental mode stays empty.
   An unmounted descendant cannot install its own subscription. The callback
   invocation needs its own boundary, preserving null/false/undefined semantics.

These tests intentionally assert the observed diagnostic failures. Green Jest
means the gates remain enforced; it does **not** mean these variants are safe.

## Complete dependency matrix

`selectionDependencyContract.spec.tsx` groups related IDs without replacing DOM
checks with snapshots. "Scoped PASS" means explicitly wrapped fixture outputs,
not generic production approval. Negative probes above remain rollout failures.

| ID | Default/reference result | Explicit-output experiment |
| --- | --- | --- |
| D1 | Selected paint and own output PASS | Scoped PASS |
| D2 | Deselection resets paint/count/guard PASS | Scoped PASS |
| D3 | A+B selected state PASS | Scoped PASS |
| D4 | Explicit local A output skips B PASS | A row and local parent also skip; nested global updates |
| D5 | Legacy global-count A becomes2 PASS | Independent global A becomes2 PASS |
| D6 | Cross-row action disabled PASS | Live-store scoped PASS; existing snapshot callback FAIL |
| D7 | A reads B selection PASS | Undeclared boundary broad PASS |
| D8 | Undeclared legacy callback remains current PASS | Boundary defaults broad PASS; not automatic coverage of every callback |
| D9 | Page select-all/checked/count/IDs PASS | Scoped PASS |
| D10 | Page clear retains d/unloaded IDs PASS | Scoped PASS |
| D11 | Raw off-page/unloaded IDs and count PASS | Scoped PASS |
| D12 | Raw2 versus filtered0 PASS | Scoped PASS |
| D13 | Descending order retains selected stable d ID PASS | Scoped PASS |
| D14 | Filter membership / retained selection PASS | Scoped PASS |
| D15 | Controlled external A+B/clear PASS | Scoped PASS (controlled React owner also invalidates) |
| D16 | External policy toggles action with count0 PASS | Scoped PASS |
| D17 | Global eligibility changes B checkbox and model PASS | Scoped PASS |
| D18 | Expansion state/detail retained PASS | Explicit detail output PASS |
| D19 | Selected count in detail PASS; nullable callback PASS | Explicit mounted output PASS; nullable invocation FAIL |
| D20 | Same-instance table/card/table retains selection/actions PASS | Scoped PASS |
| D21 | Card count and legacy snapshot PASS | Live-store output PASS; legacy snapshot FAIL |
| D22 | Explicit card own output skips B; global updates PASS | Scoped PASS; whole card list remains broad |
| D23 | Reverse selected IDs retain final display order/pin identity PASS | Scoped PASS; unchanged geometry suites and real resource check apply |
| D24 | RTL logical start pin survives selection PASS | Scoped PASS; browser logical pin/resize/narrow check recorded below |
| D25 | Hidden/reordered cells retain current output PASS | Scoped PASS |
| D26 | Renderer remount current; unmount leaves no output commits PASS | Scoped PASS |

Top/bottom/dual-edge, retention, different heights, density/wrapping/resize and
sort/filter/page coverage remain in the existing pinning/measurement suites.
Those production files were not changed; this phase does not replay the entire
historical geometry matrix or claim new physical-device coverage.

## Browser acceptance

Windows IAB Chrome155.0.0.0, development server,1101×884 and420×884; no physical
touch/pen/emulated-device claim. Normal desktop viewport restored afterwards.

- Table live-store probe: A then B gives raw/global/nested2, other-row text
  "B selected", disabled guards. Two37px physical rows meet at294.875px.
- Card probe: B updates global/nested/detail A to2 and disables its action.
- Snapshot blocker: cards mounted before A/B produce live2/snapshot0/enabled
  guard; identical production-default protocol produces2/2/disabled.
- Page select-all/clear and Space selection work. Sort and filter to Bravo keep
  raw selected a/count1 while filtered selected count0. With keepPinnedRows true,
  selected a remains a pinned displayed row even when absent from filtered model.
- RTL: hide other column, resize Name180→172 with keyboard, pin Name to logical
  start with keyboard menu activation, select B then A. Selected IDs stay a,b;
  pinned Name cells remain172px. Pointer activation sometimes only focused the
  control; fresh inspection and keyboard activation confirmed actual changes.
-420px RTL: table940px inside403px scrolling container; global2/guard disabled.
  Same selected state/count/guard remains current in narrow card presentation.
- Actual TranslationKey: select10 then7. Single selected row10 Edit is enabled;
  with two selections bulk Edit/Delete are disabled. Existing per-row actions
  retain their selected-row policy (they are not aggregate-only actions).
  After scrolling583px, row10 bounds323.921875–374.734375; row7 bounds
  374.734375–425.546875. Both heights50.8125px; offsets36/86.8125px; overlap0.
  Table/card/table retains selection and bulk guards; cleared/restored afterwards.
- Actual `/admin/documents?display=table` fixture: independent Refine search
  DOC-0001 yields1–1 of1; Document No. sorting, card switch and Refresh retain
  that result; clear returns1–25 of60, next page26–50 of60. First page restored.
  This existing Document UI has no selection/action controls: browser mutation
  guard/selection certification for Document is N/A, not fabricated.
- Fixture console warnings/errors: none. Resource pages: no errors, existing
  logo.svg parent-position warning only. No destructive mutation was performed.

Evidence:

- [Live card output](evidence/datatable-selection-2-2-3-5/card-live-output.jpg)
- [Experimental callback blocker](evidence/datatable-selection-2-2-3-5/card-snapshot-blocker.jpg)
- [Default callback reference](evidence/datatable-selection-2-2-3-5/card-default-snapshot-pass.jpg)
- [Narrow RTL table](evidence/datatable-selection-2-2-3-5/rtl-narrow-table.jpg)
- [Narrow RTL cards](evidence/datatable-selection-2-2-3-5/rtl-narrow-card.jpg)
- [Real sticky row bounds](evidence/datatable-selection-2-2-3-5/translation-key-sticky.jpg)
- [Document filtered card](evidence/datatable-selection-2-2-3-5/document-card-filter.jpg)

## Resource and automated validation

Existing TranslationKey suites cover controlled selection, canonical replacements,
semantic query transitions, unloaded IDs, select-sticky continuity, one-loaded-row
mutation eligibility and named Refine/Standard API contracts. Document suites use
the independent fixture DataProvider/Refine binding for manual query transitions,
refresh/live reconciliation and actual MUI rendering. They remain on production
subscriptions. No claim is made that either resource adopted the experimental API.

`npm ci` PASS after releasing the exact repository Next processes that held the
Windows SWC lock; development server restored. Existing peer/deprecation/audit
warnings were not addressed with unrelated dependency updates.

Validation:

| Command / scope | Result |
| --- | --- |
| `npm run typecheck` | PASS, including feature synchronization and TypeScript |
| Focused old/new dependency suites | 2 suites /21 tests PASS (15 new tests; old6 retained) |
| `npm run test:datatable -- --runInBand --roots src` | 100 suites /584 tests PASS |
| `npm test -- --runInBand --roots src` | 138 suites PASS /4 FAIL;811 tests PASS /8 FAIL (142 suites /819 total) |
| Four failing suites rerun independently | Same8 failures,6 passes; no new fixture imported |
| `git diff --check` | PASS |

The eight full-suite failures are in unchanged baseline code:
`HrdHomePage.spec.tsx` (5), `HrdFaq.spec.tsx` (1), `hrdThemeSlots.spec.tsx` (1),
and `textfieldInteraction.spec.tsx` (1). HRD styles assume CSS-variable/custom-shadow
theme values absent from their test themes; the multiline adornment expectation
also fails. A path-restricted `git diff HEAD` confirms no HRD, input, package,
lockfile, Jest config or setup changes. Re-running just those four suites reproduces
the failures without importing the new dependency fixture. Do not weaken tests or
change unrelated navigation/theme/input code to claim green. The PR remains draft;
full-suite failure is not waived. Raw summaries are retained in
[validation evidence](evidence/datatable-selection-2-2-3-5/validation.txt).

Independent final review checked source/state ownership, stable callback inputs,
nullable-slot preservation, non-selection invalidation, exact commit windows,
cleanup and development-only gating. No production caller imports the experimental
boundary; only its fixture does. GitHub CI/review status is checked separately
against the pushed head and reported with the PR; local correctness probes do not
substitute for CI.

## Rollout decision and next gate

**B — Contract established, rollout deferred.** Independent output subscriptions
are viable and tested; generic owner/row narrowing is not compatible yet.
No correctness-approved production candidate exists, so the task's conditional
expensive seven-density profiling rerun is intentionally skipped. Historical
2.2.3.2–3 timings remain unchanged; no new latency, speedup or SLA claim.

The smallest next milestone is a compatible live callback-context contract and
independent subscriptions around callback **invocation**, including nullable
detail and each card slot. Prove that without a fake full-state adapter or
rewriting legacy callbacks to store reads. Preserve normal external-input
invalidation and empty-slot behavior. Then integrate per-output declarations,
rerun all negative probes as positive acceptance, and only then perform the
counterbalanced ordinary/React profiling matrix. Virtualization remains unapproved.
