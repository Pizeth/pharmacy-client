# DataTable browser matrix runbook

This file is the living handoff for DataTable browser acceptance.

It is intentionally written so Codex, ChatGPT, or a future maintainer can pick
up the next browser matrix without reconstructing the test order from chat
history.

## Operating rule

Do not start a new matrix until every required gate in the current matrix is
either:

- **PASS**, or
- explicitly documented as **BLOCKED** with the concrete defect and follow-up
  commit/issue.

After a matrix passes:

1. record the date,
2. record the exact commit SHA,
3. record the browser/build environment,
4. fill every result cell,
5. note any console warnings separately from failures,
6. update **Current matrix** to the next matrix,
7. commit this file together with any browser-found fixes when practical.

Do not erase prior results. Append or promote the next matrix so this file
remains a chronological acceptance record.

---

# Current matrix

## Matrix A — production presentation parity before performance profiling

**Status: BLOCKED — MRT-parity follow-up for dual-edge sticky selection and a density-independent selection-aware footer must land, then controlled filter-error/retry and explicit TranslationKey refetch evidence must close (2026-09-30)**

Purpose:

Verify that the production TranslationKey resource and the Refine-backed
Document proof both exercise the shared table/card presentation architecture
before performance measurements begin.

### Environment

Record before running:

- Date: 2026-09-28
- Commit SHA: `5b39e5c3ca9577f18b2be80f0317cad863b626ff`
- Browser: Codex in-app browser
- Browser version: not exposed by the connected browser API
- OS: Windows
- Viewport: document client area 1254 x 884 CSS pixels at capture
- Development command: `npm run dev`
- API/backend commit if TranslationKey uses a local backend: not established

### A1 — TranslationKey production route

Route:

```text
http://localhost:8080/admin/i18n
```

TranslationKey remains the primary production proof. Its list request now runs
through Refine's `useList`/TanStack Query lifecycle using the named
`translationKeyStandardApi` provider, while the provider executes the
established Standard API `POST /api/v1/i18n/keys/query` wire contract.

Required checks:

| Check | Table | Card | Result / notes |
| --- | :---: | :---: | --- |
| Initial rows load | PASS | PASS | Original dataset: 31 keys; initial page: 25. |
| Named TranslationKey Refine provider handles list query | PASS | PASS | September 29/30 `[matrix-a]` runtime captures confirm named provider invocation. |
| POST /api/v1/i18n/keys/query remains the network wire contract | PASS | PASS | Runtime request/response captures confirm POST and HTTP 200; see continuation evidence. |
| Refine query does not send global-search field names over HTTP | PASS | PASS | Captured wire body uses search.term only. |
| Table/card toolbar toggle works | PASS | PASS | Both directions using keyboard Enter. Pointer automation was unreliable; see attempt log. |
| Switching view does not reset page | PASS | PASS | Page 2, 26–31 of 31, retained on card-to-table switch. |
| Switching view does not reset global search | PASS | PASS | `auth` yields five keys before/after switching. |
| Switching view does not reset column filters | PASS | PASS | Key contains `email`: same two keys; category/locale combination also retained. |
| Switching view preserves row selection | PASS | PASS | Row 8 stays selected across both directions. |
| Selection-driven row pinning matches MRT `select-sticky` behavior | PENDING FOLLOW-UP | PASS | Current table renderer proves top-edge sticking only. Required parity: one selected row remains in normal order, sticks to the top when scrolled below it, and sticks to the bottom when scrolled above it. Do not duplicate the row into both TanStack pin regions. Card selection/pinning state remains safe and already passed. |
| Edit row action honors selected-row policy | PASS | PASS | Unselected rows disabled; selected row enabled and edit dialog opens. |
| Delete row action honors selected-row policy | PASS | PASS | Unselected rows disabled; selected rows enabled. Mutation confirmation tracked separately. |
| Expand/collapse translation details | PASS | PASS | Row 8 opens/closes; expanded details survive renderer switch. |
| TranslationValue create | PASS | PASS | English values created on isolated test keys 33 and 34. |
| TranslationValue edit | PASS | PASS | Canonical results show `Matrix table value edited` / `Matrix card value edited`. |
| TranslationValue delete | PASS | PASS | English test values deleted with user confirmation; each detail panel returned to 0 of 2 locales. |
| TranslationKey create | PASS | PASS | `codex_matrix_a_20260928_table` (33), `codex_matrix_a_20260928_card` (34). |
| TranslationKey edit | PASS | PASS | Descriptions changed to `Matrix A table edit verified` / `Matrix A card edit verified`. |
| TranslationKey delete | PASS | PASS | Keys 33/34 deleted with user confirmation; prefix search returns No matching rows, 0–0 of 0. |
| Pagination works | PASS | PASS | Table 11–20 of 31 at size 10; card 26–31 of 31 at size 25. |
| Page-size change works | PASS | PASS | Independent table 25→10 yielded 1–10 of 31, then 11–20 of 31; card change also verified. September 29 continuation evidence below. |
| Global search works | PASS | PASS | `auth` returns five keys; test-key prefix returns isolated CRUD rows. |
| Key filter works | PASS | PASS | September 29 card `email` returned 2 matching keys at `4cbec52`; current visual checks tracked separately. |
| Description filter works | PASS | PASS | September 29 card `Password field` returned 1 matching key at `4cbec52`. |
| Category filter works | PASS | PASS | September 29 card `auth` returned 5 matching keys at `4cbec52`. |
| Locale filter works | PASS | PASS | English includes 30 translated keys; English + sequence_test excludes the untranslated key in both renderers. September 30 runtime recheck. |
| Sort changes work | PASS | PASS | September 29 card Key asc/desc produced opposite ordered lists; clear sent sorting []. Table descending also passed. |
| Density control | PASS | PASS | Spacious selected in table, Compact in card; card tooltip confirms Compact. |
| Pagination/footer geometry is independent of row density | PENDING FOLLOW-UP | PENDING FOLLOW-UP | The shared footer currently consumes density footer metrics. Target: one fixed footer height/padding for Compact/Comfortable/Spacious while row/header/cell density continues changing normally. |
| Pagination/footer changes background when rows are selected | PENDING FOLLOW-UP | PENDING FOLLOW-UP | Selection content already shares the pagination footer. Target: footer root exposes selected-state styling and returns to its normal background immediately after selection is cleared; presentation belongs to the RazethDataTable theme slot, not resource `sx`. |
| Fullscreen enter/exit | PASS | PASS | Enter and Exit control states verified in each renderer. |
| Saved display preference restores after reload | PASS | PASS | Each display restored on its own reload. |
| Saved density/column preferences still restore | PASS | PASS | September 30 card-origin Spacious and Key pin-to-start survive reload; original Compact/unpinned Key restored. Earlier table round-trip passed. |
| Shareable semantic query URL survives reload | PASS | PASS | Category 2, locale en, Key desc and size 25 restore five auth records. |
| Browser back/forward restores semantic query | PASS | PASS | Paced table run September 29 and card run September 30 restore both URLs and corresponding results; earlier throttling was not reproduced. Local edits use replace; test uses explicit history entries. |
| No new console errors | PASS | PASS | September 30 final capture: no errors, only pre-existing logo.svg fill/parent-position warning. Earlier throttling recorded separately. |

