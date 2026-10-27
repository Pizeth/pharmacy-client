<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Application presentation and feature organization

Read `docs/hrd-architecture.md` before changing HRD or its former Link feature.
Follow `src/features/i18n/translation-keys` for feature ownership and
`PublicDocumentsTable.tsx` / `styles/styled.ts` for MUI slot registration.
Use named, typed styled slots and theme rules for permanent presentation.
Do not add CSS modules or local `sx` unless runtime geometry makes it unavoidable.
Preserve the theme's font variables, background switch, shared content width,
and full-width footer.

## Shared footer social links

The footer social-icon links are the same across the entire app, including
`/admin` and HRD routes. Keep using the shared social links from
`src/components/icons/components/socials.tsx`. Do not replace this social strip
with administrator/user social profiles or route-specific social links.
Backend social-provider/profile support does not change this rule.
Route-specific contact details may populate the contact block separately.

## Resource tables and CRUD

Read `docs/resource-table-standard.md` before implementing or changing any
application table page. Use `ResourceDataTable` from
`src/components/Tables/ResourceDataTable.tsx` over the shared TanStack/MUI
DataTable stack; do not build a separate raw MUI/MRT CRUD table.
Reuse application toolbar, responsive table/card behavior, resource-scoped
visual persistence and theme slots. Keep API contracts, columns, cards,
selection/mutation policy and forms feature-owned. Share the same validated
form and mutation logic between dialogs and dedicated create/edit/delete
routes. Never invent server capabilities or bulk mutations for parity.

Tables with card content default to cards below the `md` breakpoint and tables
at `md` and above. Use `defaultDisplayMode="auto"` with `autoCardBreakpoint="md"`
through ResourceDataTable; retain explicit user view preferences and manual toggles.

## Accessible breadcrumbs

Every application page except sign-in (`/login`) should have exactly one breadcrumb navigation trail.
Sign-in intentionally has no breadcrumb.
`DrawerAppBar` supplies `SiteBreadcrumbs` for shared app routes, and the auth
layout supplies it for login. Feature layouts that render their own trail
(currently HRD) must pass `breadcrumbs={null}` to the shell to avoid duplicates.
Keep breadcrumbs above page content, within the shared content width. Use real
ancestor links, an accessible navigation label, keyboard-visible focus, and one
non-link current item with `aria-current="page"`. Group edit/delete record
segments so breadcrumbs never link to nonexistent intermediate routes.

HRD is the breadcrumb visual standard for every route: reuse
`components/layouts/breadcrumbStyles.ts` for padded items, faint hover, and the
current item's selected background/primary underline. Preserve HRD localization
and feature theme slots. Use a 1.5-spacing top margin on the trail, no bottom
padding, and 3-spacing page padding before content (24px with the standard theme).
Do not stack an additional ResourcePage top margin or breadcrumb bottom padding.

Table initial loading uses the shared ResourceTableLoading (i18n cloud loader),
with resource-specific text only. Background refresh must preserve visible rows.

## Application role authorization

Application role administration uses the existing Role/RolePermission/Permission
chain through User.roleId and CASL. Better Auth role strings do not authorize
`/admin/roles` management. Preserve resource attribute/object policies, bootstrap
role protections, version checks and transactional audit records. See
`docs/application-roles.md`; do not add parallel role tables or claim unsupported
ABAC condition editing.

## Organization and HR reuse

Organization and HR data are authoritative: document tracking must reuse the
existing User/Profile/EmploymentHistory and versioned Department/Ministry models.
Do not introduce parallel staff or office catalogues. Resolve effective assignments
and organization versions; preserve receipt-time references and display snapshots
so transfers and renames never rewrite handling history. See
`docs/document-tracking.md` for the integration contract.

## Icon consistency

Prefer `@mui/icons-material` wherever an equivalent exists. Keep icons within a
feature in the same MUI family; use another library or a custom icon only when
MUI has no suitable equivalent or the user explicitly requests a specific icon.
Preserve palette colors, accessible labels and stored icon-key compatibility.

Every table toolbar Create action uses `ResourceTableCreateButton`: pill-shaped,
contained, neumorphic, and white text/icons in both themes and interaction states.
Below `md`, show only the plus icon in a 44px circular target while retaining
the full accessible name. Do not use
a raw Button or per-page styling for table Create commands.
