# 1.7.10.7.5 — TranslationKey row selection and mutation safety

Status: implementation complete; automated acceptance green.

This slice connects the already-complete generic TanStack v9 row-selection
infrastructure to the TranslationKey resource. It does not move TranslationKey
mutation behavior into the generic DataTable.

## Resource contract

TranslationKey now opts into:

- the generic selection display column
- TanStack rowSelection state
- logical-start selection pinning
- the shared footer selection/status surface
- existing typed row-action disabled policy

The resource rule is explicit:

> Edit and Delete for a row are disabled unless that exact row is selected.

This preserves the mutation-safety behavior of the legacy MRT reference while
keeping the generic DataTable resource-agnostic.

## Column order and pinning

When detail expansion, selection, and row actions are enabled, the utility
columns are configured as:

```text
logical start
├── Details
└── Selection

logical end
└── Actions
```

TanStack logical pinning therefore mirrors automatically in RTL.

The selection column is the existing generic
`createSelectionColumn<TranslationKey>()`; TranslationKey does not implement
its own checkbox renderer.

## Controlled selection lifecycle

`useTranslationKeyDataTable()` owns TranslationKey selection as resource-local
presentation/application state:

```text
RowSelectionState
      │
      ├── same-query mutation refresh
      │      └── preserve selected loaded record
      │
      ├── canonical replacement drops selected ID
      │      └── prune stale selection
      │
      └── semantic query change
             └── clear selection
```

Semantic query changes include pagination, sorting, column filters, global
search, and explicit query replacement/reset.

Selection remains outside `DataTableServerQueryState` and therefore never
enters the TranslationKey HTTP request.

A canonical same-query replacement reconciles selected IDs against the loaded
server page once the replacement result has settled. This prevents a stale
off-page ID from continuing to authorize resource mutation commands.

## Row-action mutation safety

TranslationKey Edit and Delete continue to use the existing typed
`DataTableRowAction<TranslationKey>` boundary.

Their resource-owned policy is:

```ts
isDisabled: ({ row }) => !row.getIsSelected()
```

The generic action renderer already resolves `isDisabled` and presents the
disabled state. No TranslationKey-specific mutation code was added to the
DataTable action renderer.

## Footer selection surface

The shared DataTable selection bar is enabled in the existing pagination
footer.

For one selected loaded TranslationKey the left side contains:

```text
1 row selected   <translation key>   Edit selected   Delete selected   Clear
```

For multiple selected rows, the footer keeps the selected-count status but does
not pretend that TranslationKey has a bulk mutation API. Edit/Delete footer
commands are disabled unless exactly one selected row is loaded.

This intentionally distinguishes:

- multi-selection capability/status
- single-record mutation authorization
- future bulk mutation behavior

No bulk TranslationKey API was invented in this slice.

## Delete cleanup

After a successful TranslationKey delete, the deleted stable row ID is removed
from `rowSelection` before the existing refresh/page-recovery policy runs.

Other selected IDs are left untouched so the cleanup remains correct if later
resource policy permits broader multi-selection workflows.

## Automated acceptance

Coverage includes:

- selection utility column is opt-in and structurally non-sortable/non-filterable
- selection column is fixed-width and pinnable
- expansion then selection are pinned to logical start
- actions remain pinned to logical end
- same-query canonical refresh preserves a still-loaded selection
- canonical replacement prunes a selected ID that is no longer loaded
- global search clears selection
- column-filter changes clear selection
- sorting changes clear selection
- pagination changes clear selection
- Edit/Delete row commands are disabled for an unselected row
- Edit/Delete row commands are enabled for the selected row
- selected-row Edit opens the existing TranslationKey edit command
- one selected row exposes its TranslationKey identity in the footer
- multi-selection does not expose a single TranslationKey identity
- footer Edit/Delete commands require exactly one loaded selected row
- successful TranslationKey deletion removes the deleted row ID from selection

The generic DataTable selection tests continue to cover:

- individual checkbox behavior
- page-level select-all
- indeterminate select-all state
- selected-row status
- clear-selection behavior
- selection action context
- off-page selected IDs under manual pagination

## Boundaries

This slice does not add:

- bulk TranslationKey mutation endpoints
- selection state to server query semantics
- resource mutation logic to generic DataTable
- React Admin dependencies
- local `sx` customization
- browser acceptance work

Browser acceptance remains separately owned and deferred.

## Checkpoint

After this slice the TranslationKey proof is:

```text
1.7.10.7 TranslationKey production proof
├── 7.1 Create                              complete
├── 7.2 Edit                                complete
├── 7.3 Delete                              complete
├── 7.4 TranslationValue CRUD
│   ├── 7.4.1 Create                        complete
│   ├── 7.4.2 Edit                          complete
│   ├── 7.4.3 Delete                        complete
│   └── 7.4.4 continuity/validation polish  complete
└── 7.5 row selection + mutation safety      complete
```
