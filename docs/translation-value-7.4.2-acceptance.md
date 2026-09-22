# TranslationValue 7.4.1 / 7.4.2 acceptance

## Automated gate (2026-09-22)

Verified commit: `6ec33cd3d06ba6888fa263c5127735c749f71c0f`.

- Local typecheck: PASS.
- Focused TranslationValueEditForm suite: 4/4 PASS.
- Full Jest suite: 267/267 PASS, 52 suites.
- Whitespace check: PASS.
- GitHub CI: SUCCESS, https://github.com/Pizeth/pharmacy-client/actions/runs/35709495680.

The previous CI failure asserted the PATCH mock synchronously before React Hook
Form completed asynchronous submission. The test now keeps both rapid clicks
inside one awaited async `act` boundary while the mocked PATCH remains deferred.
It verifies one request, disabled Save/Close controls, no premature completion,
and exactly one completion callback with the updated translation after resolution.
Production code is unchanged.

Complete corrected test source:
`src/features/i18n/translation-keys/forms/TranslationValueEditForm.spec.tsx`.

## Browser gate

Status: BLOCKED, not accepted.

Required target: `http://local-store.razeth.com/admin/i18n`.
The Codex in-app browser remained on an old localhost connection-error page;
opening the requested target timed out, and the resulting blank tab also timed
out during initial navigation. A browser-panel reopen/sign-in was requested.
No Create or Edit mutation was submitted during this acceptance attempt.

Pending: detail expansion/collapse, Create, Edit, query preservation, safe failure
handling where possible, RTL, dark mode, narrow viewport, fullscreen, and live
network request counts/body/session verification. Viewport and theme matrix
results cannot be claimed because no usable resource page was reached.

7.4.1 and 7.4.2 remain implementation-complete with automated acceptance green
and browser acceptance pending. Do not start 7.4.3 TranslationValue Delete.
