# DataTable browser matrix runbook

## October 14 — 2.2.3.2 production measurements

Production measurements and local validation COMPLETE.
Source a0ceb53 on codex/datatable-production-profiling; Windows/Chrome153 IAB,
1440x900, Next16.4/React19.3 production builds behind local-hr.razeth.com.
Eight normal cases PASS (39 samples each); six instrumented comparison cases
PASS in both ordinary and React-profile builds (33 each); 500x16 and 1000x32
stress PASS (33 each). One warm-up then three recorded repeats per action.

Selection/expansion, both sorts, filter/clear, vertical scroll and same-store
mode switching passed the synthetic checks. Horizontal scroll passed on 16/32
column tables; eight-column/card horizontal actions had no overflow and are N/A.
No native input INP/FPS, CPU trace, or exhaustive resource-policy browser rerun
is claimed. No console errors/warnings captured in comparison runs.

Initial dependency blocker was repaired with coordinated npm ci. The earlier
development-mode stress stall below remains historical, not a production failure.
Raw samples, median/mean/max, drift caveats and stop conditions are in
[the report](datatable-performance-2-2-3-2.md) and adjacent JSON evidence.
Decision 2: bounded selection optimization helps; virtualization stays conditional.
Next matrix is 2.2.3.3 selection-dependency correctness and counterbalanced
production remeasurement. No production selector change was enabled.

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

**Status: PASS — October 13 browser continuation plus user-verified mouse-hover and touch controls complete Matrix A. Browser-found client pagination total fix is on `codex/datatable-matrix-a-closeout`. Current matrix is Matrix B.**

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
| Selection-driven row pinning matches MRT `select-sticky` behavior | PASS | PASS | Post-PR #36 browser verification and the later selection-lifecycle run confirm stable final-row ordering, clean stacked sticky rows without unexplained gaps, one selected identity, horizontal pinned-column coexistence, and safe card selection state. |
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
| Pagination/footer geometry is independent of row density | PASS | PASS | Post-PR #36 user/browser verification confirms Compact/Comfortable/Spacious still change table density while the shared pagination/selection footer keeps one fixed geometry. |
| Pagination/footer changes background when rows are selected | PASS | PASS | The shared footer exposes selection state, the whole footer uses the selected theme surface, and Clear restores the normal surface without changing footer geometry. |
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

#### Selection continuity regression after PR #36 — 2026-09-30

Production browser verification found that selected rows were being cleared by
ordinary semantic table-query changes:

- sorting,
- column filtering,
- global search,
- pagination/page-size changes.

Root cause was resource lifecycle code, not TanStack selection itself.

`useTranslationKeyDataTable()` explicitly ran:

```ts
setRowSelection({});
setRowPinning({ top: [], bottom: [] });
```

whenever `query.state` changed. The generic live table-state safety layer was
also configured to prune selection/pinning IDs against only the currently
loaded canonical server page.

That policy is invalid for a manual/server-paginated table where stable row IDs
may legitimately be selected while temporarily off-page or filtered out.

Follow-up branch:

`chatgpt/datatable-preserve-selection-across-query`

Architecture correction:

- semantic query transitions reset expanded detail panels only,
- rowSelection survives sort/filter/search/pagination changes,
- selection-driven rowPinning survives alongside rowSelection,
- current-page absence is no longer interpreted as deletion for
  TranslationKey selection/pinning,
- `keepPinnedRows=false` remains responsible for preventing off-page pinned
  records from being rendered into the active page,
- known successful deletion still removes the deleted stable ID explicitly,
- resource mutation commands remain safe because Edit/Delete require exactly
  one selected row that is also loaded in `selectedRows`.

Browser acceptance after CI:

1. select several rows,
2. sort ascending/descending and verify selection count/IDs survive,
3. filter so selected rows disappear, then clear the filter and verify those
   rows return selected,
4. search so selected rows disappear, then clear search and verify restoration,
5. change page and page size, navigate back, and verify selected rows remain
   selected,
6. confirm select-sticky rows reappear pinned when their selected IDs become
   visible again,
7. footer CLEAR must still remove both selection and selection-owned pins,
8. successful delete must remove only the deleted ID from selection.

#### Browser regression follow-up after PR #35 — 2026-09-30

PR #35 fixed the card overlap regression in the production TranslationKey
browser path. Card layout is no longer the active blocker.

The next production recheck exposed two remaining MRT-parity gaps:

1. **select-sticky stacking order / spacing**
   - selected sticky rows were stacked in TanStack pin insertion order (FIFO),
     not current final row-model order,
   - selecting rows out of sequence therefore produced visibly wrong top/bottom
     stacks and inconsistent gaps,
   - MRT derives the sticky presentation index from the currently rendered
     pinned-row sequence, while keeping TanStack pinning state as the state
     authority,
   - the follow-up derives one ordered list of pinned rendered row IDs and uses
     that list for both forward top offsets and reverse bottom offsets.

