# PR #47 final acceptance — October 22, 2026

Base: `9b75b0372938767d01874f43cc0bd401011a7a40` (`master`).
Incoming head: `5e179bd496dd0adce0ee219bef1f960fdc9c100e`.
Validated source correction: `4c0a9359d3025e1bde4f9a83dbc8c5133df219d7`.
Branch: `codex/datatable-selection-dependencies`.
No duplicate PR, production selection optimization, PR #31 extraction or virtualizer.

## Dependency decisions

The maintainer explicitly chose **resolver6.0.0 and the TypeScript7.0.2 compiler**,
superseding the earlier resolver5.9.2/TypeScript6.0.3 hold. ESLint stays9.39.5 with
eslint-config-next16.4.2. Node24.16.0/npm11.14.1 on Windows.

Only `@hookform/resolvers/zod` is imported by the application. Installed
Zod4.6.7 and React Hook Form7.90.0 meet resolver6's peer ranges. Explicit
devDependency Effect4.0.5 anchors its optional Effect4 peer; there are no
installed TypeSchema/Effect3 adapters. It is an install-resolution dependency,
not a new application validation framework. Normal npm resolution generated
the lockfile; no force, legacy-peer-deps, peer-suppression overrides or unused
Effect imports were introduced.

The incoming direct TypeScript7 install passed ordinary `npm ci`, but strict
install and `npm ls --all` failed typescript-eslint8.71.1's `<6.1.0` peer range.
Direct lint also refused to load the TypeScript7 API. After seeing this distinction,
the maintainer explicitly approved Microsoft's
[supported side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0):

- `@typescript/native`: `npm:typescript@~7.0.2` supplies **tsc7.0.2**.
- `typescript`: `npm:@typescript/typescript6@~6.0.3` supplies **the6.0.3 tooling API**
  and `tsc6`; it does not replace the7.0.2 `tsc` executable.

Verified `tsc --version`:7.0.2; `require("typescript").version`:6.0.3.
`npm run typecheck` PASS; strict lockfile resolution and `npm ls --all` PASS.
Final clean strict install is recorded in the validation table below. No accepted
peer mismatch is needed for this final setup. The historical strict PASS at194f54a
used a different compiler configuration. The existing five high npm audit findings
were not changed by this acceptance.

Lint is runnable again: the removed `next lint` command is replaced with the
ESLint CLI, and Next's native flat exports replace the obsolete FlatCompat wrapper.
Generated build output is ignored, without excluding application source. The
global brace-expansion5 override was API-incompatible with Minimatch3 (expects a
callable1.x export). Normal resolution now gives supported patched releases:
brace-expansion1.1.21/2.1.7/5.0.12 to the matching consumers. No rule was weakened.
Repository-wide lint still reports existing application diagnostics; changed
acceptance components/tests have no lint errors. Current counts are below.

## Review dispositions

- Resolver finding4345817143: old PR wording was stale. Retain the intentional
  resolver6/Effect4 configuration; update description and evidence. The app does
  not use the optional adapters cited by the downgrade recommendation.
- TypeScript finding4345817152: valid for the incoming tree; fixed through the
  explicitly approved compiler7/tooling-API6 split, preserving compiler7.0.2.
  A passing compiler alone is not treated as proof of lint-parser support.
- Historical attribution finding4344462856: already resolved with exact
  original/repair revisions; original failure and profiling evidence retained.

All three inline review threads are resolved at the final evidence check.
CodeRabbit explicitly withdrew the resolver downgrade recommendation after
inspecting the actual graph. The TypeScript thread is resolved after the
supported compiler/API split. A new head's incremental review must still be
checked; thread resolution is not a claim of merge approval.

## Acceptance corrections

The login artwork preview exists to isolate the real component without changing
a signed-in session. It has no product navigation entry and lives under `/test`;
`noindex` did not restrict access. It now follows the existing development-route
`notFound()` convention outside development. The preview remains usable locally;
normal login and authentication redirects are unchanged.

The navigation layout persists between routes. Its back-to-top animation previously
had only unmount cleanup and could continue scrolling after pathname navigation.
The button's animation owner is now keyed by pathname, releasing the old frame
and wheel/touch/keyboard listeners and resetting GIF/busy state on navigation.
Its styling,1600ms easing and reduced-motion behavior are unchanged.

Tests additionally cover touch/keyboard cancellation, fresh playback, unmount
listener cleanup, route-change GIF/busy state, ordinary/CSS-variable FAQ shadow
tokens and fallback, and light→dark→light artwork styles with original animation.
No assertions or timeouts were weakened. Approved HRD designs, automatic contact
slideshow and decorative card print are unchanged. Contact remains a mailto
draft; no backend or real message submission is introduced.

## Current validation

| Check | Result |
| --- | --- |
| Original focused HRD/navigation/inputs/theme/DataTable pass | 38 suites;255/256 passed; new FAQ CSS-variable assertion initially expected MUI's pre-provider fallback syntax, corrected to the actual generated variable reference |
| Critical rerun after correction | **9 suites /50 tests PASS** (D5/D6/D8/D21, controlled/off-page, cards, sticky geometry plus new acceptance cases) |
| Typecheck / generated feature synchronization | **PASS** with compiler7.0.2 |
| Strict lockfile resolution | **PASS** |
| Full dependency tree | **PASS**, no problems after compiler/API split |
| Changed acceptance component/test lint | **PASS**,0 errors;1 existing GIF `<img>` advisory |
| Repository-wide lint | **FAIL**,173 errors/507 warnings across854 files; all error paths are outside `git diff9b75b03 -- src` |
| Final strict clean install | **PASS**,1008 packages; no peer override warnings (existing deprecations/audit advisories retained) |
| Full post-clean-install Jest | **144 suites /828 tests PASS**,170.074s; `npm test -- --runInBand --roots src` |
| Whitespace | **PASS**; no assertions/timeouts weakened |
| CI on source correction4c0a935 | **CI310 PASS**, install/typecheck/Jest/whitespace; final documentation-head status remains authoritative in PR checks |

