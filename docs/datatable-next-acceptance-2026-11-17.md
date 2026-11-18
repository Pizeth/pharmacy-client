# DataTable acceptance handoff — November 17, 2026

## November 18 baseline

| Repository | Fetched master | Evidence from this run |
| --- | --- | --- |
| Client | `e980ec7864a01835ddf8cea2ac089fe68c8a5d56` | 111 targeted Jest suites, 712 tests passed |
| API | `dc98795f2f19ed6ce16ad02abba90bfab85f7921` | Source baseline inspected |

The November 17 CI counts apply to the older handoff commits. The current client run targeted DataTable, TranslationKey and Document Tracking. The interactive-windowing fixture suite also passed independently with two tests.

The frontend acceptance branch is `codex/datatable-next-acceptance`, based on the fetched client master. Client PR #66 and API PR #20 have since merged Document Tracking realtime code. Its implementation status is now merged, with authorization and cross-session acceptance still to verify.

## Acceptance inventory

| Evidence | Status |
| --- | --- |
| Targeted Jest regression | Passed on the client baseline above |
| Historical browser and database checks | Retained in the linked reports |
| TranslationKey local authenticated two-session acceptance | Historical pass |
| Current browser windowing matrix | Partial headless Chrome evidence below |
| Controlled React and browser performance comparison | Pending browser correctness |
| Hosted TranslationKey R01–R10 | Pending authorized environment access |
| Socket.IO application notifications | Outside the foundation's scope |
| Document Tracking realtime | Merged implementation, cross-session delivery and visibility acceptance pending |
| Row-local production subscriptions | Deferred under Outcome B |

## Release decisions

Keep the rollout limited to the TranslationKey pilot until the browser matrix and performance comparison support expansion. Hosted TranslationKey realtime deploy safety, Socket.IO lifecycle sufficiency and Document Tracking delivery remain open decisions. The local acceptance evidence and rollout gates are recorded in the [TranslationKey realtime report](datatable-production-realtime-2-0-6.md).

## Headless Chrome fixture observations

The local profiling route returned HTTP 200 after switching from a cross-drive dependency junction to a same-drive dependency copy. The interactive fixture used 200 records, 100 rows per page, and 16 columns. These measurements cover the default LTR theme in the development build.

| Actual viewport | Document scroll width | Table container width | Mounted row IDs at top | Middle | Bottom |
| --- | --- | --- | --- | --- | --- |
| 420 px | 944 px | 371 px | 1–14 | 42–59 | 87–100 |
| 900 px | 944 px | 851 px | 1–15 | 41–60 | 86–100 |
| 1280 px | 1265 px | 1231 px | 1–15 | 41–60 | 86–100 |

The physical table measured 2280 px wide inside the table container. The table exposed `aria-rowcount="101"`, including its header, and the scroll height was 3736 px. The bottom scroll reached row 100 at every width. The document itself overflowed at 420 and 900 px in this fixture. The run did not establish whether that overflow originates in the profiling shell or the product table. Sticky header acceptance also remains open. The measured `thead` position moved while scrolling, and the sticky header cell positions relative to the scroll container still need measurement.

At 1280 px, expanding row 1 changed the mounted data row count from 15 to 100. Collapsing it returned the count to 15. The attempted selection selectors did not locate the input, so that interaction is unverified.

W01 and W02 have partial evidence for the 100-row page. W03–W10, K01–K08 and the rest of the cross-feature matrix still need browser coverage. The checked detail transition covers one fixture and viewport. The team still needs RTL and dark theme runs, the 25/26 boundary, the other page sizes, and production TranslationKey resource coverage. This development run provides no controlled performance measurements.

## Follow-up browser checks

- The profiling toolbar already made the document 944 px wide at 420 and 900 px before mounting the table. At 420 px, temporarily wrapping the toolbar in DevTools reduced the document width to 489 px. The width stayed 489 px after the table mounted. The toolbar explains the original 944 px measurement. The residual shell overflow remains unassigned.
- At 1280 px, the header cell had sticky positioning and stayed flush with the scroll container top at scroll offsets 0, 1650 and 3322 px. This covers the fixture's standard header geometry.
- Selecting row 1 checked its input and increased mounted rows from 15 to 100. Clearing it returned the count to 15. While selected and scrolled to 1300 px, the header cell bottom and pinned row cell top both measured 554.4375 px, giving 0 px of overlap.
- Reverse Shift+Tab from a focusable control immediately after the scroll container restored all 100 rows and focused a button in row 100. A pointer interaction then restored bounded mounting with rows 86–100.
- Forward Tab from the last header resize handle restored all 100 rows, moved focus to row 1, and scrolled to the top. Before that transition the fixture was scrolled to 1650 px with rows 41–59 mounted. This and the reverse Tab check cover the two window boundaries in the 1280 px fixture. They supersede the earlier pending status for the fixture's selection, standard sticky geometry and basic forward/reverse Tab cases.