2. **shared footer still changed with row density**
   - `DataTablePagination` still consumed `footerHeight` and
     `footerPaddingBlock` from `DataTableDensityMetrics`,
   - Compact/Comfortable/Spacious therefore changed the bottom footer despite
     the documented fixed-footer target,
   - the follow-up removes footer metrics from the density contract and fixes
     the shared footer at one geometry,
   - the pagination root now exposes `data-has-selection="true"` and the
     application theme paints selected/unselected footer backgrounds on the
     complete footer surface,
   - clearing selection-driven state also clears selection-owned row pins.

Current follow-up branch:

`chatgpt/datatable-mrt-row-order-footer-parity`

Browser acceptance after CI:

- select rows deliberately out of sequence and confirm sticky top/bottom stacks
  follow visible table order rather than click order,
- scroll through the same seven-row selection and confirm no unexplained gaps,
  overlap, or FIFO reordering,
- deselect individual rows and confirm the stack closes immediately,
- use footer CLEAR and confirm both selection and selection-owned pins disappear,
- switch Compact -> Comfortable -> Spacious and verify row/header density changes
  while footer height/padding remain visually identical,
- verify selected footer background covers the complete footer and returns to
  normal immediately after clear,
- repeat footer checks in card mode.

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

- Status: PASS
- Completed date: 2026-10-13
- Commit SHA: `b2a2950b66e09b7893ac59bc153c6269e6165bb8` plus the tested uncommitted pagination fix on `codex/datatable-matrix-a-closeout`.
- Notes: Windows, Codex in-app browser, development localhost:8080. Automated baseline 120 suites/709 tests and typecheck pass. Browser continuation closes deletion/retry/refetch and new renderer/resource checks; user confirms genuine mouse hover and touch controls work. Existing logo warning recorded separately. No temporary instrumentation remains.

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

**Status: BLOCKED — realistic cases measured; material renderer cost at 100/200 rows, and 1000×32 stress interaction completion exceeds browser deadlines. Conditional 2.2.3 architecture review recorded in `docs/datatable-virtualization-2-2-3.md` (2026-10-13).**

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
| 25 | 8 | Measured | Measured | T 123.80 / C 119.50 | T 118.04 / C 80.31 | T 296.70 / C 166.20 | T 26/201; C 25 | Three interaction cycles; separate scroll checks. |
| 100 | 16 | Measured | Measured | T 845.50 / C 423.50 | T 831.78 / C 256.42 | T 1511.40 / C 434.40 | T 101/1601; C 100 | Material update cost; card cheaper. |
| 200 | 16 | Measured | Measured | T 1575.90 / C 680.10 | T 1166.43 / C 520.15 | T 1709.70 / C 751.80 | T 201/3201; C 200 | Visible update stalls in development. |
| 500 | 16 | Measured stress | Not run (optional) | 4090.40 | 2701.14 | 4090.40 | 501/8001 | Three cycles applied despite dispatch timeouts. |
| 1000 | 32 | Mount measured; interactions BLOCKED | Not run (optional) | 15839.40 | Mount sample 7951.85 | Mount 15839.40 | 1000/32000 | Input/observation deadlines; full cycles not claimed. |

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
- ☑ **PROCEED to conditional 2.2.3 architecture review** — development profiling demonstrates a material
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

- Status: BLOCKED (stress protocol); realistic density measurement run complete
- Completed date: 2026-10-13 measurement attempt
- Commit SHA: `b2a2950b66e09b7893ac59bc153c6269e6165bb8` plus tested pagination fix on `codex/datatable-matrix-a-closeout`
- Decision: conditional 2.2.3 architecture review; implementation gated on production profiling/rerender diagnosis
- Evidence summary: eight table/card cases including two additional 8-column realistic-width diagnostics; 100×8 averages 356.67ms and 200×8 averages 769.67ms. No request latency in fixture. Stress grows to 15.84s mount at 32,000 cells and prevents full 1000-row interaction protocol. No profiling console warnings/errors.
- Next matrix / phase: bounded 2.2.3 architecture review in `docs/datatable-virtualization-2-2-3.md`; Matrix B remains current with stress blocker. No new renderer or virtualization dependency introduced.

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

### October 1 — PR #37 selection lifecycle browser continuation