[CI310](https://github.com/Pizeth/pharmacy-client/actions/runs/39752820945)
ran on Linux/Node22. Local strict installation and automated checks ran on
Windows/Node24.16.0. The documentation-only follow-up does not change tested
source; verify its exact-head checks before changing PR readiness.

Lint exposes existing source issues (for example no-explicit-any, hook rules in
the old public test page and an unescaped apostrophe in not-found). No unrelated
source edits, rule relaxations or ignore patterns for source were used to hide
them. CI currently gates install/typecheck/Jest/whitespace, not repository lint.
The separate uncommitted `.env.local` and `src/lib/auth-client.ts` changes belong
to the maintainer and are excluded from this correction commit.

## Browser acceptance

Windows IAB Chrome155, development, desktop1101×884/1440×1000 and mobile420×884.
The initial error-page protocol was blocked; the user opened a healthy `/hrd`
page, after which normal browser control resumed. No policy bypass was used.
Viewport overrides were reset. The dev server is restored after clean installs.

| Surface | Observed result |
| --- | --- |
| HRD Home | Desktop dark, mobile light/dark inspected; hero next/previous/direct dot selection update heading and checked dot; circular-gallery next changes1/11→2/11. Narrow content scrolls vertically without page-level overflow |
| FAQ/footer | Native summary expands, answer/link appears, link reaches Documents; footer FAQ anchor settles with FAQ top180.484375px below header; headings are exposed in accessibility tree |
| About | `/hrd/about` settles at `/hrd/about/overview`; desktop light and mobile light/dark layouts inspected, links and pending content remain readable |
| Contact | Desktop dark and mobile light/dark inspected; ID card, intentional fine print and contact/social controls retained; slideshow changed between ministry/HRD/service images automatically; no pause/next controls added |
| Documents | Desktop table and mobile automatic card presentation inspected; light/dark switch works. Footer1–11 of11. At420px document client/scroll width405px; desktop1440px page scroll width1425px |
| Login preview | Light→dark→light works; light background rgb(228,231,236), dark circle rgb(0,0,0), original circle animation remains active; logo/caption fit; no horizontal overflow |
| Actual login | Desktop and420px light/dark inspected; side art hidden on mobile and form remains usable. Accessible Username/Email and Password fields, Tab focus-visible reaches Password, Show/Hide password changes control state. Empty Sign In remains disabled; no credentials, login/logout, social login or auth data mutations |
| Back-to-top | On mobile Home, click sets aria-busy=true and displays Scrolling GIF; later scrollY=0, aria-busy=false, GIF absent.1600ms timing, interruption, route-change reset and cleanup are additionally proven by deterministic tests |

No application hydration errors appeared in captured logs. The complete console
is **not clean**: Cloudflare Turnstile challenge frames emit formatted NaN
errors/warnings; existing logo fill-parent positioning and image LCP advisories
are present, as is the local Sentinel default-ingestion warning. These are
recorded rather than claimed fixed; CAPTCHA challenges were not manipulated.
The local auth-client/environment edits were present during visual checks and
are not part of this correction commit.

PENDING manual/browser-only conditions: real touch/pen hero/gallery swipes and
flips, browser reduced-motion emulation, external email-client draft opening,
exhaustive desktop/mobile×light/dark combinations and real authentication
behavior. Current automated touch/reduced-motion tests are not substituted for
device certification. ContactForm source still assigns an encoded mailto draft
and explicitly says the message is not sent; no send/backend claim is made.

Representative screenshots: `docs/evidence/pr47-final/` (preview light/dark,
actual desktop dark login, mobile light/dark login, mobile light HRD Home and
desktop dark Contact). Historical DataTable geometry screenshots/profiling are
preserved separately; they are not new HRD/login visual acceptance evidence.

## DataTable decision and next gate

**Outcome B: contract established, production rollout deferred.**
The diagnostic boundary remains internal. Production subscriptions stay broad.
Global counts, cross-row guards, undeclared callbacks, controlled/off-page
selection, cards and variable-height sticky stacking remain regression targets.
The intentionally failing snapshot/nullable-detail counterexamples remain
documented limitations, not production optimization acceptance.

Next: **2.2.3.6 — live callback-context and nullable detail-renderer subscription
correctness**. Preserve the compatible full callback context; independently
subscribe invocation before null/false/undefined/empty output decisions in table
and card slots. Prove D5/D6/D8/D21 and controlled/off-page/external-policy
adversarial cases before repeating the expensive 2.2.3.3 performance matrix.
No performance rerun is warranted before that correctness gate passes.

## Files in the final acceptance correction

- Toolchain: `package.json`, `package-lock.json`, `eslint.config.mjs`.
- Preview: `src/app/(app)/(public)/test/login-background/page.tsx` and its
  `page.spec.tsx`.
- Navigation: `src/components/Navigations/BackToTop.tsx`, `BackToTop.spec.tsx`
  and `useScrollToTop.spec.tsx`.
- Acceptance coverage: `src/features/hrd/pages/home/HrdFaq.spec.tsx` and
  `src/theme/sideImage.spec.tsx`.
- Evidence: this report, DataTable roadmap/browser matrix/selection contract,
  the existing2.2.3.5 report and validation.txt, and seven JPEG screenshots under
  `docs/evidence/pr47-final/`.

PR readiness is separate from merge: no merge is authorized here. Existing
repository lint debt, third-party console messages and the explicitly pending
manual browser/device checks are disclosed for review, not silently marked PASS.