Important boundary:

- display mode is a saved visual preference,
- pagination/sorting/filter/search are shareable semantic query state,
- switching table/card must not manufacture a semantic server request by itself,
- Refine is the production list execution/cache layer,
- the Standard API request body remains the backend wire contract.

When checking request behavior, use the Network panel and record:

1. the initial list request is still `POST /api/v1/i18n/keys/query`,
2. its global-search payload contains only `search.term`,
3. a view switch issues no TranslationKey query request,
4. an explicit Refresh/refetch still uses the named Refine lifecycle and the
   same Standard API endpoint.

Expected: **no request caused only by the renderer switch**.

### A2 — Refine-backed Document proof

Route:

```text
http://localhost:8080/admin/documents
```

The protected Document route is fixture-backed because the production backend
does not yet expose a canonical Document list endpoint. It still exercises the
real generic Refine DataTable request bridge inside a nested Refine provider.

The optional URL parameter:

```text
?display=table
?display=card
```

now seeds only the **initial** presentation. The toolbar button owns subsequent
runtime switching.

Required checks:

| Check | Result / notes |
| --- | --- |
| Initial Refine list load | PASS — 60 fixture records, first page 25. |
| Switch table -> card from toolbar | PASS — keyboard activation. |
| Switch card -> table from toolbar | PASS — keyboard activation. |
| View switch does not issue another Refine list request | PASS — September 29 instrumentation: table/card/table held Document getList count at 2→2. |
| Search state survives view switch | PASS — Budget returns ten matching records in both renderers. |
| Pagination state survives view switch | PASS — 26–50 of 60 retained across both switches. |
| Refresh still issues exactly the expected Refine refetch | PASS — September 29 instrumentation: one Refresh increased Document getList count exactly once, 2→3. |
| Card content matches current row data | PASS — DOC-0026 through DOC-0050 match title/description/status/days/enabled/date fixture values. |
| No new console errors | PASS — no errors in captured log; shared logo positioning warning only. |

This matrix proves that card/table presentation is independent from whether the
resource uses the Standard API adapter or the Refine adapter.

### Remaining Matrix A gates — September 30

The screenshots and the legacy `src/components/fts/mrtTable.tsx` reference add
two final MRT-parity requirements before Matrix A can close. These are bounded
DataTable behavior/presentation changes. Do **not** alter unrelated routes,
navigation, page chrome, current table colors, typography, spacing, or other
visual changes already present on `master`.

#### A-PIN-DUAL-EDGE — IMPLEMENTATION REQUIRED

Current behavior:

- TranslationKey configures `rowPinning={{ displayMode: "select-sticky" }}`.
- the row checkbox currently calls TanStack `row.pin("top")` for
  `select-sticky`,
- `DataTableBodyRow` then applies only the top sticky constraint because it
  derives one edge directly from `row.getIsPinned()`,
- browser acceptance therefore proved only top-edge sticking.

Required MRT parity:

- keep TanStack as the only owner of row-pinning state,
- keep one selected row represented once; **do not** place the same row ID in
  both `rowPinning.top` and `rowPinning.bottom`,
- for `select-sticky`, let the selected row remain in its normal body order,
- apply both sticky constraints to that one physical row:
  - a top offset stacked beneath sticky header/filter rows,
  - a bottom offset stacked upward from the table scroll-container edge,
- this makes the row stick to the top when the viewport scrolls below it and
  stick to the bottom when the viewport is above it, matching MRT's
  `select-sticky` behavior,
- for multiple individually selected rows, use forward pin order for top
  stacking and reverse pin order for bottom stacking,
- `select-top`, `select-bottom`, explicit `sticky`, `top`, `bottom`,
  and `top-and-bottom` behavior must remain unchanged,
- page select-all must keep the existing safety rule that clears sticky pins
  instead of creating a viewport-sized sticky block.

Recommended implementation boundary:

1. pass the actual `DataTableRowPinningDisplayMode` (or an equally explicit
   dual-edge flag) into `DataTableBodyRow`; the current
   `stickyRowPinning: boolean` is not expressive enough,