- Baseline: master `3ef1b0b`, PR #37 merged; head CI run 242 succeeded. Existing Matrix A continued in the authenticated browser. User's uncommitted link and theme edits are excluded from this work.
- A baseline selection: page size 100, empty search/filters; individually selected ID 8 (`auth_email`), ID 2 (`common_cancel`), ID 16 (`navigation_dashboard`). DOM confirms precisely these three checked IDs; footer says `3 rows selected`. Screenshot confirms selected highlighting, existing top sticky rows, and fixed footer. Further scroll/query lifecycle checks remain pending.
- B–L: PENDING in this continuation; prior evidence is not treated as PR #37 certification.
- B initial sort attempt: FAIL observed. After Key ascending settled (`dt.sort=[{"field":"key","direction":"asc"}]`), all three checked IDs disappeared and selection footer cleared. Investigating stale browser/runtime versus current implementation before assigning root cause; no styling change made.
- B fresh-load recheck: after reloading the long-lived browser page, selected the same IDs 8/2/16 again and sorted Key descending. All three stable IDs remain checked and the footer retains `3 rows selected`; rows now descend through `auth_email`. Initial loss did not reproduce after reload, consistent with stale pre-PR browser code. Ascending/clear and other lifecycle cases still pending.
- B sorting: PASS for descending → clear → ascending after fresh load. IDs 8/2/16 remain checked at every settled result and count remains three. Multi-sort not yet exercised.
- C Key `auth`: PASS hidden-ID retention. Exactly five auth rows render, only loaded ID 8 is checked, and footer still counts all three selected IDs. IDs 2/16 are not resurrected as off-result pinned rows.
- C clear Key filter: PASS, original checked IDs 8/2/16 return. Category `common`: PASS, six matching rows render, only ID 2 checked, global selection count remains three; no off-result rows appear.
- D search `save` with Category `common`: PASS. Only unselected ID 1 renders; footer retains three selected IDs. Hiding/reopening search preserves value `save`, categoryId 1, ascending Key sort, and selected count. No off-result selected row is inserted.
- C/D clear round-trip: PASS. Clearing search restores checked ID 2 within common; clearing Category restores all three checked IDs 8/2/16. No progressive selection loss across combined ascending sort/category/search transitions.
- F page-size 100→25→10: PASS so far. At 25 all three IDs checked; at 10 only loaded IDs 8/2 appear, global count remains three and ID 16 is absent from the rendered page.
- E pagination: page 2 renders exactly ten IDs (16/18/20/19/17/24/21/22/23/25), only ID 16 initially selected; count stays three. Selected ID 18 (`navigation_profiles`) there, increasing total to four. Returning page 1 restores checked IDs 8/2 while retaining total four; off-page IDs 16/18 do not render.
- E/F PASS: repeated page-2 visit restores checked IDs 16/18 and global four count. Returning page size 100 restores checked IDs 8/2/16/18 together. Switching to card retains the identical four checked IDs and footer count.
- J card query: PASS. Search `navigation` shows five cards, IDs 16/18 remain checked and footer counts all four IDs. Screenshot shows separate non-overlapping card shells, selected outlines, visible row actions, and footer; no selection-induced stacking defect.
- J table return + clear search: PASS, all four checked IDs restored.
- A/K fullscreen scroll: screenshot after focusing deep row 25 shows four selected rows stacked beneath filter/header, lower ordinary rows continuing without blank gaps, and footer fixed at viewport bottom. Horizontal scroll to Updated exposes Translations/Created/Updated while left expand/select and right Actions remain visible. Count stays four. PASS for these observed fullscreen/sticky/utility-pin checks.
- B multi-sort PASS: Shift+Enter Category adds secondary `category asc` after `key asc`; checked IDs remain 8/2/16/18 and count four. G combined sequence has now covered sorting, filters, search, pagination, page size, card/table changes without progressive ID loss after the fresh load.
- H footer Clear: PASS initial result. With `search=auth` hiding three of four selected IDs, Clear removes all selection and selection footer. Exact URL remains unchanged (page 1, size 100, Key+Category ascending, search auth); unrelated semantic query is preserved.
- H clear persistence PASS: clearing search returns all 31 rows with zero checked IDs; subsequent Key sort still has no selected IDs or selection footer. No hidden selection reappears.
- I deletion lifecycle: NOT EXECUTED. No current record was established as disposable; existing `sequence_test` is not assumed safe to delete. No mutation performed, and canonical post-delete selection retention remains uncertified in browser.
- L console capture: PASS for DataTable errors. No error-level entries; only two occurrences of the existing Next Image `logo.svg` fill/static-parent warning. Unrelated visual/link files preserved.
- PR #37 continuation outcome: A–H and J–L observed checks pass after fresh load, with the initial stale-page sort-loss observation retained above. I remains NOT EXECUTED. No application fix required from the fresh-load observations; no branch created and no styling/renderer changes made. Matrix A is not promoted to fully green: deletion lifecycle plus previously documented controlled async failure/retry and explicit TranslationKey refetch gates remain outstanding. Matrix B / performance gate is not started.


