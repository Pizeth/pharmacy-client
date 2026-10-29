# Application resource table standard

All application table pages use the same TanStack v9 + MUI DataTable stack.
Start with `components/Tables/ResourceDataTable.tsx`, the application policy
wrapper used by HRD documents, translation keys and social providers. Do not
fork the renderer, introduce a raw MUI CRUD table or return to MRT for a new resource.
The core DataTable remains transport- and resource-agnostic.

## Shared presentation

Admin display dates use `d MMMM yyyy` (for example, `26 October 2026`), without time by default. Explicit time displays append `HH:mm`. Date/time editors retain `dd-MM-yyyy HH:mm`. Use
`lib/utils/adminDate.ts` for display (Cambodia office time); keep transport
timestamps as ISO strings. Date editors must use an explicit display format
instead of relying on the browser's locale-dependent native date format.

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

Admin account forms reuse signup's structural name/username/email validators
and debounced availability checks. Skip availability checks for unchanged
identifiers during editing; the server's uniqueness constraint remains the
authority for races. Temporary passwords retain the API's minimum length;
they do not use signup's password-strength/confirmation workflow.

For mutable resources, support dialogs and deep-linkable dedicated
`create`, `edit/[id]` and `delete/[id]` pages. Reuse one validated form and mutation
implementation across both surfaces. Use the shared `FormDialog`,
`ResourcePage` and `ResourceActionButton` presentation primitives.
Validate route IDs and input; show missing records and API conflicts; prevent
duplicate submissions and closing during pending mutations. Delete requires
explicit confirmation and a safe cancel action. Never delete on page navigation.
Use `components/forms/FormActions` for form/dialog footers, following i18n:
Cancel first and the primary action last in DOM order. Desktop uses a
right-aligned row; below `sm`, full-width buttons stack with the primary action
above Cancel. Keep general toolbar, badge and metadata rows separate.
When a dedicated route exists, pass `dedicatedPageHref` and a descriptive
`dedicatedPageLabel` to `FormDialog`. It renders a small title-bar icon beside
Close, outside the scrolling form, and disables navigation while pending.
Do not add a second full-size navigation button inside the form body.
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

## Record details and edit snapshots

Every admin resource table has a dedicated read-only `/<resource>/<id>` page and a visible **View details** action in both table and card presentations. Keep inline expansion available as a quick preview. Use `ResourceDataTable.onViewRecord` to enable row-surface navigation: only explicitly selected rows/cards are clickable or keyboard-focusable for navigation. Buttons, links, selection, expansion, and editable descendants must not activate the row. View details itself is available without selection. Public download tables retain their separate download behavior.

Initialize modal and dedicated edit forms from a fresh resource read scoped to the record and editor session, rather than a cached table/list snapshot. Show loading/error states before mounting the form. Preserve the editing snapshot and draft during background refreshes; never reset dirty fields behind the user. Populate every editable saved value, including nullable display metadata. Password inputs intentionally remain empty. When a nullable badge color has no stored HEX value, identify the shown theme default explicitly and preserve database NULL until the user chooses a custom color.

### Dedicated record workspaces

A dedicated detail route is a full record workspace, not an expanded-row panel rendered alone. Use `ResourceRecordPage` and its named `RazethResourceRecord` slots for a record hero, status/summary metrics, responsive main/sidebar sections, related records, available actions and record metadata. Keep panel renderers compact and separate from page composition. Use feature-owned content for permission groups and assigned users, account/profile/provider connections, translation coverage and locale editing, and document stage assignments/attachments/history. Only display fields and relationships supplied by existing APIs; retain optional timestamps from responses, and explicitly identify missing data or unsupported counts. Never manufacture audit activity or statistics. Reuse existing validated mutation dialogs and dedicated confirmation routes from workspace actions.

Record routes can publish an already-loaded display name with `useBreadcrumbLabel(path, label)` from `components/layouts/breadcrumbLabels`. Keep record fetching feature-owned; breadcrumb rendering must not make a duplicate API request. Scope labels to the full route and clean them up when the page unmounts. User profile/edit/delete breadcrumbs show the user's name, with a descriptive fallback while loading rather than a raw ID.