2. replace the single pinned-offset CSS variable with independent top/bottom
   offsets when needed,
3. preserve one DOM row and one TanStack row ID,
4. keep the behavior generic; TranslationKey should not implement scroll
   listeners or resource-local pinning math.

Automated regression coverage should prove:

- one `select-sticky` selected row has dual top/bottom constraints while
  TanStack stores it only once,
- two or more selected rows stack in deterministic order at both edges,
- deselection removes the sticky constraints,
- select-all still clears row pinning,
- `select-top` and `select-bottom` remain one-edge modes,
- explicit/static row-pinning modes remain unchanged,
- density changes still recompute body-row stacking offsets correctly.

Browser recheck:

1. select a row near the middle of a long page,
2. scroll downward until the row leaves its natural position: it must stick
   beneath the header,
3. scroll upward past its natural position: the same row must stick to the
   bottom of the table viewport,
4. repeat with multiple individually selected rows and confirm clean stacking,
5. horizontally scroll with pinned columns and confirm no content bleed,
   duplicate rows, jitter, or overlap.

#### A-FOOTER-FIXED — IMPLEMENTATION REQUIRED

Current behavior:

- `DataTablePagination` reads `useDataTableDensity()`,
- `DataTableDensityMetrics` contains `footerHeight` and
  `footerPaddingBlock`,
- Compact/Comfortable/Spacious therefore change pagination-footer geometry.

Required MRT parity:

- row density controls data/header/filter geometry only,
- the shared pagination/selection footer keeps one fixed height and vertical
  padding for all density modes,
- page-size, range/status, pagination actions, selected-count text and bulk
  actions remain vertically centered at every density.

Preferred cleanup:

- remove `footerHeight` and `footerPaddingBlock` from
  `DataTableDensityMetrics` if no other consumer requires them,
- remove density-driven pagination geometry and the pagination
  `data-density` styling contract,
- keep fixed footer geometry in the generic Pagination slot and allow
  application tuning through
  `theme.components.RazethDataTable.styleOverrides.pagination`,
- do not add resource-local `sx`.

Automated regression coverage should render Compact, Comfortable and Spacious
and assert the same footer min-height/padding while body/header metrics still
differ.

#### A-FOOTER-SELECTION — IMPLEMENTATION REQUIRED

Current behavior:

- `DataTableSelectionBar` is embedded into the left side of
  `DataTablePagination`,
- embedded selection intentionally makes its own background transparent,
- the pagination root does not currently expose whether selection is active.

Required behavior:

- derive an actual `hasSelection` boolean from TanStack row-selection state,
- expose that state on the shared Pagination root (for example
  `data-has-selection="true"`),
- keep the embedded SelectionBar transparent so the complete footer changes as
  one surface rather than painting a small nested rectangle,
- style normal/selected footer backgrounds through the generic
  `RazethDataTable.pagination` theme slot,
- clearing the last selected row must immediately restore the normal footer
  background,
- the selected footer must remain identical in height to the unselected footer
  and remain independent of density,
- table and card modes must share the same footer behavior.

Automated coverage should extend
`pagination/footerComposition.spec.tsx` and pagination theme tests to verify
the state attribute/theme styling, clear-selection transition, one-footer
composition, and density independence.

#### A-REFETCH — BLOCKED

Healthy TranslationKey has no explicit Refresh toolbar action. Earlier CRUD
did refresh canonical rows, but that mutation run preceded runtime
instrumentation.

Preferred follow-up: do **not** add a permanent product Refresh control solely
for acceptance. Temporarily instrument the named TranslationKey provider/list
lifecycle, perform one reversible TranslationKey or TranslationValue mutation
whose existing success handler calls `refresh()`, and capture:

1. the same named `translationKeyStandardApi` provider invocation,
2. the same `POST /api/v1/i18n/keys/query` wire request,
3. HTTP success and canonical row replacement.

Remove temporary instrumentation afterward. A browser reload is not a
same-lifecycle refetch proof.

#### A-FILTER-ERROR — BLOCKED

Category/Locale successful async choices and filtering are verified. No
controlled lookup failure occurred, and the connected browser tools used in the
previous run did not expose request interception/offline controls.

Follow-up: add the smallest development/test-only deterministic
failure-then-retry seam that exercises the existing TranslationKey filter-option
error surface without changing production behavior. Verify in the browser:

1. the lookup failure is visible without breaking the rest of the table,
2. Retry re-executes the option request,
3. successful recovery repopulates Category/Locale choices,
4. existing table query/search/selection state remains intact,
5. both table and card presentations recover,
6. no new console errors remain.

Remove or keep the seam strictly development-only after evidence capture.

### Viewport/fullscreen regression fix — 2026-09-30

A browser regression was identified after the shared DataTable content region gained:

```text
maxHeight: calc(100vh - 350px)
```

Observed behavior:

- normal table mode correctly stopped consuming the entire page height,
- fullscreen still inherited the normal-page cap, leaving unused fullscreen space,
- card mode was clipped by the bounded content region because the card grid did
  not own vertical scrolling,
- the resource theme still carried an older table-only container cap, creating a
  second competing viewport rule.

Implementation branch:

```text
chatgpt/datatable-viewport-scroll-fix
```

Generic fix:

- `ContentRoot` keeps the normal-page `calc(100vh - 350px)` cap,
- `ContainerRoot` now owns both horizontal and vertical scrolling,
- `DataTableCardView`'s `CardContainerRoot` is a flexing, scrollable
  presentation viewport,
- fixed chrome (refresh indicator, pagination and standalone selection footer)
  does not shrink inside the bounded region,
