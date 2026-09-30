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

## 1.8.5 — TranslationKey production Refine execution

**Status: complete**

TranslationKey now exercises the Refine request/query lifecycle in the primary
production resource without replacing its established backend contract.

The production path is:

```text
DataTableServerQueryState
        ↓
translationKeySemanticQueryAdapter
        ↓
TranslationKey Refine adapter
        ↓
named Refine DataProvider
        ↓
existing Standard API request metadata
        ↓
POST /api/v1/i18n/keys/query
        ↓
Refine GetListResponse
        ↓
generic DataTable server-result lifecycle
```

Important boundaries:

- the application default NestJS CRUD provider remains unchanged,
- TranslationKey uses the named `translationKeyStandardApi` provider,
- Refine receives public semantic sort/filter/search descriptors for query/cache
  identity,
- the actual Standard API wire request remains authoritative,
- global-search fields do not cross the HTTP boundary; the request still sends
  only `search.term`,
- TranslationKey CRUD/TranslationValue mutation APIs remain explicit
  resource commands and refresh the Refine-backed list lifecycle afterward,
- the old direct Standard API loader remains available as a lower-level
  transport proof/fallback,
- no Refine type or hook enters the generic MUI renderer.

This makes TranslationKey the production proof for both the Standard API wire
contract and Refine execution while Document remains the independent
second-resource Refine proof.

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

## 1.9.5 — production view switching proof

**Status: complete**

The card/table boundary is now exercised by production/resource surfaces rather
than only by fixture configuration:

- TranslationKey supplies a resource-owned card composition while its
  production list request runs through the named Refine provider over the same
  Standard API wire contract,
- the shared toolbar exposes a generic table/card toggle only when a card
  renderer exists,
- display-mode switching preserves TanStack query/row state and saved visual
  preferences,
- TranslationKey card mode reuses generic selection, row actions, expansion,
  detail-panel, pagination, search/filter and refresh behavior,
- the Refine-backed Document proof uses the same toolbar toggle and verifies
  that switching physical renderers does not issue another Refine list request,
- a controlled display mode without an update callback does not expose an inert
  toolbar toggle.

The browser acceptance handoff for production parity and the subsequent
performance matrix is maintained in:

`docs/datatable-browser-matrix.md`

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

**Status: complete**

The Document Refine resource now composes the complete realtime stack:

```text
Refine LiveProvider
        ↓
Refine live bridge
        ↓
DataTableLiveEvent
        ↓
bounded event deduplication
        ↓
generic reconcile/refetch decision
        ↓
live normalized-result overlay OR Refine refresh
        ↓
generic table-state safety
```

A new generic `useDataTableLiveServerResult()` executor owns:

- resource routing,
- bounded FIFO duplicate-event protection,
- execution of the pure 2.0.2 decision,
- immutable proven-safe row overlays,
- conservative refresh execution,
- canonical-result replacement of local overlays.

Local reconciliation is refused while another server replacement is already in
flight, avoiding an in-flight stale-response race.

The Document resource supplies an explicit update-stability proof. It allows
local replacement only when no sort, column filter, or global search is active.
Any semantic query transformation falls back to canonical refetch.

The fixture-backed Refine LiveProvider acceptance proof covers:

- visible update with zero extra server requests,
- duplicate update delivery,
- active-search update forcing refetch while preserving the search query,
- create forcing refetch,
- duplicate create protection,
- delete forcing refetch while immediately removing stale selected/pinned IDs,
- unsubscribe/resubscribe reconnect behavior,
- reconnect invalidation,
- duplicate reconnect-event protection across the transport reconnect.

Deduplication history is bounded and intentionally survives normal reconnects
while the resource controller remains mounted.

This completes the planned 2.0 realtime architecture without coupling the
generic table to WebSocket, SSE, Refine, or another event transport.

---

# 2.1 — persistence and shareable table state

**Status: complete**

Persistence is split into two deliberately separate concerns:

1. saved visual preferences,
2. shareable semantic server-query state.

Visual preferences must never silently become query semantics.