### October 1 — native table width contract follow-up

Branch: `chatgpt/datatable-table-width-contract`

Purpose:

- replace the experimental DOM-measured `overrideWidthSize` path,
- expose a stable first-class DataTable width contract,
- allow `tableWidth="100%"` without `tableProps.sx`,
- preserve TanStack column geometry as the default minimum width,
- support the same defaults through `RazethDataTable.defaultProps`.

Automated coverage:

- `src/components/DataTable/mui/components/tableGeometryTheme.spec.tsx`
  verifies intrinsic fallback, 100% width, explicit minimum width, numeric pixel
  normalization, theme defaults, and explicit-prop precedence.

Browser status: **PENDING**.

Required browser recheck before this follow-up is considered certified:

1. production TranslationKey table with default width still scrolls horizontally
   when the visible column model is wider than its container,
2. a fixture/resource using `tableWidth="100%"` visibly fills a wider
   container without `tableProps.sx`,
3. start/end pinned columns remain aligned while horizontally scrolling,
4. column resize handles and resized column geometry remain aligned,
5. fullscreen enter/exit preserves the width contract,
6. switching table/card/table does not mutate query state or produce layout
   regressions,
7. no new console errors.

This width follow-up does **not** close the remaining Matrix A blockers.
Deletion-lifecycle browser evidence, controlled async filter-option
failure/retry, and explicit same-lifecycle TranslationKey refetch evidence
remain outstanding.


### October 13 — latest-master closeout rescope after PR #38

Current clean repository baseline for the next browser/CI handoff:

- master commit: `3b62de029f0bd75debf6ddda1755b663230ec096`
- PR #38 (`fix(datatable): add overridable native table width`) is merged,
- master is 15 commits ahead of the PR #38 merge commit
  `4b6f7c086befa80945a66d864e5e128f82e2822e`,
- those later commits include real DataTable behavior/presentation changes plus
  large HRD/resource/navigation work,
- no GitHub Actions run is associated with the latest direct-push master commit,
  so the next branch must establish a fresh automated baseline before changing
  DataTable behavior.

#### DataTable changes added after PR #38 that require targeted regression proof

1. **Generic row activation**
   - `DataTable` now exposes row-click activation through the body/row chain,
   - interactive descendants must not trigger the row action,
   - Enter/Space on the focused row must remain keyboard-accessible,
   - the new generic regression surface is
     `src/components/DataTable/mui/components/rowClickInteraction.spec.tsx`.

2. **Card flip detail presentation**
   - card detail can now use `detailMode: "flip"`,
   - flip state is still TanStack expansion state,
   - mouse hover may reveal the back face while touch/pen must not depend on
     hover,
   - hidden faces use `aria-hidden` / `inert`,
   - focus transfers between matching front/back controls,
   - actions are present on both faces,
   - card flip slots/classes are now part of the generic theme surface.

3. **Global-search / toolbar presentation rework**
   - the DataTable global filter now composes the shared
     `src/components/Search/SearchInput.tsx` input family,
   - collapsible search uses horizontal MUI Collapse,
   - Enter commits immediately,
   - Escape clears when clearable,
   - blur commits pending debounce,
   - hiding/reopening search must preserve committed semantic search state,
   - card filter/sort controls remain renderer-independent.

4. **Native table-width contract**
   - `tableWidth` / `tableMinWidth` from PR #38 remain the supported API,
   - `tableWidth="100%"` is now used by the HRD public-document resource,
   - no return to `overrideWidthSize` or resource-local `tableProps.sx`
     width hacks is allowed.

5. **HRD PublicDocuments is now an additional real DataTable consumer**
   - current route family lives under `src/features/hrd/documents`,
   - it is a client-side/static-data resource, not a replacement for the
     Refine-backed Document proof,
   - it exercises client-side filtering/sorting/pagination, auto table/card
     presentation, compact cards, row activation, row actions, category
     filtering, theme switching, and the 100% table-width contract,
   - row activation must not double-fire when View/Download/action controls are
     used.

#### Core/react architecture audit

The latest direct pushes did **not** materially rewrite
`src/components/DataTable/core/**`.

Current master still contains the earlier framework core:

- builder / generated feature resolution,
- commands,
- context/runtime,
- events,
- plugins,
- registries/services,
- core TanStack table construction,
- the small React runtime/hooks projection.

The most recent core-path commit on master is the September 25 row-pinning
feature exposure. The generated feature audit now exposes 12 TanStack stock
features and intentionally ignores 5.

