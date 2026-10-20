# Responsive navigation regression — October 20, 2026

Source baseline: `5849b8d2db4daf3f5994adf7c178f9769e09d652` plus local changes.
Separate track from DataTable dependency correctness. Preserve the current HRD
design, footer, decorative contact card and intentional slideshow.

## Implementation under test

The existing theme breakpoint is `md` (900px); DrawerAppBar uses MUI
`down("md")`. The hook measured expanded height only while not compact, so a
viewport change while compact could retain the previous layout's threshold.
The bounded fix remeasures the actual expanded responsive layout on resize,
temporarily suppressing transitions and restoring compact attributes before
painting. It does not hard-code another breakpoint or header height.
`pageshow` and `popstate` schedule fresh scroll/footer observation. Existing
16px hysteresis, ResizeObserver and RAF coalescing remain.

First ordinary-production browser run found a real positioning defect at 900px:
expanded header bottom 206.02px, breadcrumb top 157px / bottom 186.02px at scroll
zero. A global 65px main margin plus an 80px padding did not reserve enough
space. The bounded fix uses the hook's measured expanded height as a typed
runtime CSS geometry variable in the named `RazethNavigationLayout.main` slot,
overriding that margin for this layout. Rebuilt ordinary-production RECHECK PASS:
at 900px header bottom 206.02px, breadcrumb top 218.02px, padding 206.016px,
main margin zero. Screenshot inspection confirms the breadcrumb is visible.

At 390px and 844px, compact state settled to 65px and returning to top restored
113px; no document horizontal overflow. At 899px the top layout remained mobile;
900px switched to desktop without reload. These observations precede the
content-offset fix; the table below records the final rebuilt-app results.

The hook exposes footer visibility, but the current DrawerAppBar intentionally
hides header socials based on mobile/scroll state. This report does not invent
a new footer-dependent social visibility policy.

## Automated checks

PASS: existing threshold test plus new responsive geometry, compact
remeasurement, hysteresis, observer/ref observation, route/footer replacement,
pageshow/popstate restoration, RAF coalescing and listener/observer/frame cleanup.
These simulate layout measurements; they cannot certify browser geometry.
Full repository Jest passed 133 suites/779 tests; final standalone typecheck and
both optimized builds passed. The later focused DataTable run passed 98 suites /
563 tests after stopping a dev-generated-file scan race. Whitespace check passed.
The hook does not consume a media query: these tests inject responsive DOM
heights/compact attributes. The actual MUI media-query breakpoint is verified in
the browser, rather than claimed from a mocked query in the hook test.

## Browser checks

All rows initially PENDING. Viewport resizing is orientation emulation; it does
not constitute physical touch-device rotation coverage.

| Case | Status | Evidence |
| --- | --- | --- |
| 390x844 expanded/compact/top/menu/overflow | PASS | 113px expanded, 65px compact; keyboard drawer and Contact link work |
| 844x390 expanded/compact/top/menu/overflow | PASS | 113/65px; drawer Enter/Escape works |
| 899x800 expanded/compact/top/menu/overflow | PASS | 113/65px, mobile mode; drawer Enter/Escape works |
| 900x800 expanded/compact/top/menu/overflow | PASS | 206.02/97px; repaired breadcrumb clearance; About menu Enter/Escape works |
| 1280x800 expanded/compact/top/menu/overflow | PASS | 154.67/97px; desktop About menu opens with Enter, closes with Escape |
| 1440x900 expanded/compact/top/menu/overflow | PASS | 154.67/97px; About menu Enter/Escape works |
| 899↔900 at top and scrolled without reload | PASS | Repeated transitions at y=0 and y=787; correct attributes, no horizontal overflow |
| Portrait↔landscape same breakpoint and crossing md | PASS emulation | 390x844↔844x390 and desktop widths; top/scrolled, correct settled layout. Not physical rotation |
| N1 /hrd → contact → Back at restored scroll | PASS | 390px: y=787 compact → Contact y=0 expanded → Back y=787 compact |
| N2 reload while scrolled | PARTIAL | Earlier reload restored y=700 correctly; later reload reset to y=0 with expanded header. Header agrees with actual scroll; retention not claimed |
| N3 footer FAQ anchor heading/focus/history | PASS geometry/history | URL #hrd-faq; section top179.84/heading251.75 vs header97; Back restores y3338. Active element remains anchor; no programmatic heading focus claimed |
| N4 route away/return near footer | PASS | y3338/footer top623.16 → Contact y0 expanded → Back y3338 compact |
| N5 restored scroll then resize | PASS | Back to y787, resize390→900, compact desktop without manual scroll |
| N6 reduced motion | USER-MANUAL functional confirmation | User replied "yes, it still work" to touch/reduced-motion question; motion suppression not independently observed |
| Header/footer socials, tab order, focus, hidden controls | PASS keyboard/geometry; hover unverified | Meta→Tab focuses Instagram in header and footer; compact branding toolbar inert, header socials absent from visible links; footer seven names remain available. Leaving footer keeps valid compact header |
| Real touch interaction | USER-MANUAL PASS | User confirms controls still work; no automated touch/physical rotation claim |

## Environment

Ordinary optimized Next16.4.2 / React19.3.1 / MUI7.3.11 / TanStack9.3.1;
Codex in-app Chrome155, Windows, DPR1. Requested viewport widths include a
15px scrollbar, so document client widths are 15px smaller; breakpoint behavior
uses the actual requested viewport. No horizontal document overflow observed.
Browser warning/error capture empty after navbar checks. Screenshot:
`navbar-1280-2026-10-20.jpg`; raw transition observations:
`navbar-browser-2026-10-20.json`. No touch/hover/motion emulation capability is
exposed by this connected browser. Listener cleanup is proven in Jest rather
than inferred from browser screenshots. No sustained oscillation seen in settled
states; screenshots also captured intermediate ordinary CSS transitions.

The first sandbox install stalled on registry access and was cancelled. An
unsandboxed retry hit a locked Next native compiler in the running repository
dev server. Only the identified repository server processes were stopped, then
the requested lockfile install was retried. No dependency versions were edited.