## 2.1.1 — versioned persisted visual-state schema

**Status: complete**

The generic MUI layer now defines a versioned, transport/storage-independent
visual-state envelope for:

- density,
- display mode,
- column visibility,
- column order,
- column sizing,
- column pinning.

The schema deliberately excludes:

- pagination,
- sorting,
- column filters,
- global search,
- row selection,
- row pinning,
- expansion,
- fullscreen/open-menu state.

Hydration is defensive:

- unknown schema versions are rejected,
- malformed optional fields are ignored independently,
- removed column IDs are discarded,
- newly introduced columns are appended to persisted order in the current
  resource-definition order,
- duplicate column-order/pinning IDs are removed,
- a column cannot hydrate into both logical pin regions,
- invalid/non-positive column sizes are discarded.

The implementation is pure and does not read/write localStorage, URLs, table
instances, or resource-specific fields.

Implementation:

`src/components/DataTable/mui/persistence`

## 2.1.2 — persistence storage boundary

**Status: complete**

The persisted visual-state schema now sits behind a replaceable synchronous
storage boundary.

Established contracts:

- `DataTablePersistenceStorage` is the minimal string-storage adapter:
  - `getItem()`,
  - `setItem()`,
  - `removeItem()`.
- `getBrowserDataTablePersistenceStorage()` is the browser/Web Storage adapter
  and performs no module-load access to `window` or `localStorage`.
- `createDataTablePersistedVisualStateStore()` owns:
  - JSON decode/encode,
  - schema normalization,
  - current-column compatibility sanitization,
  - safe read/write/remove failure handling.
- `createDataTablePersistedVisualStateStorageKey()` owns a stable namespace and
  embeds the visual-state schema version into the storage key.

The current key shape is:

```text
razeth:data-table:visual-state:v1:<encoded storage id>
```

The boundary is intentionally defensive:

- SSR/unavailable storage resolves to an empty preference state instead of
  touching browser globals,
- malformed JSON returns no persisted preference,
- storage getter/setter/remover exceptions are contained,
- writes are normalized before serialization so extra runtime properties such as
  pagination, sorting, filters, search or row state cannot leak into the visual
  preference payload,
- stale/removed column IDs are sanitized through the same 2.1.1 schema used for
  hydration,
- the renderer still has no dependency on `localStorage`.

Implementation:

`src/components/DataTable/mui/persistence/storage`

## 2.1.3 — DataTable visual-state controller integration

**Status: complete**

The renderer now accepts an opt-in visual persistence configuration:

```tsx
<DataTable
  table={table}
  persistence={{
    storageId: "admin/i18n/translation-keys",
  }}
/>
```

The persistence controller integrates the 2.1.1 schema and 2.1.2 storage boundary
without becoming a second owner of TanStack state.

Established precedence and ownership:

1. explicit controlled state remains authoritative,
2. persisted values hydrate only uncontrolled visual state,
3. existing table/resource defaults remain untouched when no persisted value
   exists,
4. existing MUI theme defaults remain the fallback for density/display mode.

TanStack visual state is handled through the existing table APIs:

- v9 external atoms and classic `state.<slice>` ownership are both detected
  as externally controlled and are never hydrated over,
- uncontrolled persisted column state hydrates through
  `table.setColumnVisibility()`,
  `table.setColumnOrder()`,
  `table.setColumnSizing()` and
  `table.setColumnPinning()`,
- controlled TanStack state is never overwritten during hydration,
- live column state is observed through `table.Subscribe`/TanStack atoms,
- no `table.getState()` compatibility layer was introduced.

MUI-only state follows the existing controlled/uncontrolled semantics:

- density,
- requested display mode.

When persistence is enabled, the persistence controller owns only their
uncontrolled values and delegates every requested change through the existing
callbacks. Explicit controlled props still win immediately.

Persistence writes occur only after hydration and include only uncontrolled
visual-state families. Controlled state is not silently copied into user
preferences.

Additional safety:

