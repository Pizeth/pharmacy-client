# Sentry for Agents

Use the one-time Sentry handoff code supplied through `SENTRY_HANDOFF_CODE`. Run the official Sentry installer from the intended repository with that variable injected, then follow the project context returned by the CLI.

```powershell
if (-not $env:SENTRY_HANDOFF_CODE) { throw 'SENTRY_HANDOFF_CODE is missing' }
$env:SENTRY_HANDOFF = $env:SENTRY_HANDOFF_CODE
try {
    Invoke-RestMethod 'https://cli.sentry.dev/install.ps1' | Invoke-Expression
} finally {
    Remove-Item Env:SENTRY_HANDOFF -ErrorAction SilentlyContinue
}
```

When the code is stored in Infisical, run this block in its injected process for the environment and folder that contain `SENTRY_HANDOFF_CODE`. Redeem the code once and remove the temporary secret after use. If the CLI reports an IP mismatch, request a new handoff with IP pinning disabled.

For the Next.js client, configure `NEXT_PUBLIC_SENTRY_DSN` at build time. The server uses `SENTRY_DSN` when provided and otherwise uses the public DSN. Supply `SENTRY_ORG`, `SENTRY_PROJECT` and the private, build-only `SENTRY_AUTH_TOKEN` together to enable source-map upload. Error capture requires a DSN. Verify browser and server events separately in a non-production environment and confirm that stack traces resolve to source.

For the NestJS API, set `SENTRY_DSN` for the API project's runtime. Verify an unexpected HTTP 5xx and confirm a validation error is excluded. The existing API error response is preserved.