### Display-only record details

Never show internal database IDs, UUIDs, connection IDs, foreign keys or optimistic-lock versions as detail facts in panels or dedicated pages. Keep IDs internal to API requests, React keys and route destinations. Breadcrumbs use loaded display names with descriptive loading fallbacks. Preserve meaningful document reference numbers and locale codes.

Social profiles render as colored, icon-only profile links using safe HTTP(S) URLs, descriptive accessible names and tooltips. Do not add visible handles, ID metadata or a separate Open profile action. Use `ResourceBadge` / `ResourceStatusBadge` for resource badge surfaces, including tables, cards and details; role and circular verification badges share the same base style. Active/Banned and Enabled/Disabled statuses must reuse the shared status component rather than filled MUI Chips or plain text in other views.

Dedicated record pages omit redundant outer page titles and subtitles: the breadcrumb identifies the route, and the record name remains the accessible h1. Place Back to list and Edit inside the record hero/cover using RecordPageActions. Keep navigation available during loading and error states. Facebook profile links use the shared custom Meta icon.

Resource forms share `resourceFormStyles`: 2-spacing field gaps, no accumulated input margins or form top padding, and shared FormDialog content padding (3 desktop / 2 mobile). Keep helper text for actionable constraints or validation; omit date-format/timezone captions when the date editor already presents the format. File uploads use a rounded MUI label button with a visually hidden native file input. Dedicated detail content actions use error for Edit/Manage and primary for Delete; cover navigation keeps its existing presentation.

Use shared FormActions for every dialog and dedicated CRUD form footer. Its buttons use the shared rounded neumorphic idle/hover/focus treatment while preserving semantic colors and contained-button contrast; retain the mobile stacked primary-above-Cancel layout.

### Table pages and inline detail presentation

Table landing pages omit ResourcePage headings and subtitles (`showHeader={false}`); the shared breadcrumb supplies location. Keep dialog and dedicated form headings. Create headings use a resource-specific MUI icon (person, role shield, share, translation, document), falling back to Add when no suitable icon exists. Edit headings use Edit; delete/archive headings use Delete/Archive.

Use ResourceDetailPanel, ResourceDetailSection and ResourceDetailFacts for new inline expansion content. Follow Users/i18n: each section has an icon/title and separate content region; table mode uses a 220px heading rail with grouped facts, while card mode stacks sections and renders left-aligned `Label: value` facts. Match status/role badge alignment to the Users panel (centered in tables, left in cards). Retain feature-owned queries and actions; panels stay compact and dedicated record pages remain full workspaces. Existing Users/i18n named slots remain the visual references.

Badges have intrinsic width and must never stretch across a grid track. Locale tones are resolved by getTranslationKeyLocaleColor in columns, card previews, panels and record pages: English primary, Khmer secondary, with stable fallback colors for other locales. Never derive locale colors from row order.


### Detail alignment, actions and loading

- Detail facts are left-aligned in both table expansion and cards; column alignment does not determine detail alignment. Account overview uses inline label/value facts.
- Resource tables and cards expose three inline actions with consistent shared icon geometry and explicit semantic colors. Additional actions use the overflow menu. Portal/menu dismissal must never trigger selected-row navigation.
- Use ResourceFormLoading skeletons while loading form/edit snapshots. Reserve ResourceTableLoading for tables. Edit snapshots must preserve stored values using the feature-owned API. User editing intentionally uses Better Auth usersApi.get; usersApi.detail supplies the richer dedicated profile view. Password-manager autofill can replace a correctly loaded username and is not a reason to switch API sources.
- Document management is an explicit backend-enforced manage/TrackedDocument grant. Role editors display permissions returned by the server catalog; never fabricate permission IDs.

- Table/card action accents: delete/archive uses primary, edit uses error, and view uses the neutral foreground (white in dark mode, readable foreground in light mode). Apply the same mapping to selection toolbar actions.

- FormDialog heading dividers and circular resource-icon backgrounds use signature gold (#FFD22B), independent of warning colors. Icons on that gold surface use a dark foreground for contrast.