- fullscreen explicitly removes the content max-height cap,
- fullscreen treats table and card presentation roots as the flexible region,
- the obsolete TranslationKey-only `dataTableClasses.container` max-height /
  min-height rule was removed from `RazethTranslationKeyTable`,
- no resource-local `sx` or duplicated card/table height contract was added.

Automated regression coverage on this branch now checks:

- fullscreen shell/content keeps the required flex/overflow structure,
- exiting fullscreen restores the normal-page
  `maxHeight: calc(100vh - 350px)` cap,
- card presentation owns `overflow: auto`, `minHeight: 0`, and flexible
  viewport geometry.

CI note:

- GitHub Actions run `36692123975` failed only in
  `fullscreenInteraction.spec.tsx`,
- typecheck passed and 92/93 suites passed (488/489 tests),
- the failed assertion asked JSDOM to expose `min-height` / `max-height`
  from a nested Emotion fullscreen selector through `getComputedStyle`,
- JSDOM returned the nested flex/overflow declarations but did not surface those
  height declarations, so this was a test-environment false negative rather
  than evidence that the browser CSS rule was absent,
- the test was narrowed to the structural fullscreen contract plus the
  normal-cap restoration; real fullscreen height remains a required browser
  acceptance check below.

#### Required browser recheck for this regression

Run these before continuing the remaining Matrix A parity items:

1. **Normal table**
   - open `/admin/i18n`,
   - use page size 100 where available,
   - confirm the table remains bounded rather than filling the whole page,
   - vertically scroll inside the table presentation,
   - horizontally scroll and confirm pinned columns/header remain correct,
   - confirm pagination/footer remains visible and is not clipped.
2. **Fullscreen table**
   - enter fullscreen,
   - confirm the DataTable shell uses the full viewport height,
   - confirm the table presentation expands to the space between toolbar and
     footer,
   - vertically and horizontally scroll,
   - confirm no artificial `calc(100vh - 350px)` dead area remains,
   - exit fullscreen and confirm the normal bounded height returns.
3. **Normal card**
   - switch to card presentation,
   - confirm cards beyond the first visible rows are reachable by scrolling
     inside the DataTable content region,
   - confirm the footer remains visible,
   - expand at least one card and verify later cards remain reachable.
4. **Fullscreen card**
   - enter fullscreen while card mode is active,
   - confirm the card grid uses all available height between toolbar and footer,
   - scroll to the last card,
   - expand/collapse one card and verify scrolling still works,
   - exit fullscreen and confirm normal bounded card height returns.
5. **State preservation**
   - set search/filter/sort/selection,
   - repeat table -> card -> fullscreen -> exit -> table,
   - confirm semantic query and row state remain unchanged,
   - confirm switching presentation alone creates no TranslationKey list request.
6. **Console**
   - capture console after the sequence,
   - record new DataTable errors separately from the known application baseline.

Do not mark this regression PASS from unit tests alone. Record the browser commit
SHA/environment and results here after the check.

#### Browser regression observed after PR #34 merge — 2026-09-30

Production browser recheck on `/admin/i18n` exposed two blockers that unit
coverage had not captured:

1. **A-PIN-DUAL-EDGE still failed visually.**
   - individually selected rows were pinned only to the top edge,
   - scrolling downward did not allow the same selected row to stick to the
     bottom edge,
   - TanStack correctly held one row identity in the top pin region, so the
     missing behavior was renderer geometry rather than state ownership.

2. **Card mode regressed into overlapping rows.**
   - after the bounded/fullscreen viewport fix, `CardContainerRoot` was both a
     shrinkable flex item and the CSS grid itself,
   - in the real browser the implicit grid rows compressed inside the bounded
     flex viewport and cards visually overlapped,
   - the fix separates responsibilities:
     - outer `CardContainer` = flexing scroll viewport,
     - inner `CardGrid` = intrinsic CSS grid content,
   - `CardGrid` uses `grid-auto-rows: max-content` so expanded/tall cards
     contribute their real height and later rows cannot occupy the same visual
     space.

Current fix branch:

`chatgpt/datatable-dual-sticky-card-grid-fix`

The dual-edge implementation keeps one TanStack pin identity and adds
presentation-only bottom constraints to `select-sticky` rows. Multiple rows
use forward top offsets and reverse bottom offsets.

Browser acceptance for this branch must explicitly recheck:

- one selected row while scrolling above and below its natural position,
- multiple selected rows and deterministic edge stacking,
- deselection cleanup,
- card mode with no expanded card,
- card mode with one expanded card,
- card mode scrolled to the last card,
- fullscreen card mode,
- no card overlap at any point.

#### Current execution order

Do not skip ahead. The remaining Matrix A work is:

1. **CI for PR #34 must be fully green.**
   - typecheck,
   - complete Jest suite,
   - whitespace check.
2. **Browser-certify the viewport/fullscreen regression fix.**
   - normal table bounded scrolling,
   - fullscreen table fills the shell,
   - normal card scrolling reaches the last card,
   - fullscreen card fills the shell and still scrolls,
   - footer remains visible,
   - state survives presentation/fullscreen transitions,
   - no renderer-only TranslationKey request is created,
   - no new console errors.
3. **Implement A-PIN-DUAL-EDGE.**
   - one selected row, one TanStack row ID,
   - dual physical sticky constraints for `select-sticky`,
   - deterministic multiple-row top/bottom stacking,
   - preserve all existing one-edge/static modes and select-all safety.
4. **Implement A-FOOTER-FIXED + A-FOOTER-SELECTION together.**
   - density no longer changes footer geometry,
   - whole shared footer exposes selection state and changes theme surface,
   - embedded selection content stays transparent,
   - table/card share the same footer.
