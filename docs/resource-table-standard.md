# Application resource table standard

All application table pages use the same TanStack v9 + MUI DataTable stack.
Start with `components/Tables/ResourceDataTable.tsx`, the application policy
wrapper used by HRD documents, translation keys and social providers. Do not
fork the renderer, introduce a raw MUI CRUD table or return to MRT for a new resource.
The core DataTable remains transport- and resource-agnostic.

## Shared presentation

The wrapper supplies full-width sizing, sticky headers, pagination, desktop
table/mobile card defaults at `md`, centered collapsible debounced search,
filter status/toggle, column manager, density, fullscreen, table/card toggle,
compact-card setting and light/dark switch. Resources may explicitly opt out
when a capability does not apply. A table without card content stays in table mode.
Visual preferences are scoped by a stable, unique `resourceId`; semantic server
query state stays in the query/URL adapter, never visual persistence.
Switching presentation must retain the same controller, filters and row identities.

The compact-card setting uses the shared `CompactCardToggle`: a two-icon pill
with a sliding selected indicator, descriptive tooltip, keyboard focus and
accessible switch state. Do not restore a text-labeled toolbar switch per page.

For every resource with card content, use `defaultDisplayMode="auto"` and
`autoCardBreakpoint="md"`: below `md` starts in cards, while desktop starts in
table view. Preserve explicit user preferences and allow a manual view switch.
Use HRD's shared breadcrumb styles and spacing above table pages and forms:
trail margin-top 1.5, no bottom padding, page padding-block 3, and no extra page
top margin. These are theme spacing units, not independent per-resource values.

Provide stable columns, records and `getRowId`. Define client filtering/sorting
only for complete client datasets. Server-paginated resources use the existing
Standard API/Refine adapters and retain their server pagination/search behavior.
Do not pretend that a list-only backend implements server query pagination.
Loading, retry, empty/no-results, stale-data/background-refresh and mutation
errors must be visible. Preserve prior usable rows while refetching.

Cards use the same row actions and selection state as the table. Keep actions
on the front, detail content on the back and a manual return control. Compact
cards keep essential identity and actions visible. Use resource detail renderers
for additional content; generic components must not know resource fields.

## CRUD

For mutable resources, support dialogs and deep-linkable dedicated
`create`, `edit/[id]` and `delete/[id]` pages. Reuse one validated form and mutation
implementation across both surfaces. Use the shared `FormDialog`,
`ResourcePage` and `ResourceActionButton` presentation primitives.
Validate route IDs and input; show missing records and API conflicts; prevent
duplicate submissions and closing during pending mutations. Delete requires
explicit confirmation and a safe cancel action. Never delete on page navigation.
Only advertise bulk operations if the backend actually supports them.

The translation-key and social-provider tables require explicit selection before
in-table Edit/Delete commands. Dedicated pages perform their own explicit save/delete
confirmation and backend authorization. Preserve stable selection across non-destructive
updates; remove deleted IDs from selection and pinning. Handle deletion of the
last row on a page so the UI does not strand users on an empty page.
Invalidate/refetch resource queries after success, keeping table preferences intact.

## Ownership and theme

Keep columns, cards, contracts, forms, API clients and route composition in the
owning feature, following `features/i18n/translation-keys` and
`features/admin/social`. Permanent presentation uses named typed MUI slots and
theme overrides; register slots in `theme.d.ts`. No CSS modules or local `sx`
except unavoidable measured runtime geometry. Preserve font variables and shared
content widths. Resource data must not live in theme defaults.

Footer social links remain app-wide shared links. Resource social-profile CRUD
must not replace that strip; see the explicit footer rule in `AGENTS.md`.

## Verification

Test the real shared table/controller with resource actions: search/filter/sort,
pagination, selection guards, modal/dedicated form parity, invalid IDs, API
errors, conflicts and query invalidation. Check table/card and compact modes,
fullscreen, keyboard focus/Escape and narrow/light/dark presentation. Keep
existing i18n server-query and HRD action behavior green; shared improvements
must not change transport semantics. Run TypeScript and focused tests and report
any browser or environment limitation explicitly.

Admin tables follow i18n utility order: Details, Selection, data columns, Actions.
Pin Details/Selection at logical start and Actions at logical end. Keep the modal
Create command in the toolbar; the dialog can link to its dedicated form route,
but do not add a second Open create page toolbar button.

Use ResourceTableLoading for initial table loads, matching i18n: cloud animation,
centered message, outlined surface, polite status and busy semantics. Only the
resource-specific message changes (for example Loading users…). ResourceDataTable
also exposes loading/loadingMessage for this shared surface. Never replace populated
rows with the initial loader during refetch; retain the non-blocking refreshing indicator.

Use `components/Tables/ResourceTableCreateButton` for every table Create command.
Its shared typed theme slot enforces pill corners, a contained neumorphic background and white
text/icons across color schemes and hover/focus/disabled states. Feature code owns
the label, icon, color and handler; do not duplicate those styles per resource.
Below `md`, the button becomes a 44px circle with only the plus icon visible.
Keep the full label available to assistive technology; desktop retains icon and text.