## Page size, sorting and filtering

Chrome at 1280 px with the 200-record, 16-column interactive fixture. Added 26 to the page-size selector for this fixture so the threshold test uses the normal pagination control.

| Page size | Data rows mounted at the top | Table aria-rowcount | Hidden spacers |
| --- | ---: | ---: | ---: |
| 25 | 25 | Native full table | 0 |
| 26 | 15 | 27 | 1 |
| 50 | 15 | 51 | 1 |
| 100 | 15 | 101 | 1 |
| 200 | 15 | 201 | 1 |

The footer reflected the selected page size and the 200-record total. In the 200-row page, ascending name order began with record 1, descending order began with record 200, and clearing sort restored record 1. Applying the fixture's global filter for Record 0001 left one row and zero spacers. Clearing it restored the 200-record total and 15 mounted rows.

From a 1500 px scroll offset on the 100-row page, Next page preserved the offset and changed mounted IDs from 37–56 to 137–156, with the footer changing to 101–200 of 200. Previous page restored the original IDs and range. The window kept 20 mounted rows, two hidden spacers and contiguous page-local ARIA indices 38–57 throughout.

This covers W01 and the fixture cases for W07–W09 at 1280 px. Sorting and filtering were exercised through fixture controls. Search field behavior and page changes with active selection still need dedicated coverage. Semantic measurements here cover the mounted DOM and hidden spacer markup. Focused Jest verification passed four tests across the interactive-windowing and footer suites.

## Selection, view and search continuity

Chrome verified the following at 1280 px on the 200-record interactive fixture with 100 rows per page.

- Selecting row 1 on page 1 and advancing to page 2 kept one row selected. None of records 101–200 were checked. Returning to page 1 restored row 1's checked input. The fixture stayed in full-render mode while the select-sticky selection was active, including while the selected row was off page.
- With row 1 selected and expanded, the table-to-card switch replaced 100 table rows with 100 card list items. Row 1 stayed checked, detail content remained in the rendered view, and the pagination range stayed at 1–100 of 200. Switching back preserved the selection and expanded detail. Resetting interactions removed both and restored the 15-row window.
- Entering Record 0001 through the toolbar search input reduced the result to row 1. Switching to cards and back preserved the input value, record identity and 1–1 of 1 range. Clearing the query with keyboard input restored the 1–100 of 200 range and 15 mounted rows.

This covers the fixture search interaction and W10 round trip with both query and selection/detail state. It also covers the off-page selection case. Responsive and production-resource acceptance remain open.

## Density, resize and geometry fallback

Chrome at 1280 px, 100 rows per page, 16 columns, with the fixture scrolled to 1400 px.

| Density | Physical row height | Header height | Scroll height | Mounted IDs |
| --- | ---: | ---: | ---: | --- |
| Compact | 37 px | 36 px | 3736 px | 34–53 |
| Comfortable | 75.75 px | 56 px | 7631 px | 15–28 |
| Spacious | 83.75 px | 72 px | 8447 px | 13–25 |

The scroll offset stayed at 1400 px throughout. Returning to Compact restored the original mounted IDs and dimensions. The product labels for these three density options are Compact, Comfortable and Spacious.

Shift+Left reduced the Name column from 180 to 148 px and Shift+Right restored 180 px. The measured width agreed with the resize handle's aria-valuenow, focus stayed on the handle, and the physical row height and scroll position held steady. Tab from the final header control reached row 1. Focusing the toolbar afterward restored the 15-row window. The resize exercised fixed-height cells. Wrapping caused by resizing remains open.

A temporary browser style grew row 1 to 90 px beside 37 px rows. The fixture mounted all 100 rows and expanded the scroll height by 53 px. Removing the style restored the original scroll height, but full rendering persisted until the fixture remounted. A separate temporary style increased the header from 36 to 70 px. It stayed sticky and the window decreased from 15 to 14 mounted rows. Removing sticky positioning caused full rendering, and restoring it returned to the 15-row window without a remount.

This covers W04 in the fixture, with targeted W03, W05 and W06 evidence. The injected styles were temporary and test geometry independently of content wrapping. Resize while selected and RTL pinned-column geometry remain open.

## Resize with a selected row and with wrapped content