5. Run targeted tests, typecheck, complete DataTable tests, then complete Jest.
6. Browser-rerun only the affected pinning/footer rows first.
7. **Close A-REFETCH.**
   - same mounted TranslationKey lifecycle,
   - named `translationKeyStandardApi` provider,
   - canonical `POST /api/v1/i18n/keys/query`,
   - HTTP success and canonical row replacement,
   - no permanent product Refresh control added for acceptance.
8. **Close A-FILTER-ERROR.**
   - deterministic development/test-only failure-then-retry seam,
   - warning remains localized,
   - Retry succeeds,
   - Category/Locale choices recover,
   - query/search/selection state remains intact,
   - table and card both recover.
9. Run the final Matrix A smoke pass and console/network capture.
10. Mark Matrix A PASS only when every required row is green.
11. Only then begin Matrix B / 2.2.2 performance measurement.
12. Decide whether 2.2.3 virtualization is justified from realistic-density
    evidence, not from the 1000x32 stress case alone.

#### Deferred architectural PR

PR #31, `refactor(datatable): establish core layering`, is intentionally
**open, draft, useful, and unmerged**.

It contains substantial behavior-neutral core/react/browser layering work and
must not be treated as disposable. It is deferred because merging/rebasing that
large extraction while Matrix A and 2.2.2 are still establishing the production
baseline would mix architecture migration into browser/performance acceptance.

After 2.2.2 closes:

1. rebase/reconcile PR #31 against the then-current `master`,
2. preserve the already-finished extraction where it still matches the
   stabilized contracts,
3. resolve only real conflicts/API drift,
4. rerun complete CI and the relevant acceptance surface,
5. continue the core extraction from that PR rather than recreating it.

The current visual styling outside these bounded behaviors is intentional and
must be preserved. Matrix B / 2.2.2 remains gated; no virtualization decision
or performance claim is made.

### Matrix A completion record

Fill this only after every required item passes.

- Status: ☐ PASS / ☐ BLOCKED
- Completed date:
- Commit SHA:
- Notes:

When Matrix A passes, promote **Matrix B** below to current.

### Attempt log — 2026-09-28

- Checkout: `5b39e5c3ca9577f18b2be80f0317cad863b626ff` (clean before this record).
- Environment: Windows, Codex in-app browser, development app at port 8080.
  Browser version and viewport have not yet been captured.
- A1 entry attempted: `/admin/i18n` rendered the startup screen, then redirected
  to `/login?callbackUrl=%2Fadmin%2Fi18n`. No DataTable was reached.
- Blocker A-AUTH: this browser has no authenticated session. Follow-up: sign in
  with a test account that can perform TranslationKey/TranslationValue CRUD,
  then resume A1. No application defect or fix commit is established by this
  authentication precondition.
- All A1/A2 acceptance cells remain unexecuted; unchecked cells are not passes.
  Matrix B remains gated. The completion record above is intentionally unfilled.
- Pre-matrix login console baseline (not attributed to DataTable): React reports
  an update of `Controller` while rendering another `Controller`; Google One Tap
  reports a FedCM migration warning and an aborted FedCM request; Cloudflare
  Turnstile emits opaque `NaN` warnings/errors. Compare with this baseline after
  authentication before assigning DataTable console failures.
- Server setup: sandboxed `npm run dev` failed with `spawn EPERM`; an approved
  retry found port 8080 already occupied (`EADDRINUSE`). The browser successfully
  reached the existing app; its process was not stopped or replaced.

### Authenticated continuation — 2026-09-28

- A-AUTH resolved: user signed in in the same browser. The preceding entry is
  the historical preflight attempt; the result tables above reflect the later
  authenticated run.
- A-CARD-FILTER: Show column filters changes to Hide column filters in card
  mode, but there are no Key/Description/Category/Locale inputs. Switching to
  table immediately exposes them. Existing filters continue to apply in cards.
  Follow-up: provide a renderer-independent filter surface and rerun these four
  card checks. Source corroboration: `DataTablePhysicalRenderer` returns
  `DataTableCardView` before the table branch containing `DataTableHead`.
- A-CARD-SORT: cards retain an existing sort, but no card-mode sorting control
  appears in the toolbar or cards. Follow-up: provide a sorting control usable
  without table headers, or explicitly revise the acceptance requirement.
- A-OBS: connected browser APIs provide DOM, screenshots and console logs, but
  no network request/body capture or Refine getList counter. Source inspection
  confirms the named adapter and POST implementation; it is not runtime proof.
  Follow-up: capture a HAR/request log plus fixture invocation counts for initial
  load, search, renderer switch and Refresh. Healthy TranslationKey toolbar also
  has no explicit Refresh control; Retry was exercised after the rate-limit error.
- A-RATE: browser rendered `ThrottlerException: Too Many Requests` during history
  navigation. A single Retry after completing Document checks recovered the
  filtered list. Follow-up: rerun history verification with paced requests.
- Browser pointer automation did not consistently activate its intended control.
  After a clean reload, keyboard Enter/Space activation worked reliably and was
  used for the recorded interactions. Pointer behavior is not certified by this
  run and is not assigned as an application defect.
- Document console: only the shared `logo.svg` fill/parent-position warning;
  no captured errors. The login console baseline above is separate.
- CRUD uses only keys 33 and 34 created for this run. User explicitly approved
  permanent deletion of both keys and their English translations for acceptance
  and cleanup. Both translations and keys were deleted successfully; the exact
  test prefix returned No matching rows, 0–0 of 0. No pre-existing record was
  edited or deleted.
