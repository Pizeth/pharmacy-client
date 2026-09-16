# 1.7.10.6F.7 - Final live browser acceptance

**Decision: PASS. Phase 1.7.10.6F is CLOSED.**

Recorded 2026-09-16 against the running development fixture at http://localhost:8080/dev/datatable in the Codex Chromium browser. This record precedes any 1.7.10.7 implementation. No CRUD implementation was started.

## Baseline and scope

The user reported 199/199 automated tests green and the act() warning resolved. That result is the supplied automated baseline, not a newly executed test run for this acceptance request. The final request was browser-only; no further production implementation was needed during this final matrix.

The synthetic fixture uses the real DataTable renderer, 60 rows, start/end pinning, a wide center column, selection, pagination, fullscreen, direction and palette controls. The route is development-only. These results establish presentation acceptance for this browser and configuration, not cross-browser or resource CRUD acceptance.

## Layout matrix: 16 combinations passed

Each cell below covers both inline and fullscreen, for a total of 16 configurations.

| Viewport | Direction | Light | Dark |
| --- | --- | --- | --- |
| 1280 x 800 | LTR | PASS | PASS |
| 1280 x 800 | RTL | PASS | PASS |
| 420 x 800 | LTR | PASS | PASS |
| 420 x 800 | RTL | PASS | PASS |

Verified DOM direction, physical start/center/end text alignment, pinned edge placement, paper colors, fullscreen dimensions, and pagination containment. Fullscreen matched the viewport dimensions in all eight fullscreen combinations. Pagination bottom measured 557px on desktop and 645px on mobile, within the 800px viewport. The fixture intentionally limits the table container to 55vh, so remaining fullscreen whitespace is expected.

Inline pagination may sit below the browser fold and remains in normal document flow. It is not required to fit above the fold outside fullscreen.

## Fullscreen overlays: 12 combinations passed

At the 420 x 800 viewport, each of these was opened in LTR/light, LTR/dark, RTL/light, and RTL/dark:

| Surface | Correct DOM direction | Pointer hit-test | Within horizontal viewport | Escape |
| --- | --- | --- | --- | --- |
| Density menu | PASS | PASS | PASS | PASS |
| Column action menu | PASS | PASS | PASS | PASS |
| Column manager | PASS | PASS | PASS | PASS |

Every overlay measured z-index 1300 and received elementFromPoint at its center. Popovers closed before the next action; an initial automation attempt ran before an exit transition completed, so it was repeated with explicit detached-state waits and then passed. This was not counted as a product failure.

## Functional checks

| Check | Result and evidence |
| --- | --- |
| Mobile RTL/dark column filter | PASS: dialog direction rtl, center hit-test inside dialog, horizontal bounds 16..336px |
| Apply text filter | PASS: Start 1 produced 11 rows (1 and 10..19), Page 1 of 1 |
| Clear filter | PASS: column action restored the unfiltered page |
| Mobile RTL page-size popup | PASS: direction rtl and center pointer hit-test passed |
| Change page size | PASS: selecting 10 rendered 10 rows |
| Navigate next page | PASS: first row Start 11, status Page 2 of 6 |
| Restore pagination | PASS: returned to first page and page size 50 |
| Vertical scroll | PASS: scrollTop reached maximum 1482px; final row bottom 522.78px within viewport bottom 538px |
| RTL horizontal scroll | PASS: negative scroll offset; start pinned right, end pinned left |
| LTR horizontal scroll | PASS: positive scroll offset 240px; pinned cells stayed at their edges |
| Selected + hover, RTL dark | PASS: visually inspected pinned cells, opaque rgb(18,18,18) base beneath translucent selection tint |
| Selected + hover, LTR light | PASS: visually inspected pinned cells, opaque white base beneath translucent selection tint |
| Hover without selection | PASS: selected attribute removed and rgba(0,0,0,0.04) hover gradient retained over paper |
| Centered header | PASS: cell center 420px, label center 419.9921875px |
| Intentional header color | PASS: rgb(211,47,47), the light-theme error.main color |
| Fullscreen Escape | PASS: fullscreen returned to inline after overlay closure |

## Layout constraint

The fixture pins 180px on each side. At very narrow inline widths, the pinned widths plus scrollbar can consume the entire visible center area. This is the expected fixed-width pinning budget, not a background transparency failure. Resource configurations should limit pinned width or unpin columns when they need center content visible on such screens. This acceptance does not introduce automatic responsive unpinning.

## Restoration and handoff

Restored LTR, light mode, normal container width, cleared selection and filters, first page, page size 50, and inline mode. Reset the browser viewport override. The fixture tab remains available for inspection. Production TranslationKey data and saved table preferences were not changed by this synthetic matrix.

**6F closure recorded. 1.7.10.7 remains unstarted.**
