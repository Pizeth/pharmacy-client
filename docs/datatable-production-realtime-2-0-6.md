# DataTable 2.0.6 — authenticated production realtime integration

## Scope and decision

Frontend base: `0cb5822b20297f3746cb8db65cb288522eb703d0`.
Backend base: `6397beb2e34a75f631228896fa65898f5b013b65`.
Separate `codex/production-realtime` branches; the backend runs in an isolated
worktree without changing the user's running development server.

**Outcome B — implementation complete, rollout gated.** The existing 2.0.1–2.0.5 generic event, reconciliation,
table-state safety and Refine fixture proof are preserved. This phase adds the
missing backend delivery and TranslationKey production subscription. Simulated
provider tests are not evidence of production cross-client delivery.

## Transport and transaction boundary

The backend already has PostgreSQL, `pg` and persistent Northflank containers.
No existing Redis, queue or shared live bus was found. Replica count and proxy
streaming configuration are not verified. Each enabled API instance therefore
uses a **dedicated session connection** to the same database and `LISTEN
datatable_live_v1`; a process-local emitter is not the publisher.

Migration `20261102000100_translation_realtime` installs row triggers on
`translation_keys`, `translations` and `translation_category`. PostgreSQL delivers
`pg_notify` after commit and discards it on rollback. This covers key create,
update and delete, nested translation mutations, category renames and writes
outside the current Nest controller. No application transaction is rewritten.
Notifications contain identities only, never text, profile data or document data.

Wire v1: `version`, UUID `eventId`, `resource: translations`, `type`
(`created | updated | deleted | invalidate`), ISO `occurredAt`, optional string
`recordId`. Translation-value changes emit `updated` for their parent key.
Category changes invalidate the resource. Initial connection/reconnection emits
a fresh `invalidate` envelope with `reason: resync`. No record revision or durable
event ordering guarantee is invented.

Authenticated `GET /api/v1/live/translations` uses SSE over HTTP. Fetch streaming
allows HTTP authentication failures to be distinguished from network errors;
the application uses its existing cookie credentials, with no URL token. The
backend also accepts Better Auth's existing Bearer strategy for non-browser
clients. Client decoding discards unknown versions/resources and arbitrary payloads.