- No application code changes or architectural extraction were made during the
  browser run itself. Matrix B was not started because Matrix A had not passed.

### Card parity follow-up — 2026-09-28

- Commit: `9c01a2ca0c5db336250c27e700a8541740b96798`.
- A-CARD-FILTER implementation gap addressed generically:
  - card mode now renders a toolbar filter panel when the existing subheader
    filter presentation is open,
  - it reuses the existing `DataTableColumnFilter` editors over visible,
    filterable leaf columns,
  - it writes the same TanStack `columnFilters` state; no card-only query or
    duplicated resource state was introduced.
- A-CARD-SORT implementation gap addressed generically:
  - card mode now exposes a toolbar sorting menu for visible sortable columns,
  - ascending, descending and clear operations write the existing TanStack
    sorting state,
  - table mode keeps its existing header-owned sorting interaction.
- New theme slots were registered for the card filter/sort toolbar surfaces;
  no resource-local `sx` styling was introduced.
- New Jest regression coverage exercises card filtering, card sorting and the
  absence of duplicate card controls in table mode.
- GitHub Actions CI run `36412062765` passed:
  - dependency install,
  - typecheck,
  - complete Jest suite,
  - `git diff --check`.
- Browser status remains **PENDING RECHECK** rather than PASS. Rerun the
  TranslationKey Key/Description/Category/Locale card filters and card sorting
  controls before promoting Matrix A.
- PR #31 (`chatgpt/datatable-core-layering`) remains intentionally separate
  and draft. Do not merge the architectural extraction into Matrix A before the
  acceptance/performance gate is complete.

---

# Next matrix

## Matrix B — 2.2.2 performance / virtualization decision gate

**Status: WAITING FOR MATRIX A**

Development-only route:

```text
http://localhost:8080/dev/datatable/performance
```

The route intentionally returns `notFound()` outside development.

Use the dedicated baseline protocol in:

```text
docs/datatable-performance-baseline-2-2-1.md
```

### B1 — baseline sizes

Run in this order:

| Rows | Columns | Table | Card | Mount | Avg | Max | DOM rows/cells/cards | Scroll / interaction notes |
| ---: | ---: | :---: | :---: | ---: | ---: | ---: | --- | --- |
| 25 | 8 | ☐ | ☐ | | | | | |
| 100 | 16 | ☐ | ☐ | | | | | |
| 200 | 16 | ☐ | ☐ | | | | | |
| 500 | 16 | ☐ | optional | | | | | |
| 1000 | 32 | ☐ | optional | | | | | |

For each required case:

1. select rows/columns/presentation,
2. click **Reset measurement**,
3. record the clean mount,
4. toggle first-row selection,
5. toggle first-row expansion,
6. toggle Name sort twice,
7. scroll vertically,
8. scroll horizontally in table mode,
9. repeat the interaction sequence three times,
10. record last/average/max profiler duration and DOM counts.

### B2 — decision

Do **not** decide from the 1000 x 32 stress case alone.

Answer these questions from the measurements:

- Are realistic server-backed page sizes (especially 25–100 rows) visibly
  delayed during normal interactions?
- Is 200 rows still acceptable?
- Does pinned-column horizontal scrolling remain smooth at realistic sizes?
- Does card presentation materially change the bottleneck?
- Is DOM size, rather than request latency, demonstrably the limiting factor?

Decision:

- ☐ **DEFER virtualization** — normal production densities remain responsive.
- ☐ **PROCEED to 2.2.3** — profiling demonstrates a material user-visible
  renderer bottleneck at a realistic density.

If virtualization proceeds, preserve:

- sticky headers,
- logical start/end column pinning,
- row pinning,
- selection,
- expansion/detail panels,
- keyboard accessibility,
- RTL,
- density,
- card/table boundaries.

### Matrix B completion record

- Status: ☐ PASS / ☐ BLOCKED
- Completed date:
- Commit SHA:
- Decision:
- Evidence summary:
- Next matrix / phase:

---

# Future matrix template

Copy this section rather than inventing an ad-hoc browser checklist.

## Matrix <letter> — <name>

**Status: PLANNED**

Purpose:

<why this matrix exists>

Environment:

- Date:
- Commit SHA:
- Browser:
- Browser version:
- OS:
- Viewport:
- Relevant backend/provider state:

| Check | Expected | Result | Notes |
| --- | --- | --- | --- |
| | | ☐ | |

Completion:

- Status: ☐ PASS / ☐ BLOCKED
- Completed date:
- Commit SHA:
- Follow-up:


### Visual parity follow-up — 2026-09-29

#### Continuation — 2026-09-30

Environment: base `a70b8ec3a874472c8edb68faf0ea211df046d53f` plus
user's uncommitted updates, installed Next.js 16.3.7, Windows, Codex in-app
browser (version not exposed), desktop screenshots approximately 1190×884,
mobile override 390×844. Results describe this working tree, not a clean
release commit. Temporary viewport override reset after verification.

Final post-instrumentation-cleanup automated gate:

- `npm run typecheck`: PASS.
- `npm test -- --runInBand`: PASS, 93 suites / 489 tests.
- `npm run test:datatable -- --runInBand`: PASS, 88 suites / 470 tests.
- `git diff --check`: PASS.
- Source search confirms no remaining `[matrix-a]` logging.
- Final browser console: no errors; existing logo positioning warning only.

