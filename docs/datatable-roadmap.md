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

**Status: complete for the list/query transport proof**

Document/FTS is now the second resource proving that the Refine integration is
not TranslationKey-specific.

The completed path is:

```text
Document DataTable state
        ↓
documentTableSemanticQuery
        ↓
documentRefineDataTableAdapter
        ↓
useRefineDataTableServerResult()
        ↓
createDataTableServerTableBinding()
        ↓
useMuiDataTable()
        ↓
DocumentTable
```

Implemented guarantees:

- stable Document row and column IDs,
- resource-owned semantic sorting/filter/search mappings,
- explicit Refine OR/contains global-search encoding,
- normalized Refine pagination/result handling,
- a complete Document controller built on the generic Refine lifecycle,
- the generic MUI DataTable renderer remains unaware of Refine,
- initial loading/error/empty/no-results states reuse generic DataTable slots,
- background refresh preserves usable rows,
- deterministic fixture-provider coverage proves server pagination, filtering,
  global search and the rendered table path,
- a protected `/admin/documents` fixture-backed route exists for visual
  acceptance without pretending the production Document API already exists,
- the DataTable test command now includes the Document feature family.

The fixture provider intentionally supports list/query only. The production
backend does not yet expose a canonical documents endpoint, so this phase does
not invent API schemas or mutation contracts and does not replace the existing
legacy /fts screen yet. When that backend endpoint exists, the provider can be
swapped without changing the Document table/controller or generic renderer.

The legacy MRT FTS code remains a behavior/UI reference only; it is not a
dependency of the modern Document architecture.

---

# 1.9 — alternate card presentation

**Status: planned**

This phase adds a card display without creating a second data/query system.

The key architectural rule is:

> Table view and card view consume the same resolved rows and table/controller
> state.

## 1.9.1 — presentation-mode contract

**Status: complete**

The generic presentation contract is now established as:

```text
table
card
auto
```

It lives in the MUI presentation layer as controlled/uncontrolled state through
`DataTableDisplayModeProvider`.

The provider owns only the requested presentation mode. It does not read or
write:

- pagination,
- sorting,
- column filters,
- global search,
- resource adapters,
- transport state.

Therefore changing the requested display mode cannot manufacture a semantic
server request by itself.

`auto` is intentionally preserved as a requested mode rather than resolved in
this phase. Responsive resolution belongs to 1.9.4 so 1.9.1 does not smuggle
viewport policy into the base state contract.

## 1.9.2 — card renderer and slots

**Status: complete**

The generic MUI renderer now supports a card presentation that consumes the
same TanStack table instance and resolved row model as table presentation.

Established theme slots:

- `cardContainer`,
- `cardItem`,
- `cardHeader`,
- `cardSelection`,
- `cardBody`,
- `cardMetadata`,
- `cardActions`,
- `cardExpansion`,
- `cardDetail`,
- `cardState`.

Resource content is supplied through `DataTableCardConfig<TData>`. The generic
renderer owns only card structure, state surfaces and theme hooks.

Important boundaries:

- no resource field names enter the generic card renderer,
- no card-specific server query exists,
- pagination/search/filtering continue to use the same table/controller state,
- `auto` still resolves to table until 1.9.4,
- card rendering requires an explicit resource card configuration,
- collapsed rows do not invoke card detail renderers,
- false/null/undefined omit optional card surfaces while values such as 0 and
  empty strings remain valid renderable content.

The Document proof now supplies resource-specific card content, and
`/admin/documents` defaults to card mode for visual acceptance. Use
`?display=table` to compare the same resource/controller in table mode.

## 1.9.3 — feature parity

**Status: complete**

Card presentation now preserves the applicable shared state and interaction
contracts:

- row identity comes from the same TanStack Row objects,
- optional generic selection controls delegate to TanStack row selection and
  preserve selection-driven row-pinning policy,
- card actions reuse the existing `DataTableRowAction<TData>` contract and
  `DataTableRowActions` renderer,
- optional generic expansion controls delegate to TanStack expansion and keep
  the established detail-panel accessibility IDs/relationships,
- pagination remains the shared outer DataTable pagination,
- global search and resource filters remain the same table/controller state,
- loading/empty/error states reuse the established DataTable state slots,
- refresh indication remains the shared non-blocking DataTable refresh surface.

Resource render callbacks still take precedence over generic card controls, so
applications can replace selection/actions/expansion composition without
forking the renderer.

No card-only copies of query state, selection state, expansion state, or row
actions were introduced.

Column-only concepts such as resize widths deliberately have no fake card
equivalent.

## 1.9.4 — responsive/auto mode

**Status: complete**

`auto` now resolves presentation responsively without changing the requested
mode or mutating TanStack/server state:

- at or below `autoCardBreakpoint`: card renderer,
- above `autoCardBreakpoint`: table renderer,
- default breakpoint: `sm`.

`autoCardBreakpoint` is a generic presentation option and can also be supplied
through `theme.components.RazethDataTable.defaultProps`.