- At 1280 px in Compact density, selecting row 1 and scrolling to 1300 px triggered full rendering. Resizing the Name column from 180 to 148 px and back kept row 1 checked and mounted exactly once. Its pinned cell stayed flush against the sticky header with 0 px of overlap and 0 px of gap. The scroll offset, row heights and total scroll height stayed fixed.
- In Comfortable density, a short test string appended to row 1 in the browser fit within the existing 75.75 px row at a column width of 180 px. Nine rows remained mounted. Keyboard resizing down to 64 px caused the test string to occupy five line boxes and row 1 to grow to 157.11 px. The table mounted all 100 rows and the scroll height increased from 7631 to 7712 px. Tab from the last header control still focused row 1.

This closes the fixture's resize-while-selected case and adds a real text-wrap transition for W05 and W06. The text was added only in the browser. RTL pinned-column geometry remains open.

## RTL, themes, bulk selection and both pinning edges

The local profiling fixture now exposes the integrated renderer in RTL and uses the shared page select-all control. Its sample pinning action sets rows 1 and 2 at the top and 99 and 100 at the bottom.

- The 100-row fixture windowed in all 12 combinations of 420/900/1280 px, LTR/RTL and light/dark. At a vertical offset of 1300 px it mounted 18 unique rows at 420 and 19 at 900 and 1280. Horizontal offsets of +700 in LTR and −700 in RTL preserved logical start and end pinning. The start cell aligned flush and the end offset measured 15 px from the outer border. The computed cell color changed between the two schemes.
- At 1280 px in RTL dark mode, pinning sample rows mounted all 100 unique records. The top row cells met each other and the sticky header exactly. The bottom row cells met each other and the usable viewport edge exactly. The four IDs each occurred once. Reset restored the 19-row window at the same offset.
- The shared select-all checkbox reported 100 selected rows and checked all 15 mounted inputs without switching out of windowing. Clearing it unchecked all visible inputs. Clicking row 1 and activating row 1 with Enter each selected that single record and engaged select-sticky full rendering.

These observations cover the fixture's remaining pinning and activation scenarios. The earlier 420 px profiling shell overflow still limits conclusions about the outer page layout.

## Keyboard follow-up and frontend regression

- Space toggled row 1's checkbox while focus stayed on it. The resulting selection and clear states were correct.
- A fixture-only row dialog held focus in its portal while the table was scrolled to 2400 px. The owning row stayed mounted. Escape restored focus to the row trigger, and moving focus to the toolbar resumed windowing. The observed dialog run used a click to open.
- Filtering while row 2's checkbox held focus removed row 2 and moved active focus to the document body. Clearing the filter returned to 15 mounted rows. No stale keyboard fallback remained.
- Reverse Shift+Tab skipped temporary hidden, disabled and negative-tabindex controls placed after the table, restored all 100 rows and focused a button in row 100.
- All 201 frontend suites and 1197 tests passed with Jest discovery rooted at src. The initial unscoped run picked up unrelated tests from the temporary Chrome profile. The focused geometry suite also includes portaled focus and radio-group cases.

The local fixture matrix now has browser coverage for the primary geometry, navigation and interaction cases. The hosted TranslationKey matrix remains open and needs an authorized target and authenticated test sessions. The production-build performance comparison remains pending. The fixture is development-only and history above preserves the scope of each run.

A temporary input in row 1 accepted typed text while retaining focus and keeping the owning row mounted. This verifies browser focus and editability for a row-owned input. Saving an application record and persisted inline editing were outside this fixture check. After the fixture edits, the focused interactive windowing, geometry, and cross-feature pinning suites passed all 55 tests. Git whitespace validation passed.

## Decision

Keep interactive windowing scoped to the TranslationKey pilot. Local correctness evidence now covers W01–W10 and representative K01–K08 interactions. Radio-group restoration has Jest coverage. Production TranslationKey route acceptance needs a signed-in environment with a sufficiently large test dataset. Hosted realtime requires authorized sessions and deployment or database evidence. Full-page responsive certification still needs the application route. The performance comparison remains gated on that acceptance. Socket.IO lifecycle and Document Tracking realtime remain separately scoped, and row-local production subscriptions remain deferred.

The initial TypeScript command hit the Node heap limit in this worktree. The generated TanStack map check passed after normalizing its local checkout line endings, with no generated content diff. A separate TypeScript run excluding the temporary browser profile and dependency artifacts produced no diagnostic output by the end of this acceptance run. A successful full typecheck was not established.

## Production-build benchmark and typecheck follow-up

The standard frontend typecheck passed after moving the temporary Chrome and dependency artifacts outside the worktree. The ordinary and React Profiler production builds both completed their own TypeScript and static-generation steps. The first ordinary production build ran out of Node heap during TypeScript. The successful production builds used an 8192 MB Node heap and remained local.