- browser storage is still resolved only through the storage adapter,
- renderer code contains no direct `localStorage` access,
- persisted `card`/`auto` presentation values are ignored when the current
  DataTable has no card renderer,
- current leaf-column IDs are used for compatibility normalization,
- TranslationKey is the first production resource to opt into the generic
  visual-preference controller.

Implementation:

`src/components/DataTable/mui/persistence/controller`

## 2.1.4 — shareable server-query URL state

**Status: complete**

Semantic server-query state can now be shared through a versioned URL contract
without entering the saved visual-preference system.

The generic pure codec:

`createDataTableQueryUrlCodec()`

supports:

- pagination,
- sorting,
- column filters,
- global search.

Established boundaries:

- URL state stores public semantic field IDs, not TanStack-only IDs or
  backend/private database paths,
- each resource explicitly maps UI column IDs to public sorting/filter fields,
- resource-owned filter codecs validate erased TanStack filter values before
  they enter or leave the URL,
- unsupported schema versions fall back to the resource default query,
- malformed pagination/sort/filter values are sanitized independently,
- unmapped or removed semantic fields are ignored safely,
- unrelated application query parameters are preserved,
- serializing the canonical resource default removes DataTable-managed URL
  parameters so clean routes remain clean,
- saved visual preferences remain under the separate 2.1.1–2.1.3 persistence
  boundary and are never read or written by the query URL codec.

Next.js integration is isolated in the replaceable adapter:

`src/components/DataTable/adapters/next-query-url`

rather than the generic MUI renderer.

The adapter:

- hydrates the initial semantic query from App Router search params,
- mirrors DataTable query changes with configurable `replace` or `push`
  history behavior,
- defaults to `replace` so debounced search/filter edits do not create a
  history entry per keystroke,
- reapplies browser back/forward navigation to the existing
  `useDataTableServerState()` controller,
- guards against echoing browser navigation back into another router update,
- keeps URL routing outside resource request/response adapters.

TranslationKey is the production proof. Its route-level wrapper uses the URL
adapter while the reusable TranslationKey table/controller can still operate
with the ordinary internal server-query controller.

The TranslationKey URL mapping reuses the same public semantic field maps used
by its server query mapper, including the asymmetric Category contract:

```text
UI column       URL/public field
--------------------------------
key             key
description     description
category        categoryId
locale          locale
```

Therefore a shared TranslationKey URL cannot expose Prisma relation paths or
choose private backend fields.

This completes the planned 2.1 persistence/shareable-state architecture.

---

# 2.2 — large-data performance and virtualization

**Status: active / evidence-driven**

Virtualization remains conditional. The project first establishes repeatable
browser evidence for the existing non-virtualized renderer.

## 2.2.1 — reproducible performance baseline

**Status: complete**

A development-only baseline fixture now exists at:

```text
/dev/datatable/performance
```

It measures the current renderer before any virtualization dependency or
production behavior is introduced.

Controlled dimensions:

- rows: 25, 100, 200, 500, 1000,
- columns: 8, 16, 32,
- presentation: table or card.

The table fixture intentionally places all configured rows on one TanStack page
and keeps logical start/end columns pinned. This makes DOM/render cost visible
instead of hiding it behind normal server pagination.

React Profiler measurements include:

- commit count,
- last actual duration,
- average actual duration,
- maximum actual duration,
- last base duration.

The fixture also reports physical DOM row/cell/card counts and exposes repeatable
interaction probes for:

- row selection,
- expansion/detail rendering,
- sorting.

No CI timing threshold is introduced. Development-mode React timing varies with
hardware/browser/background load, so the baseline is comparative evidence rather
than a machine-specific pass/fail contract.

The repeatable manual protocol is documented in:

`docs/datatable-performance-baseline-2-2-1.md`

## 2.2.2 — browser measurement and virtualization decision gate

**Status: next — gated by Matrix A browser recheck**

Run `Matrix A` in `docs/datatable-browser-matrix.md` first so the production
TranslationKey named-Refine path and the independent Refine-backed Document
presentation path are green before profiling.

