# Selection dependency contract — scoped proof, production deferred

## October 26 — 2.2.3.6 internal callback-context proof

**Outcome B: production integration deferred.** The new internal proof retains
the genuine full-state feature-bound hook context and places callback invocation
inside a stable boundary before nullable output. Global detail can update below
a row-local parent that skips its commit; snapshot guards, all card slots and
controlled/off-page selection pass focused DOM regressions. The historical narrow
owner remains an unsafe negative probe. No production subscriptions or public
opt-in API change; physical nullable-slot omission and owner/context fan-out still
require bounded production design and browser acceptance. Density profiling is
skipped until that gate passes. See [the complete report](datatable-selection-callback-context-2-2-3-6.md)
for results, unchanged master test failures, browser evidence and limitations.
Historical measurements below remain unchanged; virtualization is unapproved.


## October 22 — internal executable contract, outcome B

The [2.2.3.5 report](datatable-selection-dependencies-2-2-3-5.md) supersedes the
design-only status below, preserving its safe default. An internal discriminated
output boundary accepts either explicit `selectionDependency: "row"` plus stable
`rowId`, or undeclared/`"global"` output. Local output excludes only other rows'
selection; all non-selection state and changed React inputs still invalidate it.
Global output independently subscribes to the complete authoritative snapshot,
including when its local parent skips. It owns no selection copy or second store.
This type/component is experimental and not exported as a production guarantee.

D5/D6/D8/D21 DOM-and-commit tests prove live-store output isolation. They also
retain precise rollout failures: hook callback context can expose a narrowed
`table.state`, and a nullable detail callback cannot be repaired by a descendant
subscription that never mounted. Identical default callbacks remain correct.
The internal boundary establishes a viable contract, not automatic compatibility
for whole-row narrowing. Production hook/renderer/resources stay broad.

Next (2.2.3.6): preserve the full existing live callback context and independently subscribe
callback invocation/empty-slot decisions before exposing declarations. Only then
repeat the gated production comparison. No new performance claim or virtualizer.

## Historical October 21 decision

October 21, 2026; decision **C**. Track A's production geometry defect takes
priority. No production subscription or callback API changes are included.
The existing adversarial proof in `selectionDependencies.spec.tsx` remains intact.
The 2.2.3.3 measurements remain the performance evidence; no new performance
claim or costly profiling rerun is justified by this geometry-only change.

## Safe default

Undeclared callbacks retain broad selection invalidation. A callback accepting
one row can still read the full table, another row, an aggregate count or an
external mutation policy. Its signature cannot establish local safety.
The feature-bound createTableHook integration and controlled selection remain
authoritative; a dependency declaration must never become a second state store.

## Candidate, not a public interface

An explicit declaration could distinguish own-row selection, raw selected count,
full selection, and named other-row identities. Every callback-bearing output
boundary would need its own declaration: cells, actions/disabled/hidden policies,
checkbox eligibility, row activation, detail panels and each card renderer.
An undeclared descendant must force broad invalidation even inside a declared
local ancestor. A local row declaration alone cannot safely narrow its subtree.

| Dependency | Required source / invariant |
| --- | --- |
| Own selected paint | Project stable row ID from live selection; no inherited global callback dependence |
| Raw selected count | Count raw IDs, including unloaded/off-page selections |
| Filtered selected count | Selection plus the filtered row model; never substitute raw count |
| Other-row selection | Explicit stable identity set; dependency-set changes must invalidate |
| Resource action guard | Preserve full existing policy by default; include loaded-record availability and external policy inputs |
| Controlled external selection | Subscribe to authoritative updates, not a copied local snapshot |
| Page select-all / clear | Recompute eligibility and aggregate output; preserve off-page semantics |
| Detail panel | Expansion, column membership, selection declaration and callback inputs |
| Card output | Independently declare header/body/metadata/actions/detail; table declaration cannot authorize narrowing cards |
| Sort/filter/visibility | Existing row-model and column invalidation remains in force |

A strongly typed opt-in would need to cover all of these boundaries without
casts, implicit inference, resource logic or an unbounded set of custom selectors.
That integration is not proven here. Consequently no exported candidate type is
introduced as though it were an implemented guarantee.

## Required proof before rollout

Keep the current local-only diagnostic counterexample: selecting B commits B,
but leaves A's global-count cell and cross-row guard stale. Broad production
subscriptions correctly invalidate A. Existing tests also retain controlled,
off-page, page-selection, filtering/sorting and card guard coverage.

A future implementation must prove local A avoids a B-only selection commit,
while count-dependent A and aggregate guard A update correctly. Default custom
callbacks, externally controlled selection, unloaded selections, filtered counts,
detail output, action policies, visibility/sort changes and same-instance
table/card transitions must pass adversarial tests. Fixture speedups alone do
not meet that gate. Until then selection optimization and virtualization remain
deferred, independently of Track A certification.
