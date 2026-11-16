# Login failures after the Better Auth upgrade

## Account creation and linking

Better Auth 1.7.0–1.7.2 required `Account.issuer`; 1.7.3 and later no longer
write it. A required legacy Prisma field causes `Argument issuer is missing`
when Google One Tap links an account, even when Google authentication succeeds.

The backend now keeps `issuer` as nullable, preserves existing values and the
unique `(providerId, accountId)` identity, and includes migration
`20261023083000_relax_account_issuer`. That migration was applied to the configured
development database. Deploy the updated schema with a newly generated Prisma
client; changing the database alone does not fix a running Prisma client that
still considers the field required. No reset or reseed is needed.

Reference: https://better-auth.com/docs/guides/1-7-upgrade-guide

## Sentinel suspicious-IP rejection

The live API returns HTTP 403 with `Anonymous connections (VPN, proxy, Tor) are
not allowed.` The installed Sentinel SDK maps that message to
`suspicious_ip_detected`. This is separate from the Prisma account error and from
the Turnstile iframe's console warnings.

The backend configuration in commit `8556e48` already requests
`suspiciousIpBlocking: { action: 'challenge' }`. The SDK sends this configuration
to the hosted `/security/check` service and enforces its returned decision. Do
not disable CSRF checks, remove Sentinel, trust arbitrary forwarded headers, or
change the Thailand policy to work around this rejection.

Inspect the blocked event in the Better Auth dashboard: compare its IP with the
browser's public IP privately, inspect the returned action and applicable project
policy, and confirm the active deployment uses the intended configuration. A
mismatched IP requires checking the Northflank forwarding chain; a matching IP
with a block despite the configured challenge requires investigating the hosted
Sentinel policy/classification. Cloudflare is DNS-only for the API, so
`cf-connecting-ip` is not a trusted source here.

The user confirmed the event IP matches their public IP and that dashboard
policy configuration requires a paid plan. Temporarily requesting `log` restored
login. After the user reported the IP was allowlisted, restoring `challenge`
again blocked username login while One Tap succeeded. The user confirmed both
events use the same IP and the allowlist is in Better Auth. The backend therefore
requests `log` again for this check; the allowlist/challenge discrepancy remains
an unresolved hosted-service issue. Deploy the change to restore password login.
Other security policies are unchanged.

Social login now renders returned API errors and releases its loading state so
users can retry instead of being left with disabled buttons.

## Shared login feedback

The root `LoginFeedback` component shows accessible, dismissible notifications
outside the route layouts. Better Auth's shared lifecycle reports errors from
password, social and One Tap requests. A short-lived attempt marker lets the
returning OAuth page confirm the session before announcing success. Redirects
to providers and second-factor requests are not treated as completed login;
Sentinel's retryable 423 challenges and username-to-email fallback errors are
not shown as failures. Markers contain timestamps only, never credentials.

Only `EMAIL_NOT_VERIFIED` redirects the password form to account activation;
other 403 errors remain sign-in failures with feedback.

Refine invalidates its authentication check after a login attempt, including
failures. The login page gates its initial render on `isLoading`, not
`isFetching`, so background checks keep the form and its inline error mounted.
One shared inline alert sits beneath the social buttons. Password, social and
One Tap failures update that alert; starting any login attempt clears the
previous message so errors from different methods do not accumulate. Toasts use
typed `RazethLoginFeedback` slots with glass surfaces, severity accents, error
bounce, success fade and timed dismissal. The navigation hover outline uses a
white core with layered item-color glows.