The authenticated Matrix A run on 2026-09-28 found two real renderer-parity
gaps in card mode: the subheader filter editors had no physical card surface and
sorting had no card-mode control. Commit
`9c01a2ca0c5db336250c27e700a8541740b96798` fixes both generically by reusing
the existing TanStack column-filter state/editors and sorting state from the
shared toolbar. CI passed typecheck, the complete Jest suite, and
`git diff --check`.

Those Matrix A cells still require browser re-verification before 2.2.2 starts.

A second visual-parity follow-up landed on 2026-09-29 in PR #32
(`chatgpt/datatable-visual-parity-2-2-2`) after desktop/card screenshots exposed
presentation defects that unit tests could not prove visually:

- expanded card row actions now remain before potentially tall detail content,
- TranslationValue detail content uses an intrinsic two-column layout rather
  than viewport breakpoints, so edit/delete/add controls cannot disappear merely
  because a detail/card region is narrow inside a desktop viewport,
- generic DataTable card slots use the application's existing neumorphic shadow
  language through `RazethDataTable.styleOverrides`,
- DataTable leaf-filter components now expose `variant` and `margin` through
  their MUI theme contracts; the application defaults them to compact
  `filled` / `margin="none"` presentation,
- filter-row cell chrome is tighter without changing sticky offsets or density
  height calculations,
- TranslationKey's expansion utility header is now the compact 44px,
  double-chevron affordance; expand-all remains intentionally disabled and the
  visible "Details" label is gone.

PR #32 CI passed the repository typecheck, complete Jest suite and whitespace
check before this roadmap update. These items are **implemented, not browser
certified**. Matrix A must explicitly recheck desktop/narrow table and card
presentation before any PASS is recorded.

A follow-up theme-only refinement after PR #32 further narrows the remaining
visual acceptance surface:

- compact filled table filters keep their existing MUI filled semantics but use
  a 5px radius instead of inheriting pill-like form geometry,
- DataTable cards/detail insets now use dedicated
  `customShadows.dataTableCard` / `customShadows.dataTableInset` tokens so
  dark-mode table surfaces can use crisper elevation without changing the
  application's global neumorphism tokens,
- the TranslationValue detail-panel resource root no longer caps itself at
  960px, allowing the renderer-owned spanning detail row to use the full
  available table width.

These visual items were browser-rechecked on the September 29/30 Matrix A
continuation. The latest report at commit
`722d3d3adf138dcc28a6809c625cc2be327aa8e3` leaves Matrix A blocked for two
evidence gaps plus two newly requested MRT-parity behaviors.

### 2.2.2 pre-gate MRT-parity follow-up — 2026-09-30

Do not change unrelated page/navigation/theme work already present on
`master`. The user's current visual styling is intentional. The remaining
implementation should stay inside the generic DataTable behavior/theme
boundaries plus the minimum development-only acceptance seam needed to close
the matrix.

#### Selection-driven sticky row parity

TranslationKey already declares:

```tsx
rowPinning={{ displayMode: "select-sticky" }}
```

The current selection controls pin an individually selected row into TanStack's
top pin region and the renderer applies only a top sticky edge. MRT's
`select-sticky` semantics are different at the presentation layer: one pinned
row can stick to the top **or** bottom of the scrolling table depending on which
edge it crosses.

Architecture target:

- keep TanStack `rowPinning` as the single state authority,
- do not duplicate a selected row into both top and bottom pin arrays,
- keep the row in normal rendered order for sticky mode,
- let `DataTableBodyRow` distinguish `select-sticky` from ordinary
  one-edge sticky pinning,
- calculate independent top and bottom stack offsets,
- for multiple selected rows, use forward order at the top and reverse order at
  the bottom,
- preserve `select-top`, `select-bottom`, explicit sticky/static modes and
  the existing select-all pin-clearing safety rule,
- do not introduce resource-local scroll listeners or duplicate row state.

This should be covered generically in the row-pinning tests and then verified on
the production TranslationKey table with a long 100/200-row viewport.

