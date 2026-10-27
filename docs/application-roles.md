# Application role administration

`/admin/roles` manages the existing `Role`, `RolePermission` and `Permission`
records used by CASL through `User.roleId`. Feature ownership is
`features/admin/roles` in the client and `modules/roles` in the API. It uses the
shared ResourceDataTable, role badges, custom inputs, loader, breadcrumbs,
responsive cards and modal/dedicated create/edit/delete forms.

The existing schema already supplies icon/color metadata, enabled state,
timestamps, actor IDs and `objectVersionId`, plus an AuditTrail Role target.
No new role-model columns or duplicate authorization tables are needed. The
`20261027140000_private_application_authorization` migration enables row-level
security and keeps browser grants revoked for roles, permissions, role links,
identity and audit tables. The existing Prisma backend owner/BYPASSRLS connection
continues to enforce access through the guarded API; no public policies are added.

## Authority

Every endpoint uses the existing session AuthGuard and resolves the actor from
the database. Role management requires an enabled application `SUPER_ADMIN`
role linked through `User.roleId`, with an active, non-banned, unlocked,
non-deleted account. Better Auth's `User.role` string and client identity claims
do not authorize role management. Granting `manage Role` to another application
role does not override this explicit super-admin restriction.

This screen manages action/subject grants already understood by the current CASL
factory. Object and attribute checks in resource policies remain in effect.
It does not introduce an arbitrary condition-JSON editor or replace those policies
with Better Auth's built-in RBAC. Unsupported legacy permission rows are labeled
as not evaluated; existing assignments may be retained or removed, while new
unsupported assignments are rejected. Permission definitions themselves are not
created or deleted by this UI.

## Mutation guarantees

Role names normalize to uppercase letters, numbers and underscores. Colors are
validated six-digit hex values; badge icons use the existing supported key set.
Bootstrap identities (`SUPER_ADMIN`, `SYS_ADMIN`, `SYSTEM_ADMIN`) cannot be
created by this API, renamed, disabled, deleted, or have their permissions changed.
Their descriptions, icons and colors remain editable. Ordinary roles can be
enabled/disabled and edited by a super admin.

Assigned roles cannot be deleted. Counts include all referencing users, and the
database foreign key also prevents a concurrent assignment from being orphaned.
Reassign users before deleting a role. This feature does not reassign users or
modify Better Auth role strings.

Create/edit/delete and the corresponding AuditTrail write run in one transaction.
Writes take a transaction advisory lock for this management surface and re-read
the actor's authority. Edits/deletes require the expected object version.
A stale update receives `409` with `ROLE_VERSION_CONFLICT` and cannot replace
newer grants. The UI preserves its draft and requires reopening after that error.
Duplicate-name conflicts allow correction within the same form.

Audit records retain role identity, display metadata, enabled state, version and
permission IDs before/after changes, including after deletion. CASL reads current
database grants per authorization check; no session-role synchronization or
permission cache invalidation is required. Client user-role display queries are
invalidated after successful changes.

## API and verification

The guarded route is `/api/v1/roles`:

- GET `metadata`: permission catalogue and supported badge icons.
- GET: complete role catalogue with grants and assigned-user counts.
- GET `:id`: current record for a form.
- POST: create role and grant links.
- PATCH `:id`: edit with expected version.
- DELETE `:id`: delete an unassigned custom role with expected version.

The complete catalogue is filtered/sorted/paginated by the shared client table.
There is no pretend server-query or bulk-delete API.

Tests cover selection gates, form parity, metadata denial, catalog filtering,
stale versions, duplicate names, protected roles, invalid IDs and named theme slots.
API tests cover current database authority, supported grants, audit writes and
concurrent conflicts. The API's `scripts/roles-smoke.ts` exercises the real
schema/service/CASL chain and rolls back all sample users, roles, links and audits:

```sh
node node_modules/tsx/dist/cli.mjs --tsconfig tsconfig.seed.json scripts/roles-smoke.ts
```

Existing administrative seed commands deliberately restore baseline role and
permission definitions. They are not part of normal app startup; running them
after UI changes may replace baseline grants or descriptions. Do not use seeding
as a routine deployment step or claim that seed commands preserve custom edits.