Same Matrix A, resumed at `a70b8ec`; pre-existing local changes in
`package.json`, `package-lock.json` and the public link page are preserved.
The subsequent visual commit intentionally restores global neumorphic shell
shadows; earlier dedicated-shadow screenshot observations therefore describe
the prior checkout, not current visual acceptance. Current visuals require
recheck. The preserved browser tab is a connection-error/login tab; browser
security policy blocked control and manual localhost navigation/sign-in was
requested. No new browser PASS is recorded from that attempt. Matrix B remains
gated. The interrupted focused-test process is no longer available; its final
result is not assumed.
After user sign-in, current dark card screenshot confirms readable text,
clear selected outline, row Edit/Delete before expanded detail, and visible
Add Translation/English Edit/Delete. Card filters reuse the compact filled
family. Lower detail controls and light mode still require this checkout's
recheck; no architecture changes are needed from this observation.
Typecheck and `git diff --check` pass on the September 30 checkout. Theme
checkbox automation still times out and leaves dark mode checked; a manual
light-mode switch was requested to separate app behavior from browser-control
limitations. Light mode remains unverified until a screenshot is inspected.
Manual theme switching succeeded. Light-mode expanded `auth_email` screenshot
now verifies readable card text, soft shell consistent with Navigation,
distinct inset detail, clear red selected outline, and row actions preceding
detail controls. The theme-switch blocker was automation-specific; light/dark
card visual hierarchy is verified on `a70b8ec` with the user's shell styling.
Scrolling light card detail exposes both English and Khmer Edit/Delete
controls completely, with Add Translation visible and no horizontal scrolling.
Non-first-row sticky test: selected fifth row `auth_password` (ID 9), then
scrolled the table body to profile rows 16–20. Its selected row and enabled
Edit/Delete remain immediately below the sticky header. Table sticky behavior
is browser-verified; card selection safety is checked separately.
Switching that selected fifth row to card preserved exactly one ID-9
checkbox and the `1 row selected / auth_password` bulk-action state, with
no duplicate selected card. Card-origin persistence setup: chose Spacious
and pinned Key to start, then reloaded; restoration check follows.
Complete Jest on the September 30 checkout: PASS, 93 suites / 489 tests.
Card preference reload PASS: card view restored, density menu marks Spacious
active, and Columns shows `Unpin Key from start` pressed. Restoring Compact
and the original unpinned Key after the check.
September 30 runtime search: card `auth` returns 1–5 of 5. Named
`translationKeyStandardApi.getList` sends POST `/api/v1/i18n/keys/query`
with `search:{term:"auth"}` and no search field names; response HTTP 200.
Focused Jest PASS: 88 suites / 470 tests.
Paced card history setup: explicit page-2/size-10 URL renders 11–20 of 31.
Back restores auth search, page 1, size 25 and 1–5 of 5 matching card results.
Forward restores page 2, size 10, empty search and 11–20 of 31 card results.
Paced card Back/Forward result restoration passes without throttling.
User confirmed the latest visual styling is intentional; preserve it and
evaluate usability rather than changing its appearance.
Current card Locale menu loads All/English/Khmer; choosing English resets
to page 1 and yields 1–10 of 30 (one untranslated key excluded).
English plus Key `sequence_test` yields No matching rows / 0–0 of 0 in
card mode, confirming the untranslated-key exclusion case.
Switching to table retains that exclusion result and wire-request count
4→4. No semantic request is manufactured by the renderer change.
Console capture after paced history/filter/switch checks: no errors; only
the pre-existing logo.svg fill/parent-position warning. Healthy TranslationKey
toolbar exposes no Refresh control, so an explicit same-query manual refetch
cannot be exercised through that surface without a mutation or an error.
Latest light table screenshot confirms full-width expanded detail, both
translation Edit/Delete groups and Add Translation visible, compact aligned
filled filters, and icon-only expansion header. User visual changes preserved.
After temporary instrumentation removal, 390×844 light mobile table recheck
shows Add Translation and both value Edit/Delete groups fully accessible.
The table can scroll horizontally, but detail actions do not require it.
Latest 390×844 light card recheck: selected row actions precede the inset;
keyboard navigation reaches the lower detail actions and scrolls both locales'
Edit/Delete into view with readable text and no horizontal overflow.
Temporary `[matrix-a]` logging removed from the API, named provider and
Document fixture provider after recording runtime evidence.

Continuation checkpoint (same Matrix A): checkout `6060a85` includes the
requested 5px filled filters, dedicated card/inset shadow tokens, and removal
of the TranslationValue panel width cap. The latest visual commit comments
out the card-shell override; its rendered appearance still needs inspection.
All visual rows below remain PENDING RECHECK.

Latest-master browser observation: recovered the existing authenticated run
after a development-server restart. In dark card view (1265px screenshot),
selected `navigation_dashboard` has a clear red outline; row Edit/Delete
appear before its inset detail. Add Translation and the first value's
Edit/Delete are visible; text wraps normally rather than into single-character
columns. Full detail scrolling, light mode and narrow widths are still pending.
Typecheck passed after regenerating the feature map (line-ending-only
normalization; no semantic Git diff). Full Jest is in progress.

Scrolling the expanded dark card exposed the second (Khmer) value's Edit/Delete
controls fully, with no horizontal scrolling needed. Desktop card detail
action visibility and normal text wrapping are verified; light/narrow checks
remain pending.

Latest-master desktop table screenshot: expanded `navigation_dashboard`
detail spans the table width; Add Translation and both locales' Edit/Delete
are visible without horizontal scrolling. Key/Description/Category/Locale
filters are filled, compact and vertically aligned. Expansion header displays
only a compact double-chevron (no Details text); the row remains expanded
after switching from card view. Accessibility inspection confirms the
`Expand all rows unavailable` button is disabled; individual expansion works.
The expansion-header check passes on latest master.