#### Density-independent shared footer

The pagination footer currently consumes `footerHeight` and
`footerPaddingBlock` from `DataTableDensityMetrics`. That coupling should be
removed.

Architecture target:

- Compact/Comfortable/Spacious continue changing table row/header/cell
  geometry,
- the pagination/selection footer keeps one fixed geometry,
- remove footer metrics from the density contract when no longer consumed,
- keep footer presentation themeable through the existing
  `RazethDataTable.pagination` slot,
- no resource-local `sx`.

#### Selection-aware footer surface

The selection bar is already embedded into the pagination footer. Keep that
single-footer composition, but make the outer footer aware of whether TanStack
currently has selected rows.

Architecture target:

- expose selected state on the Pagination root (for example
  `data-has-selection`),
- keep the embedded selection content background transparent,
- apply the selected footer background at theme level so the whole footer
  changes as one surface,
- clearing selection restores the normal footer background immediately,
- selected/unselected footer geometry must be identical and independent of
  density,
- table and card renderers must share the behavior.

#### Matrix A evidence still missing

After the parity changes above, Matrix A still requires:

1. **TranslationKey explicit same-lifecycle refetch evidence** — temporarily
   instrument the existing named provider/list lifecycle and perform one
   reversible mutation whose existing success path calls `refresh()`; capture
   the named provider plus the canonical
   `POST /api/v1/i18n/keys/query` request. Do not add a permanent product
   Refresh control just for the test.
2. **Controlled async filter-option error/retry** — provide a development/test
   deterministic failure-then-retry seam, prove the existing warning/Retry
   surface and successful recovery in both table and card modes, then keep the
   seam development-only or remove it.

The exact acceptance order and browser steps are maintained in
`docs/datatable-browser-matrix.md`.

Only after those items pass should Matrix A be marked complete.

Then run the baseline matrix in one controlled browser environment and record:

- mount cost,
- interactive update cost,
- DOM growth,
- scrolling behavior,
- table/card differences.

The decision must explicitly compare expected real-resource page sizes with the
synthetic stress cases.

If normal resource densities remain responsive, virtualization should be
deferred and 2.2 can close without adding another rendering subsystem.

If profiling demonstrates a material user-visible renderer bottleneck at a
realistic density, proceed to 2.2.3.

### 2.2.2 pre-gate viewport/fullscreen correction — 2026-09-30

Before continuing the remaining Matrix A parity gates, the shared presentation
viewport needed one bounded regression fix.

The normal page intentionally caps DataTable content height at
`calc(100vh - 350px)`, but that rule had become presentation-agnostic in the
wrong way:

- fullscreen inherited the normal-page cap,
- card mode had no scrolling presentation root and could be clipped,
- TranslationKey still had an older table-only resource viewport rule.

The correction keeps one generic ownership model:

```text
DataTableShell
  toolbar                         fixed chrome
  ContentRoot                     normal-page max-height owner
    table ContainerRoot           scroll viewport
    OR CardContainerRoot          scroll viewport
    pagination / selection        fixed chrome
```

Fullscreen changes only shell geometry:

- remove the normal-page max-height from ContentRoot,
- let the active table/card presentation flex into the remaining viewport,
- keep toolbar/footer intrinsic and visible.

No resource `sx`, no table/card duplicated server/query state, and no
TranslationKey-specific fullscreen behavior are introduced.

Browser acceptance for this correction is documented in
`docs/datatable-browser-matrix.md` and must pass before the remaining
A-PIN-DUAL-EDGE / A-FOOTER-* / A-REFETCH / A-FILTER-ERROR gates continue.

## 2.2.3 — virtualization architecture

**Status: conditional**

Implement only if 2.2.2 supplies evidence that virtualization is justified.

Any implementation must preserve:

- sticky headers,
- logical start/end column pinning,
- row pinning,
- selection,
- expansion/detail panels,
- keyboard accessibility,
- RTL,
- density,
- card/table mode boundaries.

The 2.2.1 fixture remains the before/after acceptance surface.

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
