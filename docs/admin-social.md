# Admin social management

`/admin/dashboard` provides resource navigation and per-user social-profile management.
It defaults to the signed-in user; administrators can enter another numeric user ID.
`/admin/social-provider` uses the shared rich table/card stack for provider keys,
labels, website/icon metadata and enabled state. Create/edit/delete dialogs and
`create`, `edit/[id]`, `delete/[id]` routes share one validated form and mutation path.
The list-only backend is fetched as a complete dataset; sorting/filtering/pagination
run client-side. Row edits and deletes require selection, matching i18n.
See `resource-table-standard.md` for the application-wide table contract.
Both routes live under the existing authenticated/profile-gated application layout.
The client limits management to admin roles (including the backend's `sys-admin`);
NestJS remains the authority for `user:update` permissions.

Feature ownership is `src/features/admin/social`: Zod contracts and authenticated API
requests, pages, access checks, footer links, tests and named `RazethAdminSocial` styled slots.
These pages use the existing React Query provider. Social management uses live data and no new dependencies. Dashboard analytics use explicitly labeled sample data.

Backend contracts were read from `pharmacy-api/src/modules/users`:

- `GET/POST /api/v1/social-providers`, `PATCH/DELETE /api/v1/social-providers/:id`
- `GET/POST /api/v1/users/:userId/social-profiles`, `PATCH/DELETE .../:id`
- `GET /api/v1/users/contact/super-admin`

The API client unwraps the Nest response envelope, validates records and sends the existing
session cookie/bearer token. Mutation errors remain visible; delete requires an explicit dialog.
Deleting an in-use provider produces the backend conflict message; disable it instead.
Provider/profile changes invalidate both management data and the footer contact query.

The contact block uses the super-admin contact response on `/admin` routes.
The social-icon strip remains identical across the entire app and uses the shared
links in `components/icons/components/socials.tsx`. Administrator/user social profiles
must never replace these shared links, regardless of backend provider/profile support.
There is no dashboard statistics endpoint in the inspected backend; overview counts come
from the real provider list rather than invented metrics.

## Dashboard and user administration

`/admin/dashboard` includes clearly labeled sample KPI cards and accessible SVG
charts. Analytics values are illustrative and must not be represented as live
backend totals. Existing social-provider summaries and profile forms use live APIs.
Dashboard panels use registered `RazethAdminSocial` glass/neumorphism theme slots.

`/admin/users` belongs to `features/admin/users` and uses the shared table-query
backend for pagination, combined filters and search, plus the existing Better Auth
admin client for account mutations. It uses ResourceDataTable,
responsive cards, explicit row selection for Edit/Delete, and shared UserForm
content in dialogs and `/admin/users/create`, `edit/[id]`, `delete/[id]` routes.
Errors remain visible; deletion requires confirmation and self-deletion is blocked.
The server's permissions remain authoritative. No roles or permissions are invented
in the client. The Administration breadcrumb uses AdminPanelSettings, separately
from the Dashboard navigation icon.

User tables and cards show the account image with an initials fallback. Role badges
are centered in the table, resolve `roleId` before the Better Auth role string, and
accept optional Role.icon (a supported icon key) and Role.color (`#RRGGBB`).
Supported icon keys: shield, shield-check, user, user-round, crown, settings, users,
lock, badge-check. Unknown icons/colors fall back safely. Expansion loads the
admin-only display projection of role, linked account providers, and profile.
Account passwords and tokens are excluded at the backend select boundary.

Backend migration `20261026110000_role_display_metadata` adds nullable role icon/color
columns. Apply it through the backend migration workflow before deploying the new
`GET /api/v1/users/admin-roles` and `GET /api/v1/users/:id/admin-detail` endpoints.
The reviewed source patch is kept in `backend-patches/admin-user-display.patch`.

Role badges follow HRD FileTypeBadge presentation (pill-shaped corners, 1px/6px padding, tinted border/background and light/dark contrast mixes). Sys-admin always uses the primary theme tone; other roles retain optional configured colors.

## Detail and dashboard presentation

User details use separate Role, Account & sign-in, and Profile section rows in
table view. Cards use the same fields in a single-column layout with dividers.
Role/status badges and icon-only email verification are centered. Verification
icons retain accessible labels/tooltips. Connected providers have 2 spacing units
above their list, separating them from the count. Keep account credentials excluded.

Dashboard surfaces must use active theme CSS variables for both backgrounds and
text, including translucent glass fills (`theme.alpha` with `theme.vars` colors).
Do not alpha-blend a fixed light palette background beneath dark-mode text. Metrics
use readable numeric typography; charts use theme colors and accessible descriptions.
Profile settings are collapsed separately from the analytics overview. Sample data
must remain clearly labeled. Sign-in (`/login`) deliberately has no breadcrumb.

Card details use inline Label: value rows; table details retain separate label/value
blocks. Email-verification badges are 20px circles with no horizontal padding,
while text role/status badges remain pills. The shared MUI share navigation
icon uses the MUI secondary palette rather than inheriting the breadcrumb text color.
Card detail rows, including role, status and verification badges, are uniformly left-aligned; centered badge fields apply only to table details.

Admin presentation uses MUI icons throughout. Existing stored role icon keys are
retained and mapped to MUI equivalents; database values do not need migration.

Users query through `POST /api/v1/users/query`, with the same validated table-query
policy/Prisma translator/DBHelper stack as i18n. Name/email text filters, role/status
selects, sorting and global name/email/username search execute on the server. Multiple
filters compose with AND; active status includes legacy null banned flags. Changing
filters/sort/search returns to page one. The endpoint requires user-list permission
and selects only table display fields. Deploy this backend endpoint with the client.
Table Create actions share the rounded, white-text ResourceTableCreateButton, including FTS.

The table detail section heading column is 220px wide so Account & sign-in fits
on one line at desktop widths; card and narrow layouts retain stacked sections.