Draft PR #31 remains valuable architecture research, but it is no longer a
candidate for a blind merge/rebase:

- PR #31 is currently 83 commits ahead of its old base and 102 commits behind
  current master,
- it introduces a second set of `core/density`, `core/server-*`,
  `core/live`, `core/persistence`, `core/query-url` domains plus React
  splits,
- current master has since changed row pinning, card/table presentation, width,
  row activation, search, resources, and dependencies.

Keep PR #31 open/draft as the donor/reference branch. After Matrix A and Matrix
B close, reconcile it deliberately against current master by porting one
transport-independent domain at a time and proving boundaries, rather than
attempting a mechanical whole-branch merge.

#### Updated Matrix A closeout order

Before Matrix B/performance profiling:

1. establish a green latest-master automated baseline:
   - `npm run typecheck`
   - `npm run test:datatable -- --runInBand`
   - `npm test -- --runInBand`
   - `git diff --check`
2. browser-certify the PR #38 width contract,
3. browser-certify generic row activation on HRD PublicDocuments:
   - row click activates once,
   - keyboard Enter/Space activates once,
   - View/Download/buttons/links do not bubble into row activation,
4. browser-certify card flip:
   - front/back control,
   - hover only for mouse,
   - touch/narrow usage through explicit control,
   - focus/inert/aria behavior,
   - no layout overlap,
   - actions remain reachable,
5. browser-certify the reworked collapsible global search and debounce semantics
   in both TranslationKey and HRD PublicDocuments,
6. re-run the already-established TranslationKey selection/query smoke after the
   post-PR #38 renderer changes,
7. close the remaining original Matrix A evidence gaps:
   - safe deletion lifecycle,
   - deterministic async filter-option failure/retry,
   - explicit same-mounted-lifecycle TranslationKey refetch,
8. perform one final integrated console/network smoke,
9. only then mark Matrix A PASS and begin Matrix B.

Matrix B / the virtualization decision remains gated until this closeout is
complete.

### October 13 — PR #39 merged Matrix A continuation

