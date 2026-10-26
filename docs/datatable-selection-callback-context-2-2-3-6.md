# DataTable 2.2.3.6 — callback context and nullable output

October 26, 2026. **Outcome B — internal contract proven; production integration deferred.**

## Source and reproduction

Fetched origin/master: 9367b7ec00bfec0f2ca340a6bdb2dca39818ed0c (updated footer).
The user's primary checkout contained extensive uncommitted application work;
all milestone changes are isolated in codex/datatable-live-callback-context.
The four existing D6/D21/D19 negative probes passed before changes, reproducing
stale callback context and a detail callback unable to become visible.
Historical 2.2.3.2–2.2.3.5 measurements and negative probes are retained.

## Root causes and safe contract

Installed @tanstack/react-table 9.3.1 useTable exposes its selector result as
state. createTableHook AppTable publishes that exact hook wrapper through its
provider. Reexecuting a callback or spreading a new object outside AppTable does
not refresh this context. Core methods/store reads being live cannot repair an
existing callback that reads table.state.rowSelection.

The new callbacks fixture retains the genuine FULL-state useMuiDataTable owner.
It passes that actual wrapper to DataTable, without an adapter, proxy, second
store or copied authoritative state. A runtime/type guard distinguishes it from
the historical partial-state diagnostic. The old boundaries variant remains an
explicit negative comparison, including its historical fixture-only adapter.
That adapter is not used by the new variant or production.

LiveCallbackBoundary reads the feature-bound React table context, subscribes
broadly, and invokes render(table) INSIDE the stable mounted boundary. It rejects
a partial-state owner. It is internal, not exported from public barrels. It does
not promise isolation from full-owner context broadcasts. Unknown callbacks stay
broad; the existing explicit SelectionDependencyBoundary row declaration is the
only locality contract, never inferred from a row argument.

NullableCallbackOutput puts that boundary beneath an explicitly row-local parent.
It owns invocation before deciding null, undefined, false, empty fragment or
populated output. Selecting B while A stays selected leaves detail-parent-a
uncommitted while independently updating detail-a from 1 to 2. External policy,
controlled selection and normal changed React inputs remain visible. No ref-only
policy snapshot, discarded props comparator or fabricated table-state type is used.

## Changed boundaries and compatibility limits

The milestone implementation changes diagnostics, the development acceptance
fixture, tests and documentation. A separate CI repair is described below. Generic body/cell/detail/card components, action policies, hook family,
sticky measurements, resources and transports are untouched. All original D1–D26
coverage and expected unsafe-projection counterexamples remain.

Table details and card callbacks are tested separately. Header/body/metadata/
actions/selection/expansion/detail read the full callback context; absent optional
callbacks retain native fallback controls. Flip mode has its own coverage.

The internal nullable proof keeps a mounted renderer shell around empty output.
It proves content invalidation, not legacy physical detail-row omission. A future
production boundary must own the physical slot/null decision BEFORE native row,
card slot and flip-face wrappers, preserve fallback semantics and all callbacks,
and prove a compatible full-context owner that can narrow commits. This is why
no production opt-in or performance improvement is claimed. Keeping the full
owner is the safe solution here, not a repaired narrowed-owner implementation.

## Adversarial and committed-output results

31 focused tests pass across liveCallbackContext and selectionDependencyContract.
N1–N16 cover callback state and actual disabled DOM, global cells, local output,
all nullable forms, card slots/defaults, flip, controlled/off-page selection,
model transitions, external policy, mode switching and unmount/remount cleanup.

For selecting B after A (two rows, seven physical columns):

| Variant | Owner/body commits | Row IDs committed | Physical cell commits | A own output | A global/nested | A guard |
| --- | --- | --- | --- | --- | --- | --- |
| Production default | 1/1 | a,b | 14 | 0 | 2/2 | disabled |
| Historical narrow diagnostic | 0/0 | b | 7 | 0 | 2/2 live reads | snapshot guard unsafe |
| Full-context proof | 1/1 | a,b | 14 | 0 | 2/2 | disabled |

A independently subscribed detail commits once after B; its explicit local parent
commits zero times. Unmount leaves no ghost output commits. These are layout-effect
commits and DOM assertions, not callback invocation counts or timing thresholds.
Callbacks execute inside subscription render callbacks; speculative executions are
not presented as committed React updates.

## Browser evidence

Isolated development route: http://localhost:8082/dev/datatable/selection-dependencies.
Chrome156 IAB on Windows, 1280×720; no production records mutated.

- Full callback context proof + existing snapshot probe: expand A at zero → no
  detail output; select A/B → global2, detail2, actual aggregate guard disabled.
- Card-before-selection: header Alpha:2; callback body snapshot2; metadata2,
  custom selection2, expansion2, detail2; custom guard disabled. Clear → no detail.
- Controlled state plus unloaded ID: selected IDs a,unloaded; raw/detail2; guard
  disabled, including unloaded selections in the count.
- Keyboard Space on A, select B, RTL: selected identities a,b. Data rows37px;
  A281.875–318.875 and B339.890625–376.890625 with separate detail row between;
  zero overlap. Production variable-height measurement code is unchanged.
- Filter Bravo: raw2 vs filtered1; clear/sort/page retains a,b.
- Controlled flip detail: detail2 and body Callback snapshot:2 after A/B.

Automated tests cover other empty forms and cleanup; this is not fresh physical
rotation/hover certification or a complete production browser rollout. Logical
column pinning retains D23–D26 DOM regressions; previous variable-height and
production-resource browser evidence remains historical, not newly certified.

## Validation and gates

- npm ci --strict-peer-deps: PASS, 1008 packages, zero audit findings.
- npm ls --all: PASS; compiler7/tooling-API6 split unchanged.
- npm run typecheck: PASS (including generated feature synchronization).
- Focused: 2 suites / 31 tests PASS.
- Final full serial source suite: **150 suites / 874 tests PASS**. Initial runs
  had 148/150 suites and 870/874 tests passing; see the separate CI repair below.
- Changed-file ESLint: zero errors, one pre-existing exhaustive-deps warning in
  the fixture's columns memo (also present on master). Full repository:174 errors,
  508 warnings. Rules unchanged; lint is recorded separately from correctness.
- git diff --check: PASS.

The correctness-approved production opt-in gate is NOT met. Expensive density
profiling is therefore skipped: there is no production candidate to compare.
No virtualization decision follows from this internal proof. Next: place stable
invocation boundaries before physical output decisions, then solve owner/context
fan-out without losing the genuine full callback contract. Keep resources broad.

## Separate CI repair — October 26

[CI317](https://github.com/Pizeth/pharmacy-client/actions/runs/40343746399)
confirmed exactly the same four initial master failures. Typecheck and the new
DataTable tests passed. Rather than weaken assertions, the follow-up isolates
SiteFooter in DrawerAppBar's existing coordination unit test (header/drawer are
already isolated there); rendering the real footer now requires application query
and custom-theme providers unrelated to those two assertions. No production
footer or navigation logic changes.

HrdCardCarousel's named HomeGalleryLink slot restores the white text explicitly
required by its existing light/dark regression on the unchanged dark-blue button.
Browser computed styles confirm white rgb(255,255,255) on rgb(38,36,123) for all 11
links. This is a one-line regression repair, not an HRD/contact/slideshow redesign.
The existing assertions, timeout settings and lint rules remain intact.

Repair-focused: 4/4 suites, 38/38 tests PASS. Final full suite: 150/150 suites, 874/874 tests
PASS. Typecheck PASS; repair-file ESLint clean. Historical initial failures above
are retained in validation.txt. This CI cleanup does not promote Outcome B to A.
