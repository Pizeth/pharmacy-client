# Sentinel configuration

Reference: https://better-auth.com/docs/infrastructure/plugins/sentinel

## Environment and endpoints

Set `BETTER_AUTH_IDENTIFY_URL` to the project ingestion **base URL** from
the Better Auth dashboard, for example `https://kv.better-auth.com/projects/PROJECT_ID`.
Do not append `/identify`; the SDK appends it.

The client repository's `next.config.ts` maps this one public URL to
`NEXT_PUBLIC_BETTER_AUTH_IDENTIFY_URL`. An explicitly supplied public variable
is also supported as a fallback. Restart Next.js after changing environment
configuration; production requires a rebuild because this value is bundled.
Never expose `BETTER_AUTH_API_KEY` through `next.config.ts` or `NEXT_PUBLIC_*`.

The backend configuration lives in `C:/pharmacy-api/src/lib/auth.sentinel.ts`.
It uses `BETTER_AUTH_API_KEY` privately. Its authenticated KV base comes from
`BETTER_AUTH_KV_URL`, or the origin of `BETTER_AUTH_IDENTIFY_URL`.
The browser's `/projects/PROJECT_ID` ingestion path is not a server KV prefix.
When neither URL is set, the SDK's default KV endpoint applies.

## Initial policy

- Credential stuffing: challenge after 3 failed attempts per visitor, block at
  10 within an hour, with a 15-minute cooldown. Successful logins clear failures.
- Bots and suspicious IPs: challenge, with automatic browser solving enabled.
- Impossible travel, IP velocity, email validation and stale accounts: log
  initially so shared office networks and VPNs can be assessed before enforcement.
- Email normalization stays disabled to avoid changing existing account identities.
- Existing `haveIBeenPwned()` owns breached-password enforcement; Sentinel does
  not duplicate its checks. Their endpoint coverage differs: Sentinel also checks
  `/set-password`, while the standalone plugin covers OTP resets and admin password
  operations. Neither should be described as checking existing passwords on login.
- Free-trial abuse protection challenges at 2 accounts and blocks at 3 per visitor,
  with a 90-day retention window. This counts account creation, not billing trials.
- Geo-blocking denies Thailand (`TH`) using the identified IP's country.
- Unknown-device notifications are enabled in configuration, but installed infra
  0.4.22 has a stubbed device check. Do not rely on this flag for working alerts
  until upstream implements the feature or a separate notification flow is added.
- Identify/KV requests have a 2-second timeout and two bounded retries. Challenge
  difficulty remains 18 to avoid unnecessary load on mobile devices.

## Cross-origin verification

The API must allow `X-Visitor-Id`, `X-Request-Id` and `X-PoW-Solution` as request
headers and expose `X-PoW-Challenge` and `X-PoW-Reason` as response headers.
These entries are configured in `C:/pharmacy-api/src/main.ts` alongside the
existing token headers. Keep the explicit trusted origins and credentials policy.

Restart/redeploy the backend after changes. Verify session loading, password
sign-in, One Tap, and challenge retry from the actual browser origin. Inspect
security events before promoting logging checks to challenge/block. Unit tests
validate configuration, not the external Sentinel service or a real user login.

## Dash and Prisma

Dash activity tracking is enabled with a five-minute update interval.
`User.lastActiveAt` is nullable and maps to `user.last_active_at`; its additive
Prisma migration is included in the backend repository. Apply migrations before
restarting the API with tracking enabled. Sentinel adds no Prisma models.
Managed directory sync has its own additional tables and is not enabled here.