The resolver reads only MUI theme/viewport state. It does not read or write
query state, resource adapters or transport execution. Both physical renderers
continue consuming the same table instance, so viewport transitions preserve:

- pagination/sorting/filter/search state,
- row selection,
- row expansion identity,
- mutations and refresh lifecycle.

This completes the first responsive card/table presentation loop.

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

**Status: complete**

The generic live boundary now defines transport-independent:

```text
created
updated
deleted
invalidate
```

events with normalized stable:

- event identity,
- resource identity,
- record identity.

Created/updated events may carry a normalized row payload, but payloads are
optional so identity-only transports can safely fall back to refetch.
`invalidate` may target one record or the whole resource.

Optional revision/timestamp metadata is retained as a hint only; the generic
contract does not assume transport ordering semantics.

`getDataTableLiveEventDeduplicationKey()` establishes a stable
resource-scoped event key for later duplicate-event protection without coupling
the contract to WebSocket, SSE, Refine LiveProvider, or another transport.

## 2.0.2 — reconciliation policy

**Status: complete**

The generic live layer now exposes one pure reconciliation decision function:

`reconcileDataTableLiveEvent()`

For a matching resource event it returns exactly one of two strategies:

1. `refetch` when the current normalized server result may be stale,
2. `reconcile` when one visible updated row can be replaced in place and
   correctness has been explicitly proven.

The generic policy is intentionally conservative:

- `invalidate` always refetches,
- `created` refetches because membership/order/totals may change,
- `deleted` refetches because page fill and pagination totals may change,
- identity-only updates refetch,
- payload/envelope identity mismatches refetch,
- updates for rows not on the current page refetch because the row may now enter
  the query/page,
- duplicate current-page row IDs refetch,
- visible updates still refetch unless the resource supplies an explicit
  `canReconcileUpdatedRecord` proof.

A positive update-stability proof asserts that replacement preserves:

- active filter/global-search membership,
- current sort/default-server ordering position,
- current-page membership,
- row count and page count.

When proven, the policy returns a new immutable
`DataTableServerResult<TData>` with exactly that row replaced and the existing
pagination metadata preserved.

The function performs no request, React-state, cache, or transport side effects.
Later bridges own execution of the returned strategy.

Refetch therefore remains the correctness fallback whenever server-query
semantics are ambiguous.

## 2.0.3 — table-state safety

**Status: complete**

The generic live/server safety layer now reconciles every TanStack state family
that carries stable row identity after a canonical current-query result settles:

- `rowSelection`,
- `rowPinning.top`,
- `rowPinning.bottom`,
- keyed `expanded` state.

The policy deliberately waits while:

- a background request is fetching,
- a preserved previous result is being displayed.

This keeps the established non-blocking refresh UX intact. Once the replacement
result is canonical, row IDs no longer present on the loaded server page are
removed so stale IDs cannot remain as resource-mutation authorization state.

TanStack `expanded === true` is preserved because that state contains no stale
record identity.

The safety layer also resolves out-of-range pagination after realtime changes to
total/page counts:

- a still-valid current page is preserved,
- unknown pageCount (`-1`) is preserved,
- an empty result recovers to page zero,
- an index beyond the last page is clamped to the last valid page.

A separate `removeDataTableLiveRecordFromTableState()` executor can remove a
known deleted record immediately from selection, pinning and keyed expansion
before the refetch completes. This closes the stale-selection window for the
future live transport bridge without coupling state cleanup to any transport.

TranslationKey now consumes the generic safety hook instead of maintaining
resource-local canonical selection/pinning cleanup effects. Expansion cleanup
and out-of-range page recovery are therefore covered by the same generic
contract as well.

## 2.0.4 — Refine LiveProvider bridge

**Status: complete**

Refine LiveProvider is now one transport implementation behind the generic live
boundary.

The bridge has two layers:

1. `adaptRefineDataTableLiveEvent()`
   - maps recognized Refine `created` / `updated` / `deleted` events,
   - supports explicit provider-specific event-name mapping,
   - requires provider/resource-owned extraction of stable event/record IDs,
   - optionally decodes a canonical row payload,
   - optionally carries revision metadata,
   - normalizes Refine `date` into generic `occurredAt`.

2. `useRefineDataTableLiveSubscription()`
   - subscribes through Refine `useSubscription()`,
   - defaults to Refine's `resources/<resource>` list channel convention,
   - emits only normalized `DataTableLiveEvent<TData>` values,
   - performs no reconciliation, cache mutation or request execution.

The existing Refine list request bridge now forces `liveMode: "off"`.
This is intentional: Refine's integrated automatic live invalidation must not
bypass DataTable's generic decision layer. Realtime events flow instead through:

```text
Refine LiveProvider
        ↓
useRefineDataTableLiveSubscription()
        ↓
adaptRefineDataTableLiveEvent()
        ↓
DataTableLiveEvent
        ↓
generic reconciliation/state-safety policy
```

Refine therefore remains a replaceable event transport rather than the
definition of realtime behavior.

## 2.0.5 — realtime resource proof

**Status: next**

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