Automated recheck: typecheck PASS; full Jest PASS (93 suites, 489 tests).
Focused DataTable Jest also passed (88 suites, 470 tests). Inspection then
found the active cardItem override still referenced global shadows despite
the dedicated tokens being defined. The shell and selected/pressed states
now use dataTableCard/dataTableInset; layout and shared chip accents are
preserved. Card shadow appearance is PENDING RECHECK after this final edit,
and the required automated commands are being rerun on the final state.
Final-theme dark card screenshot confirms distinct shell elevation, clear
selected outline and clean inset detail without collapsed text or displaced
row actions. Light-mode verification is currently blocked: activating the
navigation account-menu theme checkbox closes the popover without changing
the dark appearance (keyboard, accessible click and visible-coordinate click
attempts). This is not recorded as a light-mode PASS.
At a 390×844 viewport (375px content width excluding scrollbar), the card
remains a single readable column, selected outline is clear, and row actions
precede the inset detail. Document scrollWidth equals clientWidth (375px),
so there is no document-level horizontal overflow. Lower detail action
scrolling is being checked separately.
Mobile card scrolling exposes Add Translation and both locales' Edit/Delete
fully within the card; all remain readable without horizontal scrolling.
Mobile card action visibility passes in dark mode.
Mobile table screenshot also shows Add Translation and both English/Khmer
Edit/Delete within the detail pane at 390×844. The data row uses horizontal
table scrolling/pinned utility columns, but the detail actions remain
accessible without horizontal scrolling. Mobile table action visibility passes.
Latest-master runtime recheck: named provider sends page 2 / size 10 through
POST `/api/v1/i18n/keys/query`, returning HTTP 200. After the theme HMR reload,
a table-to-card switch held wire-request count at 4→4 and results at
11–20 of 31. Initial development/remount pairs are separate from mode changes.
Temporary viewport override was reset after mobile checks.
Latest card search `auth` resets page 2 to page 1, preserves page size 10,
updates the semantic URL, and renders 1–5 of 5 matching keys.
History setup note: editing search in this recovered tab replaced its initial
history entry; Back reached about:blank rather than a prior query. This is
not evidence of result-restoration failure. The paced query-history check
requires two explicitly established URL entries, as in the earlier table run.
Explicit page-2 URL entry renders 11–20 of 31 in card mode at size 10.

Runtime evidence captured earlier in this same run, before PR #32, at
`4cbec523d4226edbd5659d51e244cbd71b3d7132`:

- Card Key `email`: 2 matching keys; Description `Password field`: 1;
  Category `auth`: 5. English locale: 30 of 31 keys; combining English with
  `sequence_test` excludes the untranslated key (0 results).
- Card Key ascending and descending produced opposite ordered auth lists;
  clear sorting restored an empty sorting request.
- Independent table page size 25 to 10 produced 1–10 of 31; next page
  produced 11–20 of 31.
- Paced table history restored page 2 / size 10 / 11–20 of 31 on Back and
  `auth` / 1–5 of 5 on Forward. Card history remains to be finished.
- `[matrix-a]` captured `translationKeyStandardApi.getList`, POST
  `/api/v1/i18n/keys/query`, and HTTP 200. Search body used
  `search: { term: "auth" }` without client-selected search fields.
- TranslationKey table/card switches held wire-request count at 2;
  Document table/card/table held getList count at 2. Document Refresh
  increased count exactly once, from 2 to 3. The two initial development
  calls are recorded separately from switch-triggered calls.

These observations do not certify the new visual surfaces. Temporary runtime
logging remains until the remaining runtime checks are captured. Matrix B
and the virtualization decision remain gated by Matrix A.

Implementation branch / PR:

- branch: `chatgpt/datatable-visual-parity-2-2-2`
- PR: #32 — `feat(datatable): polish visual parity surfaces`
- automated gate before this record:
  - typecheck: PASS
  - complete Jest suite: PASS
  - whitespace check: PASS

This follow-up is intentionally **not** recorded as browser PASS. The code
addresses defects observed in screenshots while Codex browser acceptance was
paused, and the browser must verify the actual rendered result.

Changes requiring focused recheck:

| Visual acceptance check | Table | Card | Notes |
| --- | :---: | :---: | --- |
| Expanded TranslationValue Add/Edit/Delete controls remain visible at desktop width | PASS | PASS | September 29/30 screenshots show both locale action groups; Add is visible, disabled where all locales already exist. |
| Row action footer remains visible when card detail is expanded | N/A | PASS | Row actions visibly precede expanded detail in desktop and mobile screenshots. |
| Card visual hierarchy matches application neumorphic language | N/A | PASS | Light and dark screenshots inspected; selected outline and inset are clear. User explicitly prefers latest global-neumorphic shell styling; preserved. |
| Column filters use compact filled presentation | PASS | PASS | Rendered screenshots confirm compact aligned filled controls in both views. Async failure/retry is a separate blocked gate. |
| Expansion header has no visible "Details" text | PASS | N/A | Screenshot shows double-chevron only; browser accessibility confirms disabled header; individual expansion works. |
| Narrow/mobile TranslationValue actions remain usable | PASS | PASS | 390×844 screenshots confirm both locales' actions; lower card controls also reached by keyboard. |
| TranslationValue detail panel consumes the complete expanded table row | PASS | N/A | Desktop screenshot confirms detail spans available row width. |
| Existing CRUD/filter/sort/persistence behavior remains intact | PASS | PASS | Existing CRUD results retained; filters, sorting, selection, history and preference round-trips documented above. Explicit refetch/error evidence remains separately blocked. |

Do not start Matrix B from automated CI alone. Complete the pending Matrix A
browser rows above together with the previously pending card filter/sort,
selection pinning, page-size, saved visual preference, paced history, runtime
request-observability and final console checks.
