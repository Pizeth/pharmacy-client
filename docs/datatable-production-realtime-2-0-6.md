# DataTable 2.0.6 — authenticated production realtime integration

## November 18 acceptance update

The historical local authenticated TranslationKey acceptance remains the baseline. Hosted migration, stream and replica verification remain open. The merged Document Tracking realtime work has its own delivery and authorization acceptance. See the [current acceptance inventory](datatable-next-acceptance-2026-11-17.md).

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

## PR recheck, visual follow-up and deployment pause

Frontend PR #55 passed CI, CodeRabbit and Vercel at report head
`383c240c02fa19c149c25d287e223be398f8ffe4`, with no unresolved threads.
Two late Qodo findings were subsequently posted on merged API PR #6: synchronous
shutdown during SSE setup and failure cleanup in the database harness. Both are
fixed and regression-tested in [API PR #7](https://github.com/Pizeth/pharmacy-api/pull/7),
head `f56f2d9d62355cd3649d20974766d3dcf83db210`. Full local follow-up validation:
**43 suites / 278 tests**, typecheck, changed-file lint and production build PASS.
This follow-up is not merged/deployed.

The user reported a Northflank security concern and revoked its Infisical access.
Further Northflank deployment and testing are paused; tests use the local
Infisical CLI. Login now succeeds and the test URL is injected without displaying
it. The corrected harness preserves the primary hostname-resolution failure,
closes clients and does not queue cleanup SQL before connection. That run failed
before creating any schema. Read-only DNS-over-HTTPS with system CA verification
confirms no IPv4 A record and one IPv6 AAAA record for the configured direct
Supabase hostname. Local acceptance needs the test project's session-pooler URL
on port 5432, or working IPv6 connectivity. Transaction pooling is unsuitable.

Current-source desktop visual check at 1280 px in dark mode: selection and native
detail render correctly without visible row overlap; selected IDs and the open
detail survive table/card switching. Enter on Back to key restores focus to Show
translations. Filtering to common retains both hidden selected identities and
keeps the bulk single-record commands disabled. Search, table mode and selection
were restored; no browser errors or data mutations. The agent-created tab was
closed when cloud testing was paused. This is desktop compatibility evidence,
not mobile or enabled realtime cross-client acceptance.

## Updated test connection: database delivery verified

After the test URL was updated in Infisical, the local CLI run passed using the
Supabase session pooler on port 5432. Two independent PostgreSQL listeners
received committed key, value and category changes; rolled-back writes emitted
nothing, and payloads contained identities only. The disposable schema was
removed and every client closed successfully. No credentials were printed.

This supersedes the earlier local DNS/connectivity blocker. It does not certify
authenticated browser-to-browser delivery, production migration status, proxy
streaming or realtime activation. Those rollout checks remain outstanding.
Backend PR #7 validation is 44 suites / 284 tests, typecheck, scoped lint and
production build passing at e5c6f21583c222bd839acd86710dbc1650edc78f.

## Local authenticated acceptance

The loopback harness uses the production Nest controllers, PostgreSQL listener,
Prisma adapter, Better Auth cookie sessions and CASL checks. Hosted Dash and
Sentinel integrations and JWT issuance are excluded from this cookie test.
The HTTP run verified shared event identities, canonical refetch, reconnect,
rejected origins and actors, and stream closure after permission, account or
session revocation. The browser run used the production frontend provider and
DataTable controller in a local fixture. An edit in each session appeared in the
other session's table or card without reloading, with the selected row preserved.

The test database was provisioned from the current Prisma schema with RLS
enabled and the realtime migration applied. Temporary records were removed
and application record counts returned to baseline. Production migration and
proxy streaming verification remain rollout gates.

Run the backend acceptance script from the API checkout under Infisical with
the explicit disposable REALTIME_TEST_DATABASE_URL:

```powershell
infisical run -- node --use-system-ca node_modules/tsx/dist/cli.mjs --tsconfig tsconfig.seed.json scripts/realtime-authenticated-acceptance.ts
```

Set REALTIME_TEST_ALLOW_SCHEMA_SETUP=true only to provision an empty test
database. For browser mode, run `node scripts/build-realtime-acceptance.mjs`
in the client checkout, then set REALTIME_TEST_BROWSER_BUNDLE to the absolute
path of the resulting bundle before starting the backend harness. Open the two
loopback URLs it prints, edit from each session and check the receiving view.
Use Finish and clean up to remove the fixtures and stop the server.

## Hosted disposable acceptance

The ASUS Tunnel's published hostname `realtime-test.razeth.com` forwards to
`http://127.0.0.1:8084`. Cloudflare Access protects that exact hostname. The
gateway and Next.js bind to loopback. The Nest API binds to all interfaces,
so keep inbound access to port 3085 blocked at the host firewall before
starting it. Run the API from the adjacent `pharmacy-api` checkout after
building it with `npm run build`.

Use Infisical's API development environment and an isolated Better Auth secret
that matches the disposable database's signing keys. Set
`REALTIME_TEST_AUTH_SECRET` securely in the launch environment before running
this command. The database identity check runs before any connection or seed.

```powershell
infisical.cmd run --env=dev -- node --input-type=module -e '
  import { getRealtimeTestDatabaseUrl } from "./scripts/realtime-test-database.mjs";
  const database = getRealtimeTestDatabaseUrl(process.env);
  const host = "https://realtime-test.razeth.com";
  const secret = process.env.REALTIME_TEST_AUTH_SECRET;
  if (!secret) throw new Error("Set the isolated Better Auth secret first.");
  Object.assign(process.env, {
    DATABASE_URL: database, DIRECT_URL: database, REALTIME_DATABASE_URL: database,
    REALTIME_ENABLED: "true", DOCUMENT_REALTIME_ENABLED: "false", PORT: "3085",
    BETTER_AUTH_URL: host, FRONTEND_URL: host, CORS_ORIGINS: host,
    BETTER_AUTH_SECRET: secret, ALLOW_PRODUCTION_SEEDING: "false",
    SENTRY_DSN: "", BETTER_AUTH_API_KEY: "", BETTER_AUTH_IDENTIFY_URL: "",
    BETTER_AUTH_KV_URL: ""
  });
  await import("./dist/main.js");
'
```

From the client checkout, build for the hosted origin and start Next.js in a
separate terminal. Supply the configured Turnstile site key through Infisical.

```powershell
infisical.cmd run --env=dev -- node --input-type=module -e '
  Object.assign(process.env, {
    NODE_ENV: "production", NEXT_PUBLIC_API_URL: "https://realtime-test.razeth.com",
    BACKEND_URL: "https://realtime-test.razeth.com",
    NEXT_PUBLIC_BACKEND_URL: "https://realtime-test.razeth.com",
    NEXT_PUBLIC_REALTIME_ENABLED: "true", NEXT_PUBLIC_DOCUMENT_REALTIME_ENABLED: "false"
  });
  process.argv = [process.execPath, "./node_modules/next/dist/bin/next", "build"];
  await import("./node_modules/next/dist/bin/next");
'
infisical.cmd run --env=dev -- node --input-type=module -e '
  Object.assign(process.env, {
    NODE_ENV: "production", NEXT_PUBLIC_API_URL: "https://realtime-test.razeth.com",
    BACKEND_URL: "https://realtime-test.razeth.com"
  });
  process.argv = [process.execPath, "./node_modules/next/dist/bin/next",
    "start", "--hostname", "127.0.0.1", "--port", "8085"];
  await import("./node_modules/next/dist/bin/next");
'
```

Start the loopback gateway from the client checkout with
`node scripts/realtime-test-gateway.mjs`. It forwards API requests to port
3085 and frontend requests to port 8085. Verify readiness on the ASUS host
and repeat the browser checks after signing into Access.

```powershell
curl.exe --fail http://127.0.0.1:3085/health/ready
curl.exe --fail -H 'Host: realtime-test.razeth.com' http://127.0.0.1:8084/login
curl.exe --fail -H 'Host: realtime-test.razeth.com' http://127.0.0.1:8084/api/auth/get-session
```

The final probe should return an empty session before app sign-in. Use a
profile-linked synthetic account, confirm the data is disposable before
editing, and verify fixture removal afterwards.

## November 22 production release gates

The authenticated TranslationKey round trip passed through the isolated ASUS
tunnel. The production release decision is **hold**.

| Gate | Evidence or remaining work |
| --- | --- |
| Production frontend build flag | Vercel maps `hr.razeth.com` to the ready production deployment of `aec143d`. It finished at 18:29 ICT on November 21. The current production-targeted `NEXT_PUBLIC_REALTIME_ENABLED=true` entry was created at 22:42 ICT that day. The public JavaScript served by that deployment still compares the environment lookup with `"true"`, with no enabled value inlined at the provider. |
| Authenticated production SSE | Previous API readiness and CORS preflight passed. Capture the production application's credentialed fetch and verify HTTP 200, `text/event-stream` and incremental heartbeat delivery. |
| Proxy and stream lifecycle | Verify Northflank idle behavior, buffering, reconnect and authorization revocation on a production-equivalent topology. Use approved synthetic data for checks that require a mutation or account change. |
| Replica delivery | Verify the deployed replica count and show that a committed update received by one replica reaches an independent subscriber on another. |
| Release authorization | Record rollout and rollback approval before changing production flags or deploying an enabled build. |

### Controlled production verification

After rollout approval, Vercel rebuilt the same `aec143d` commit and assigned
`hr.razeth.com` to deployment `dpl_HjpmhDG9QXs3ZfYfwhLFnHjhDWy7`. The prior
deployment `dpl_2spQa3QtrAtm4YkzQ4868b9Sr45c` is the rollback target.

Two signed-in production tabs verified live create, edit and delete delivery
without reloading. The temporary translation key was removed and the total
returned to 30. This establishes end-to-end live delivery for the observed
browser sessions. Heartbeat timing, automatic reconnect after a dropped
stream, and revocation remain open.

On November 23, the [production Northflank service](https://app.northflank.com/t/razeths-team/project/razeth-api/services/razeth-api)
confirmed that `api.razeth.com` was running one of one API instances on
commit `9726bd8` with zero restarts. Cross-replica delivery does not apply to
this topology and remains a gate before scaling beyond one instance.

### Production edge comparison and isolated recovery

- The same authenticated synthetic session reached both production API
  hostnames. The Northflank service hostname returned HTTP 200 and delivered
  two heartbeat comments at 15.8 and 30.8 seconds. The custom hostname
  `api.razeth.com` returned HTTP 200 and the initial event, then closed before
  a heartbeat was observed. HTTP/1.1 and HTTP/2 probes reported protocol
  errors on the custom hostname. DNS and response headers showed that the
  custom hostname used the Northflank Fastly CDN.
- In a controlled routing trial, the direct custom-domain route redirected
  HTTP to HTTPS and returned HTTP 200 for readiness, but omitted HSTS. The
  CDN was restored. Public readiness returned HTTP 200 with the original
  `Strict-Transport-Security: max-age=31557600` header after rollback.
- Production authorization for new streams returned HTTP 200 before the
  synthetic observer's TranslationKey grant was revoked and HTTP 403
  afterward. Closure of an already-open production stream remains unverified.
  The reusable observer was disabled and its sessions removed.
- In the disposable loopback browser harness, one stream was interrupted
  while the other authenticated session edited a key. Restoring the stream
  triggered automatic catch-up and delivered the next edit without a page
  reload or losing selection. The authenticated HTTP harness also verified
  closure of an open stream on grant revocation and HTTP 403 on a new
  connection. Disposable fixture cleanup passed.
- In a loopback simulation, a 10-second proxy idle timeout closed the stream
  before the 15-second heartbeat. A 5-second control delivered three
  heartbeats. The simulation establishes the effect of that timeout, while
  production's effective edge timeout remains unconfirmed.

Northflank Support was asked to confirm the effective timeout and advise on a
route-specific override that preserves TLS, HSTS, and authenticated-stream
cache policy. Keep the current production routing and heartbeat settings
while waiting for that confirmation. Retest production heartbeat, reconnect,
and closure of an already-open stream after an agreed remediation.
