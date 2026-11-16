# Better Auth infrastructure insights

Reviewed against installed Better Auth 1.7.12, its SDK implementation, and the
documentation index at https://better-auth.com/llms.txt.

## Implemented configuration

Backend ownership: `C:/pharmacy-api/src/lib/auth.ts` and `auth.security.ts`.

| Insight | Configuration | Reason |
| --- | --- | --- |
| OAuth state cookies | `account.skipStateCookieCheck: false` in every environment | Bind the callback to the browser that started the flow. |
| Proxy IPs | `advanced.ipAddress.ipAddressHeaders: ['x-forwarded-for']` | Northflank supplies this header. Cloudflare is DNS-only here. |
| OAuth errors | Absolute frontend `onAPIError.errorURL`, plus per-flow `errorCallbackURL` | Keep API-hosted errors in the application and preserve the retry destination. |
| Two-factor email OTP | `twoFactor.otpOptions.storeOTP: 'hashed'` | A storage reader cannot directly read the live OTP. |
| Email OTP | `emailOTP.storeOTP: 'hashed'` | Protect sign-in, verification and recovery codes at rest. |
| Magic links | `magicLink.storeToken: 'hashed'` | A leaked stored identifier is not a usable sign-in link. |

The existing delivery callbacks still receive the original OTP/token/link.
These changes do not hash TOTP seeds: authenticator secrets must remain
recoverable through encryption for verification. They do not replace TLS,
short expiration times, one-time consumption or attempt limits.

## Proxy trust and IP rate limits

Northflank documents `X-Forwarded-For` for client IPs:
https://northflank.com/docs/v1/application/network/networking-on-northflank

Do not use `cf-connecting-ip` just because DNS is hosted by Cloudflare.
Do not set Express `trust proxy: true` or trust all private networks as a shortcut.
Better Auth reads its configured headers independently of Express's `req.ip`.

The installed SDK accepts a single forwarded IP by default. A multi-address
chain needs explicit `BETTER_AUTH_TRUSTED_PROXIES`, a comma-separated list of
the actual trusted ingress IPs/CIDRs. No addresses are invented by this change.
The SDK walks a configured chain from right to left, skipping trusted hops.
Invalid proxy entries now fail configuration instead of being silently ignored.
Only configure these addresses after confirming ingress behavior and restricting
direct access to the application origin. Header parsing cannot establish who
actually sent the request. A spoofable header permits rate-limit evasion;
unresolved or shared IPs can group legitimate users into one rate-limit bucket.

IPv6 aggregation remains `/64`. This limits address rotation within one subnet,
but users on the same network may still share a bucket. Tune rate limits using
observed traffic rather than increasing them to hide a proxy problem.

## OAuth redirect and cookie behavior

The global error destination uses `/auth/error` on the first configured
`FRONTEND_URL` origin. Keep the intended canonical frontend first when multiple
origins are configured. Per-flow callbacks use the initiating browser origin,
so local and deployed frontends return to the correct site.

`/auth/error` redirects to the existing login UI with a generic error notice.
Only a normalized internal retry destination is preserved. Provider error
descriptions and arbitrary query messages are not rendered or injected into
HTML. The notice does not reveal whether a particular account exists.

If strict state checks expose `state_mismatch` errors, inspect cookie delivery:
use HTTPS for the existing Secure cookies, maintain the correct API base URL,
register exact provider callback URLs, and check browser third-party cookie
restrictions. Do not turn the state check off to mask cookie-domain problems.

## Deployment steps

1. Deploy the frontend `/auth/error` route and login error notice.
2. Deploy/restart the API with the new token storage and state-cookie settings.
3. If necessary, set the actual ingress CIDRs in `BETTER_AUTH_TRUSTED_PROXIES`.
4. Request fresh OTPs/magic links after deployment. Outstanding plaintext records
   are not converted to hashes and may fail under the new verifier. They can
   expire normally; do not reset the database to clear them.
5. Test successful OAuth sign-in and a cancelled provider flow from each frontend
   origin. Confirm failures return to login rather than `/api/auth/error`.
6. Test email OTP, 2FA OTP, magic-link success, incorrect codes, expiry and replay.
   Inspect stored records without copying live tokens into logs or screenshots.
7. Confirm sessions show the real client IP and distinct clients do not share an
   ingress IP bucket. Review the infrastructure insights again after new traffic.

No Prisma migration is required: verification records use the same string fields.
No existing token records were deleted as part of this hardening.

## Verification scope

Focused tests exercise internal redirect rejection, forwarded-chain parsing and
actual hashed OTP/magic-link storage and verification using an in-memory adapter.
Delivery callbacks are captured locally; no real email or production account is
used. These tests do not prove live Northflank header sanitization or a real OAuth
provider round trip, which must be checked in the deployed environment.

## References

- https://better-auth.com/docs/reference/options
- https://better-auth.com/docs/reference/security
- https://better-auth.com/docs/plugins/2fa
- https://better-auth.com/docs/plugins/email-otp
- https://better-auth.com/docs/plugins/magic-link