The existing integrated benchmark compared unwindowed rendering with ordinary windowing at 200 rows × 16 columns, using headless Chrome at 1280 × 850 px, a warm-up and three measured repetitions per action. Both build modes passed the fixture checks for mounted output, row order and end-of-scroll identity. Browser dispatch-to-two-frame duration and React Profiler actualDuration are separate measurements. Values below are median / mean / maximum in milliseconds.

| Action | Browser unwindowed | Browser windowed | React unwindowed | React windowed |
| --- | ---: | ---: | ---: | ---: |
| Mount | 254.30 / 251.10 / 255.80 | 64.00 / 69.00 / 80.70 | 179.90 / 180.17 / 184.60 | 41.90 / 43.17 / 45.80 |
| Sort descending | 243.20 / 239.23 / 245.80 | 44.10 / 42.20 / 46.10 | 163.80 / 165.17 / 170.30 | 23.30 / 23.80 / 25.90 |
| Sort ascending | 242.70 / 245.27 / 256.50 | 46.10 / 45.00 / 49.20 | 163.40 / 161.87 / 166.40 | 25.30 / 25.80 / 27.60 |
| Scroll to end | 18.90 / 20.77 / 27.10 | 25.20 / 25.33 / 27.40 | No React commit | 10.30 / 11.37 / 13.90 |

The unwindowed samples rendered 200 data rows and 3200 body cells. Windowed samples rendered 15 data rows and 241 body cells, including one spacer cell. Both reached vertical offset 7010 px. Each unwindowed mount and sort recorded two React commits. Windowed mount recorded three, sort recorded two, and scrolling recorded one. Windowing improved mount and sort in this case and increased the median time for the scroll jump.

This is one comparison, run with the reference first in each build. The full counterbalanced matrix across all sizes, interactive mode, filtering, selection, view switching and fallback actions remains open. Authenticated TranslationKey route and hosted realtime acceptance also remain open.

## Expanded production benchmark and disposable realtime

Both production builds passed all 15 cases in the expanded local benchmark. The case matrix uses 25×8, 100×8, 100×16, 200×8 and 200×16 with unwindowed, ordinary windowed and interactive renderers. Renderer order rotates between sizes. Each case uses one warm-up and three samples for mount, ascending and descending sort, scroll to end, filter and clear filter. Each build recorded 270 samples. The 25-row page fully rendered in all modes. At every larger size both windowed modes mounted 15 rows at the top at this viewport. Median browser mount at 200×16 was 277.1 ms unwindowed, 63.1 ms windowed and 75.0 ms interactive. Selection, detail fallback and presentation switching have browser correctness evidence. Their comparative timings remain open.

The latest API merge has the same source tree as its tested feature parent. Its existing authenticated HTTP harness passed against the explicit disposable realtime database injected by Infisical. It verified two cookie sessions, mutations and canonical refetch, shared invalidation identities, rejected actors and origins, permission revocation, disabled-account shutdown and reconnect. Cleanup removed the fixture records and preserved existing records and grants. This run established local HTTP and database behavior. Hosted proxy and deployment acceptance require separate evidence.

The disposable harness reached browser-ready state on both loopback origins. Codex had no in-app browser available, and the separate Chrome window approval timed out before any browser edit was attempted. The authenticated cleanup endpoint returned 200 and the harness confirmed fixture removal. The two authenticated HTTP sessions passed. A fresh browser cross-edit and hosted tests remain open.

## Selection, presentation and fallback timings

The expanded production benchmark now checks single and page selection, clearing each, switching to cards and back on the same table store, and interactive detail expansion and top pinning. It checks rendered state after each action. Detail and pinning run independently so each collapse or unpin can restore the window before the next sample. The ordinary build passed all 15 cases and recorded 600 samples.

At 200×16, median browser action times in milliseconds were:

| Action | Unwindowed | Windowed | Interactive |
| --- | ---: | ---: | ---: |
| Select one | 235.7 | 39.8 | 51.7 |
| Select page | 255.5 | 41.4 | 42.3 |
| Switch to cards | 172.0 | 149.9 | 157.8 |
| Switch back to table | 271.6 | 66.4 | 74.5 |
| Expand detail | — | — | 407.5 |
| Collapse detail | — | — | 75.5 |
| Pin row | — | — | 366.7 |
| Unpin row | — | — | 73.1 |

Selection timings use the shared table state operations. Selection-driven pinning is covered independently by the pinning action and the interaction matrix. Each benchmark uses one warm-up and three measured repetitions. The interactive expansion and pin timings include mounting the full page. The current implementation remains an opt-in pilot.
The separate React Profiler build passed all 15 cases and recorded 600 samples. Both builds passed TypeScript and static generation.