References: [PostgreSQL NOTIFY](https://www.postgresql.org/docs/current/sql-notify.html),
[LISTEN](https://www.postgresql.org/docs/current/sql-listen.html),
[Supabase connections](https://supabase.com/docs/guides/database/connecting-to-postgres),
[Better Auth sessions](https://better-auth.com/docs/concepts/session-management).

## Authorization and lifecycle

- Better Auth authenticates the handshake. The stream independently calls
  `getSession(disableCookieCache: true)` and builds a fresh CASL ability before
  opening, before **each** notification and on every 15-second heartbeat.
- `read / TranslationKey` is required. Delegated resource managers retain their
  existing CASL implication; document handlers gain no translation access.
  Disabled/locked/inactive users and disabled roles fail closed.
- Session expiry, logout or permission revocation closes the stream before its
  next notification. Idle revocation detection is bounded by the heartbeat;
  it is not described as instantaneous. CORS origin allowlisting is preserved
  and independently enforced by the endpoint.
- Disconnect, shutdown, slow writers and queue overflow clean up timers and
  subscriptions. At most 64 pending events are allowed per connection. Clients
  reconnect instead of buffering unbounded notifications. Connections renew
  after five minutes. Database listener loss closes active browser streams.
- PostgreSQL notifications are **not a durable event log**. There is no replay
  based on Last-Event-ID. Every new connection and database recovery causes
  canonical revalidation to repair gaps. The listener retries at 1–30 seconds.
- Each tab has its own authenticated connection, shared by list consumers within
  that provider. The client handles disconnect, visibility/online recovery,
  duplicate notifications, unmount and bounded exponential reconnect (1–30 s).
  Opening and idle reads time out at 45 s. HTTP 401/403 stop retries until remount.

## TranslationKey integration

Refine registers the gated production provider, but `liveMode: off` remains
explicit both globally and in the existing list request bridge. The dedicated
`useRefineDataTableLiveSubscription` passes normalized events to
`useDataTableLiveServerResult`. No event bypasses the generic reconciliation
policy or changes the Standard API request/query cache architecture.

Identity-only events deliberately refetch; there is no local row replacement
proof for manual filter/sort/page membership. Refreshes batch in a 250 ms window;
notifications arriving during an in-flight request retain one trailing refresh.
Known deleted IDs use the existing generic state-removal helper; absence from a
page does not erase off-page selection. Background rows, controlled query state,
pinning/expansion safety and the same table/card instance remain authoritative.

## PR #54 follow-up

Q1 is valid as a cost: the focused DOM regression verifies expanded callback
invocation **and committed output** for three transient resize updates, while
collapsed native callbacks remain uninvoked. A callback may read
`table.state.columnResizing.deltaOffset`; excluding that slice would be stale.
Broad invalidation is retained. No latency/production profiling improvement is
claimed. Explicit bounded dependencies belong to 2.2.3.8.

Q2: the exported low-level detail row still accepts `table` for source
compatibility, now optional and deprecated. Its production caller omits it.
A nested-AppTable regression passes an outer table deliberately and verifies
the callback receives the nearest inner context and live inner selection.

## Deployment sequence and acceptance gates

1. Review both PRs. Keep `REALTIME_ENABLED` and
   `NEXT_PUBLIC_REALTIME_ENABLED` unset/false. Either codebase is backward
   compatible while gates remain off.
2. Apply the normal Prisma migration in the deployment pipeline; no reset,
   seeding or role-grant replacement. Migration has **not** been applied here.
3. Set backend `REALTIME_DATABASE_URL` to a dedicated direct/session connection.
   Never use transaction-mode Supavisor/PgBouncer. One connection per replica
   must fit the connection budget. Enabled startup/listener refuses readiness
   until all three migration triggers are enabled.
4. Verify Northflank/proxy SSE flushing, no response buffering, cookie/CORS
   behavior, idle timeouts, restart/reconnect and actual replica-wide delivery.
5. Use a disposable database and two independent authenticated sessions. Verify
   actual table output after external create/update/value/delete with active
   filter/sort/page, selected/off-page IDs, bursts, loss/reconnect and revoked
   access. Then enable the frontend build gate and conduct the browser matrix.

`node scripts/realtime-postgres-acceptance.mjs` in the backend requires
`REALTIME_TEST_DATABASE_URL`; it never falls back to `DATABASE_URL`. It creates a
unique scratch schema/channel, runs the real trigger SQL there with two independent
listeners and commit/rollback checks, then drops only that scratch schema. This
is a database delivery proof, not authenticated-browser acceptance. Without that
explicit test configuration it exits 2 with **BLOCKED**.

## Document Tracking 2.0.7 plan

No document channel is exposed by this phase. Registration, record changes,
progress, attachments, archive, reassignment and visibility changes will require
transaction-committed notifications routed through a server-authorized scope.
Do not broadcast private document IDs on the translation channel or a global
public stream. Re-evaluate current per-record visibility before delivery and
canonically refetch; reassignment/revocation must invalidate the previous viewer's
query without granting broader progress rights. Preserve `isTrackingAdmin`,
delegated management and assigned-handler distinctions. Reuse this transport and
the generic executor after completing authorization/cross-client tests.

## Validation record

Backend fresh `npm ci`, Prisma generation, typecheck and production build passed.
Full backend suite: **41 suites / 267 tests passed**. Frontend validation, browser
observations and review links are recorded below as they complete.

Initial frontend full suite: **197 suites / 1,144 tests passed** (default timeouts).
Additional focused coverage proves trailing refetch after a stale in-flight query,
Activity effect cleanup/restoration, and isolation of throwing stream consumers.
CodeRabbit's two frontend lifecycle findings were reproduced and corrected;
backend review additionally requested explicit disconnect/lifetime cleanup tests.
New frontend files pass ESLint; the existing controller expansion-effect lint
finding is unchanged. No lint rule or timeout was changed.

Gate-off current-source browser (`http://localhost:8080/admin/i18n`): authenticated
30-record list, row 8 selection enables Edit, expansion creates one physical detail
row, card switching preserves selection and the open back face. Returning to the
table and clearing selection disables Edit again. No browser errors, no mutations,
and preferences restored. [Screenshot](evidence/datatable-realtime-2-0-6/gated-card-continuity.png).
This does not validate enabled realtime delivery or a second authenticated client.

Paired draft PRs: [frontend #55](https://github.com/Pizeth/pharmacy-client/pull/55)
and [backend #6](https://github.com/Pizeth/pharmacy-api/pull/6). Initial integration
heads `593275ae51fb1422657c7b060fb25aac34e3ca54` and
`971f31e219662b211b68604d4b86da8b42f12208` passed
[frontend CI](https://github.com/Pizeth/pharmacy-client/actions/runs/41430133545)
and [backend CI](https://github.com/Pizeth/pharmacy-api/actions/runs/41430120123).
Review follow-up heads and final checks are tracked in those PRs.

Disposable database/two authenticated client acceptance: **BLOCKED**, no explicit
test database is available to the acceptance process yet. The user configured
the test URL in Infisical; its environment/path and executable integration access
are still needed. Existing `.env` database credentials were not used.
The user subsequently authorized backend merge/Northflank deployment after green
CI/review. That authorization does not enable realtime or redirect the regular API
to a test database. Migration, enabled cross-client delivery and infrastructure
acceptance remain separate gates; current deployment status is tracked in API PR #6.

Final source validation:

- Client `6314d0eadebd91af20a523d0f4ea9c0975c70c1c`: isolated strict lockfile
  install, generated feature audit and typecheck PASS. **197 suites / 1,147 tests
  PASS**, 562.806 s. [Final source CI](https://github.com/Pizeth/pharmacy-client/actions/runs/41438272170),
  CodeRabbit and Vercel pass; both lifecycle findings are fixed and resolved.
- API `bb50b7ac2192ae231d5e2e0a83837f07b426b367`: fresh install, Prisma generation,
  typecheck, changed-file lint, **42 suites / 272 tests PASS**, 60.799 s, and
  production build PASS. [Final source CI](https://github.com/Pizeth/pharmacy-api/actions/runs/41446977261)
  passes. Outside-diff request-close and trigger-identity findings are fixed.
- A real Nest module-graph regression rejects the reported AuthService visibility
  failure: the installed async library module is global by default and exports
  AuthService. Importing RealtimeModule first still resolves it. No auth wiring
  change was necessary. This is not a live-session acceptance test.
- Both feature gates default off and were not activated by this task. No
  dependency/lockfile update, timeout increase, lint disable, role-grant change,
  virtualization or broad subscription optimization was introduced.

## Backend deployment observation

After final CI/CodeRabbit passed, the user authorized merging API PR #6.
Backend master is `90d2039197c3ef21944b3260208e6d97c216db55`.
[Northflank build focused-quince-7964](https://app.northflank.com/t/razeths-team/project/razeth-api/services/api/builds/focused-quince-7964)
reports success for that commit. The live
`https://api.razeth.com/api/v1/live/translations` changed from HTTP 404 before
deployment to HTTP 401 without credentials afterward. This proves the protected
route is deployed and rejects an unauthenticated request; it does **not** prove
an authorized stream, applied production triggers or cross-client delivery.

The user placed `REALTIME_TEST_DATABASE_URL` in Infisical. Local injection was
attempted without printing values, but the CLI has no valid login session.
The installed npm shim targets a zero-byte extensionless file; the usable CLI is
`%APPDATA%/npm/node_modules/@infisical/cli/bin/infisical.exe`. Use that executable
for interactive login, then inject the test environment into the explicit
acceptance script. Alternatively execute the packaged script in a separate
Northflank job with that test secret. No production `.env` fallback is allowed.
Frontend PR #55 remains draft; backend merge does not approve realtime activation.