- Baseline: `b2a2950` (PR #39 merge), clean working tree at start; Windows, Codex in-app browser, `localhost:8080`, authenticated TranslationKey route, 31 keys. Existing Matrix A continued using the updated October 13 closeout order.
- Automated: typecheck PASS; focused Jest initially blocked by sandbox temporary-cache EPERM, rerun requested outside sandbox. Full suite pending.
- Native default-width browser check: PASS. TranslationKey rendered table width 1940px in a 1036px scroll container; horizontal scroll exposes Updated/Created while start expand/select and end Actions remain aligned and reachable in screenshot. Other width cases remain pending.
- Fullscreen width round-trip PASS: table stays 1940px while container changes 1036→1084→1036px.
- Browser control temporarily timed out; reconnecting the same tab recovered without application edits. No selection/search result was inferred from the failed call.
- TranslationKey search: Enter on `auth` settles to five matching rows with `dt.search=auth`; hide/reopen retains `auth`; Escape clears the visible input. Settled clear result and blur/debounce/card checks pending.
- Search Escape settled PASS: returns 1–25 of 31. Selected ID 8 and switched table→card: checked identity and one-row footer preserved.
- Card flip explicit keyboard control: opens auth_email back face, focus transfers to `Back to key`, active control has no inert/aria-hidden ancestor. Settled screenshot shows a readable back face with translation actions and no card overlap; lower content extends inside the scroll area, so lower-action reachability remains to verify. Initial screenshot was mid-animation and is not used as a defect finding.
- Focused Jest PASS: 91 suites / 517 tests, 314.435s, unrestricted rerun completed. Full suite still running.
- Card flip lower actions PASS: scrolling/focus exposes Khmer Edit/Delete plus key Edit/Delete; hidden front has both inert and aria-hidden=true. Back-to-key returns focus to Show translations.
- Card search blur commit PASS: `email` + Tab settles to two rows and semantic URL `dt.search=email`; card→table retains checked ID 8 and result set.
- HRD native `100%` width PASS at wide desktop: 1410px minimum, rendered width equals 1486px container at viewport 1920×1080. At default viewport, table preserves 1410px minimum within 1021px container. Screenshot confirms filled wide surface.
- HRD first-row Enter activation: one Opening notice and exactly one new Google Drive folder tab. Pointer/Space and action bubbling checks pending.
- Full Jest PASS: 120 suites / 708 tests, 136.015s. No application changes made.
- HRD row activation PASS for observed resource controls: Enter, Space, pointer click on first row title each opens exactly one Drive folder tab. Clicking nested Download opens exactly one tab (no duplicated row activation). Test-created destination tabs closed after checking.
- HRD search regression found: settled no-match search hides rows but footer stays `1–11 of 11`. Root cause: client total uses raw data length and footer subscribes only pagination/selection. Fix on `codex/datatable-matrix-a-closeout` uses TanStack v9 getRowCount and subscribes to global/column filters. Regression covers matching search, no-match search, clear, and column filter. Browser and automated rechecks pending. An intermediate v8 method-name attempt caused a local runtime overlay; corrected to the installed v9 API before recheck.
- Pagination fix browser recheck PASS: impossible search gives `0–0 of 0`; Khmer `ឈប់សម្រាក` gives `1–1 of 1`; table→card keeps that count; Escape restores `1–11 of 11`. Typecheck PASS on final getRowCount implementation. First regression execution used intermediate method and failed; final full/focused reruns now active.
- HRD narrow card screenshot at 390×844 shows separate compact cards and accessible controls; document clientWidth=scrollWidth=375px (no horizontal document overflow).
- TranslationKey narrow flip PASS for explicit keyboard control at 390×844: Show translations opens back face; scrolling via lower detail-control focus exposes Khmer Edit/Delete and row action footer without horizontal overflow or overlap. Genuine touch/pen pointer events and mouse hover are not certified by viewport/keyboard emulation alone.
- Prepared safe delete lifecycle in card mode: created `codex_matrix_a_20261013_delete` (ID 35), common category, no values. Selected ID 8, isolated ID 35 via search, selected it; footer counts two while one loaded selected row enables the resource Delete. Confirmation dialog names ID 35's key and says irreversible. User action-time confirmation pending; no delete sent yet.
- Confirmed deletion browser PASS: ID 35 deleted with user approval; footer count changes two→one, clearing search restores checked ID 8 and canonical 31-key dataset. No existing record was mutated.
- Temporary resource-owned dev controls/instrumentation added solely to capture controlled Category failure/retry and explicit mounted Refine refresh. These will be removed after evidence; they are not permanent UI additions.
- Controlled card Category failure/retry PASS: temporary dev trigger rejects one category request; rendered warning/Retry appears, Category disabled, Locale remains enabled. Retry makes real category request and restores enabled sorted options All/auth/common/navigation/profile/translation/validation. Test trigger has no production transport/persistence change and will be removed.
- Controlled table Category failure/retry PASS: warning/Retry renders, Category disabled, Locale enabled; real retry restores enabled Category.
- Explicit same-mounted Refine refetch PASS: temporary button directly invokes existing resource refresh; semantic URL/state unchanged. Runtime logs show provider `translationKeyStandardApi.getList` → POST `/api/v1/i18n/keys/query` → canonical response. One action increases POST count 6→7; subsequent table→card holds count 7→7. Initial/HMR paired requests are excluded from this measurement.
- Runtime search wire PASS: named provider emits POST body `search:{term:"auth"}` only; settled card result five keys.
- Removed all temporary Matrix A dev buttons, category-failure injection and provider/wire logging. Source diff is only pagination implementation + regression; docs preserve evidence. Final smoke follows cleanup.
- Native width resize PASS: keyboard ArrowRight changes Key 240→248px; header and first body cell both measure 248px, screenshot aligned; ArrowLeft restores 240px.
- Final clean smoke after removing instrumentation: auth restores five rows on reload; card→table works; no post-cleanup console errors, only existing logo.svg fill/static-parent warning. The earlier intermediate API-name runtime error remains documented separately and is resolved.
- Final automated state: typecheck PASS; focused suite 91/518 PASS; full suite 120/709 PASS; git diff --check PASS. Temporary resource files have no semantic diff. Test key ID 35 cleaned up; dataset 31.

#### Current closeout status after this continuation

| Gate | Result |
| --- | --- |
| Native width, horizontal utility pins, fullscreen, keyboard resize alignment | PASS |
| HRD row pointer/Enter/Space activation and nested Download non-duplication | PASS |
| Card flip explicit keyboard/narrow controls, focus transfer, inert/aria, lower actions, no overlap | PASS |
| Genuine mouse hover and touch/pen behavior | PENDING manual pointer verification; connected API lacks hover/touch/pen input |
| TranslationKey search Enter/Escape/hide-show/blur and HRD matched/no-match/clear counts | PASS; HRD footer defect fixed with regression |
| Selection/renderer smoke and safe deletion lifecycle | PASS |
| Controlled Category failure/retry in both renderers, Locale remains available | PASS |
| Explicit same-mounted Refine refetch and switch request count | PASS |
| Final console smoke | PASS; existing logo warning only |

Matrix A remains incomplete until genuine hover/touch checks are recorded. Matrix B and virtualization remain gated. Permanent change is bounded to correct client-side pagination totals/subscriptions; presentation/theme/resource architecture preserved.
- User confirms both remaining pointer checks: mouse hover reveals back face cleanly, and touch Show translations/Back to key works without hover. Recorded as USER-VERIFIED PASS (not automated pointer evidence). This supersedes the pending pointer gate above. Matrix A PASS; Matrix B promoted to current.

### October 13 — Matrix B profiling run

Environment: Windows / Codex in-app browser / development React Profiler, viewport 1101×884; same tested pagination-fix working tree on baseline b2a2950. No Jest process active during profiling. Mount is maximum duration in the clean two-commit mount/reset sample (second commit is a small update). Sequence: selection, expansion, two Name sorts, repeated three times; DOM counts include final expanded detail row. These development measurements are comparative, not production thresholds.

| Rows | Columns | Mode | Clean mount max ms | Final last ms | Avg ms | Max ms | DOM rows/cells/cards |
| ---: | ---: | --- | ---: | ---: | ---: | ---: | --- |
| 25 | 8 | Table | 123.80 | 96.20 | 118.04 | 296.70 | 26 / 201 / 0 |

25×8 table interactions settled without timeout; selection commits cost 202–297ms, sort/expand ~96–116ms. Vertical scrollTop 550 and horizontal scrollLeft 123 reached using actual scroll input; pinned Name/Status present. Additional cases pending; no virtualization decision yet.
| 25 | 8 | Card | 119.50 | 141.90 | 80.31 | 166.20 | 0 / 0 / 25 |

25-row card: three cycles complete without timeout, vertical scrolling works. Cards remain separate/readable. Measurement contains mount and update commits; no network request is involved in this synthetic fixture.
| 100 | 16 | Table | 845.50 | 876.00 | 831.78 | 1511.40 | 101 / 1601 / 0 |

100×16 table: three cycles finish, but normal sort/expansion actual durations ~878–1101ms; selection largest commit reflected in aggregate max 1511.40ms. Material development-mode renderer cost observed (not request latency). Scroll input reaches top 884px / left 1086px. Need card/200 comparison and actual resource density context before decision.
| 100 | 16 | Card | 423.50 | 242.70 | 256.42 | 434.40 | 0 / 0 / 100 |

100-card updates are materially cheaper than 100×16 table updates; three cycles and scrolling complete. This isolates a substantial dense-cell cost from the shared query/data layer.
| 200 | 16 | Table | 1575.90 | 1203.20 | 1166.43 | 1709.70 | 201 / 3201 / 0 |

200×16 table: three cycles complete but ~1.17s average actual duration indicates visible interaction stalls in development. Scroll input still reaches top 884px / left 1086px; no scroll-triggered remount expected. Card comparison pending.
| 200 | 16 | Card | 680.10 | 751.80 | 520.15 | 751.80 | 0 / 0 / 200 |

200-card three cycles complete, updates materially slower than 25/100 cards. Changing to 500 cards timed out one key-dispatch tool call but did apply (fresh DOM confirms 500); transition excluded from clean samples. Stress measurements follow in table mode.
| 500 | 16 | Table stress | 4090.40 | 3037.30 | 2701.14 | 4090.40 | 501 / 8001 / 0 |

500-row stress: all twelve interaction dispatches time out at browser-control deadline, but each settled observation shows commit progression (4→15) and applied interactions; no retry duplicates. Sort/expansion commits ~2907–3123ms. This corroborates scaling cost, not a standalone virtualization justification.
| 1000 | 32 | Table stress mount | 15839.40 | 64.30 | 7951.85 | 15839.40 | 1000 / 32000 / 0 |

1000×32 clean mount produces 32,000 cells and takes 15.84s. First selection attempt exceeded input deadline and subsequent observation timed out while renderer busy. Interaction sequence incomplete at this point; no invented interaction sample. This case is stress-only and cannot justify virtualization alone.
| 100 | 8 | Table diagnostic | 521.80 | 335.70 | 356.67 | 544.40 | 101 / 801 / 0 |

Additional realistic-width diagnostic: 100×8 still shows ~357ms average and ~544ms maximum. Current resources default to 25 rows; their page-size UI permits 100/200, so these densities are reachable, although current TranslationKey data has only 31 keys and Document fixture 60. This is density evidence from synthetic local renderer, not proof from 100 real backend records.

1000×32 interaction protocol: stopped after first selection because renderer stalls repeatedly exceed input/observation deadlines; settled count 4 commits confirms selection applied. Complete three-cycle stress sample NOT CLAIMED. Controls recovered when reducing to 100 rows. Treat stress interaction completion as BLOCKED by observed renderer cost, not missing result/transport failure.
| 200 | 8 | Table diagnostic | 863.60 | 966.40 | 769.67 | 1032.50 | 201 / 1601 / 0 |

200×8 realistic-width diagnostic: three interaction cycles, average 769.67ms / max 1032.50ms. Scroll reaches top884/left123. This confirms costs at eight-column density and supports conditional architecture investigation at reachable page sizes, not only 32-column stress.

### October 13 — Matrix B decision record

The required realistic 25/100/200 table/card density samples and the 500-row stress sample are recorded above; the 1000×32 mount is measured but full interaction cycles are BLOCKED by repeated renderer/input-observation deadline overruns. No error/warning console entries on the performance fixture. Returned fixture to 25×8 Table after measurement.

Decision: proceed to conditional 2.2.3 architecture review. Eight-column diagnostics still show 356.67ms average at 100 and 769.67ms at 200, so unconditional deferral based on responsive normal densities is not supported. Development-only timing, one-machine scope, no frame/FPS recording, current small real datasets, separate scroll sweeps (not three per-cycle frame traces), and incomplete 1000-row stress protocol remain explicit limitations. Production/profiling-build verification and rerender diagnosis gate any implementation. Design is documented in `docs/datatable-virtualization-2-2-3.md`; PR #31 remains separate.

### October 13 — 2.2.3.1 rerender diagnosis

Baseline fetched master ddb1459 (PR #40); branch codex/datatable-rerender-diagnosis. Added opt-in committed-output counters and timed display row-model retrieval in development fixture. Initial 100×8 single selection: owner 1/body 1, all row IDs 1–100 committed once, all 800 cells committed once (8 per row); synchronous dispatch 6.7ms, display-model read rounded 0ms. Narrow owner selector remains an experimental fixture-only comparison, not a production optimization. Raw React render invocation counts are not used as commit counts; Strict Mode mount replay is excluded from action windows.
- 100×8 default single actions: selection owner/body 1/1, 100 rows/800 cells, React actual total417.8ms; expansion 100/800,300.7ms; sorting100/800,402.5ms; filtering to Record0001 only1row/8cells,35.5ms. Model/display reads0–1.2ms; synchronous dispatch3.4–4.9ms. Timings are instrumented development samples, not production latency or independently additive intervals.
- Narrow-owner fixture probe: selection owner/body0/0 but still100 rows/800 cells,401.5ms. Expansion/sorting still100/800,269.1/405.4ms. Owner subscription alone is not sufficient; all-row selection subscription remains an investigation target. No production selector optimization applied.
- 200×16 default actions: selection/expansion/sorting each commits row IDs1–200 once and16cells perrow (3200 total). React actual totals2242.4/2346.6/2171.4ms; measured model-display reads0.1/0.4/0.7ms; dispatch28.2/19.7/21.5ms. Filtering to Record0001 commits1row/16cells,274.3ms. Instrumentation adds overhead; comparison against prior uninstrumented baseline is not valid.
- 100×8 narrow-owner + row-specific selection diagnostic probe: selection commits only ID1 and8cells,28.1ms; owner/body0/0. Expansion/sorting still commit100rows/800cells. This is experimental fixture behavior, not a production optimization. Follow-up repeats will check stability.
- Repeated100×8 selection comparison after typecheck finished, no Jest active: narrow owner + whole-selection rowsubscription100rows/800cells each time,735.0/486.3/766.6ms. Narrow owner + row-specific projection1row/8cells,17.9/10.7/15.5ms. Owner/body0/0 and model reads0 in both modes. This confirms subscription fan-out causally in the fixture; no production optimization enabled.
-25×8 default selection/expansion/sorting each commits all25rows/200cells. Filtering to Record0001 commits1row/8cells. Detailed evidence, instrumentation boundaries, affected identities, and next-step constraints are in docs/datatable-rerender-diagnosis-2-2-3-1.md.
- Diagnostic controls restored to defaults/disabled after browser work; fixture console has no warnings/errors. Typecheck PASS. Focused suite93/522 PASS. Concurrent full run121/122 suites passed,712/713 tests passed; one HRD filtered-numbering test timed out at5s. Full serial rerun started to establish final result; no timeout limit changed.
- Final validation: focused93suites/522tests PASS; full serial rerun122suites/713tests PASS (151.494s), resolving the concurrent-run HRD timeout without changing timeout settings or HRD code. Typecheck and whitespace PASS. Browser verifies disabling diagnostics resets both subscription experiments and disables their buttons; clean console. Default resource behavior unchanged.2.2.3.1 diagnosis complete;2.2.3.2 production-equivalent profiling is next, virtualization remains unapproved.
