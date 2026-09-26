# TanStack v9 + MUI DataTable roadmap

This document records the current architecture roadmap after the TranslationKey
production proof and the row-pinning hardening pass.

The roadmap is deliberately capability-oriented. New phases should prove one
bounded architectural contract instead of growing a resource-specific phase
indefinitely.

---

## Final target

The final DataTable stack should provide one reusable application table system
with the following properties:

- TanStack Table v9 remains the authority for table state and row/column APIs.
- MUI owns presentation, accessibility, slots, theme overrides and variants.
- Application resources own business rules, mutations and public API field
  mappings.
- Transport adapters remain replaceable:
  - the application's Standard API,
  - Refine,
  - additional REST/GraphQL transports later without changing the renderer.
- The same query/result/controller state can drive:
  - the normal table presentation,
  - a responsive card presentation.
- Live/realtime updates can refresh or reconcile rows without bypassing the
  server-query boundary.
- No resource-specific knowledge is added to the generic DataTable renderer.
- Styling is slot/theme-first. Component-local `sx` is reserved for geometry
  that cannot reasonably be expressed as a stable theme rule.
- LTR/RTL, narrow layouts, density, selection, expansion, column pinning and row
  pinning remain interoperable.
- Refine remains an optional application integration rather than a dependency of
  the MUI renderer itself.

---

# Progress

## 1.3 — runtime and foundation

**Status: complete**

Established the generated TanStack feature map, feature synchronization checks
and the reusable table foundation.

## 1.4 — typed column family

**Status: complete**

Established the configured MUI TanStack v9 column helper, metadata and typed
column contracts.

## 1.5 — renderer

**Status: complete**

Established the reusable MUI table renderer and core structural components.

## 1.6 — advanced table UX

**Status: complete**

Includes the shared UX family built before server integration, such as:

- selection surfaces,
- pagination,
- toolbar actions,
- filtering UI,
- column visibility,
- ordering,
- column pinning,
- resizing,
- density,
- fullscreen,
- expansion/detail panels,
- accessibility support.

## 1.7 — server/resource integration

**Status: complete for the established server boundary**

Established:

- `DataTableServerQueryState`,
- semantic server-query mapping,
- transport-independent request/response adapter interfaces,
- normalized server result lifecycle,
- previous-result preservation,
- background refresh,
- manual TanStack pagination/sorting/filtering binding.

### 1.7.10.5 — global search and resource filters

**Status: complete**

TranslationKey proved:

- global search,
- text filters,
- select filters,
- relation-backed category filtering,
- locale filtering,
- safe public field mapping.

### 1.7.10.6 — generic DataTable finalization

**Status: complete**

The renderer was converted to the current theme-slot architecture and completed
the major structural/presentation audit.

### 1.7.10.7 — TranslationKey production proof

**Status: complete**

Proved the real resource lifecycle:

- 7.1 Create,
- form/input standardization,
- 7.2 Edit,
- 7.3 Delete,
- 7.4 TranslationValue CRUD and validation continuity,
- 7.5 row selection and mutation safety.

The TranslationKey resource now acts as the primary production acceptance
fixture for the custom table stack.

---

# Feature hardening after the TranslationKey proof

## Row pinning

**Status: complete for the current feature scope**

TanStack v9 `rowPinningFeature` is now part of the MUI feature family.

Supported presentation modes:

- `sticky`,
- `top`,
- `bottom`,
- `top-and-bottom`,
- `select-sticky`,
- `select-top`,
- `select-bottom`.

Current guarantees include:

- controlled and uncontrolled row-pinning state,
- TanStack reset semantics,
- explicit generic pin/unpin controls,
- selection-driven pinning without making page-level select-all sticky,
- `keepPinnedRows` behavior,
- sorting/filtering/pagination interaction,
- density-aware sticky offsets,
- detail-panel coexistence,
- logical column pinning in LTR/RTL,
- per-row `enableRowPinning` predicates.

After row pinning, the generated feature audit currently exposes 12 stock
TanStack features and intentionally ignores 5:

- `cellSelectionFeature`,
- `cellSpanningFeature`,
- `columnFacetingFeature`,
- `columnGroupingFeature`,
- `rowAggregationFeature`.

Those five remain intentionally out of scope until a real application
requirement justifies them.

---

# 1.8 — data-source adapter family

The next architectural phase is transport integration beyond the application's
native Standard API.

The rule for this phase is:

> DataTable state must not depend on Refine, and the renderer must never import
> Refine. Refine is only another adapter/execution layer.

## 1.8.1 — Standard API adapter

**Status: complete**

Existing implementation:

`src/components/DataTable/adapters/standard-api`

provides:

- semantic query -> Standard API request,
- Standard API paginated response -> normalized DataTable result.

## 1.8.2 — Refine pure adapter foundation

**Status: complete**

Target:

- semantic DataTable query -> Refine `GetListParams`,
- Refine `GetListResponse` -> normalized `DataTableServerResult`,
- explicit global-search mapping policy,
- no React hook execution in the pure adapter.

This is the currently active implementation slice.

## 1.8.3 — Refine request lifecycle integration

**Status: complete**

Add a reusable hook/controller bridge that can execute a DataTable server query
through Refine while preserving the existing generic lifecycle:

```text
DataTableServerQueryState
        ↓
resource semantic mapper
        ↓
Refine adapter
        ↓
Refine useList / data provider
        ↓
DataTableServerResult
        ↓
useDataTableServerResult()
        ↓
createDataTableServerTableBinding()
```

Implemented guarantees:

- Refine `useList()` executes the adapted request,
- Refine response normalization feeds the existing DataTable lifecycle,
- initial loading and background fetching remain distinct,
- explicit refresh delegates to Refine without mutating DataTable query state,
- previous-result preservation remains owned by `useDataTableServerResult()`,
- Refine/React Query placeholder rows are not mislabeled as canonical new-query
  results,
- replacement errors remain refresh errors while prior rows stay usable,
- pagination totals remain normalized for TanStack,
- no renderer dependency on Refine.

The next proof is resource-level adoption rather than additional generic hook
machinery.

## 1.8.4 — second-resource Refine proof

**Status: planned**

Use a non-TranslationKey resource, preferably the document/FTS resource, to
prove that the Refine adapter is genuinely reusable.

The proof should reuse:

- semantic field mapping,
- generic filters,
- generic server lifecycle,
- existing resource actions.

It should not duplicate TranslationKey infrastructure.

---

# 1.9 — alternate card presentation

**Status: planned**

This phase adds a card display without creating a second data/query system.

The key architectural rule is:

> Table view and card view consume the same resolved rows and table/controller
> state.

## 1.9.1 — presentation-mode contract

Add a generic display mode such as:

```text
table
card
auto
```

The mode belongs to the presentation layer, not server query state.

Changing table/card view must not issue a different semantic request solely
because the renderer changed.

## 1.9.2 — card renderer and slots

Create themeable DataTable card slots, for example:

- card container,
- card item,
- card header,
- card body,
- card metadata,
- card actions,
- card selection surface,
- card expansion/detail surface.

The application supplies the resource-specific card content.

No inline resource styling should be required for normal customization.

## 1.9.3 — feature parity

Card view should preserve the applicable state contracts:

- row identity,
- selection,
- row actions,
- expansion/detail content,
- pagination,
- global search,
- resource filters,
- loading/empty/error states,
- realtime refresh state.

Column-only concepts such as resize widths do not need fake card equivalents.

## 1.9.4 — responsive/auto mode

Allow narrow screens to use card presentation while wider layouts use the table
renderer.

The responsive switch must preserve:

- query state,
- selection where still valid,
- expansion identity where still valid,
- mutations and refresh lifecycle.

---

# 2.0 — realtime/live data

**Status: planned**

Realtime is intentionally scheduled after the transport and presentation
boundaries are stable.

The generic table must not know whether updates originate from:

- WebSocket,
- SSE,
- Refine LiveProvider,
- another event transport.

## 2.0.1 — generic live-event contract

Define backend-independent events such as:

```text
created
updated
deleted
invalidate
```

with stable resource/record identity.

## 2.0.2 — reconciliation policy

Support two safe strategies:

1. invalidate/refetch the current server query,
2. reconcile a known row into the current normalized result when correctness can
   be proven.

Refetch remains the fallback when sorting, filtering, pagination or total-count
changes make local patching ambiguous.

## 2.0.3 — table-state safety

Realtime updates must preserve or correctly reconcile:

- row selection,
- row pinning,
- expansion,
- current page,
- background-refresh presentation.

Deleted or no-longer-visible row IDs must not remain as stale authorization
state for resource mutations.

## 2.0.4 — Refine LiveProvider bridge

Add a Refine-specific live adapter only after the generic live contract exists.

Refine LiveProvider must be one implementation of the generic contract, not the
definition of realtime behavior.

## 2.0.5 — realtime resource proof

Prove realtime on a real resource with:

- create event,
- update event,
- delete event,
- reconnect,
- duplicate-event protection,
- active filter/search interaction,
- selected/pinned row reconciliation.

---

# 2.1 — persistence and shareable table state

**Status: planned**

Persist only state that is safe and useful.

Candidate state families:

- density,
- column visibility,
- column order,
- column sizing,
- column pinning,
- display mode,
- optionally query state.

Server-query URL synchronization and saved visual preferences should remain
separate concerns.

Persisted state must tolerate columns being added/removed between application
versions.

---

# 2.2 — large-data performance and virtualization

**Status: planned / evidence-driven**

Virtualization should be introduced only after profiling proves that normal
rendering is the bottleneck.

If required, it must preserve:

- sticky headers,
- column pinning,
- row pinning,
- selection,
- expansion,
- keyboard accessibility,
- card/table mode boundaries.

Do not add virtualization merely for feature parity with another grid library.

---

# 2.3 — remaining TanStack features by application demand

**Status: deferred intentionally**

The currently ignored stock features are not backlog items merely because they
exist.

They become candidates only when a real resource needs them:

- cell selection,
- cell spanning,
- column faceting,
- column grouping,
- row aggregation.

Each should get its own bounded proof rather than being enabled speculatively.

---

# 2.4 — migration closure

**Status: planned**

The project reaches migration closure when:

1. TranslationKey remains green as the primary production proof.
2. A second complex resource uses the same DataTable infrastructure.
3. Standard API and Refine integrations both work without renderer changes.
4. Table and card display share one controller/query lifecycle.
5. Realtime updates work through a generic live-data boundary.
6. Legacy MRT/react-admin table code can be removed from migrated resources.
7. Styling is controlled through component slots/theme overrides rather than
   resource-local `sx` rules.
8. LTR/RTL, density, narrow layouts and accessibility remain covered.
9. CI covers adapter, renderer and resource acceptance contracts.

At that point the custom stack is not merely an MRT replacement. It is the
application's reusable data-presentation platform built around TanStack v9,
MUI and replaceable data-source adapters.
