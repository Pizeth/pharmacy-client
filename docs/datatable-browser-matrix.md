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

**Status: IN PROGRESS — card/filter/sort and visual-parity fixes landed; browser recheck and remaining acceptance gates still required (2026-09-29)**

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
| Named TranslationKey Refine provider handles list query | BLOCKED | BLOCKED | A-OBS: source wiring confirmed; runtime provider invocation not instrumented. |
| POST /api/v1/i18n/keys/query remains the network wire contract | BLOCKED | BLOCKED | A-OBS: source uses POST; no browser network capture available. |
| Refine query does not send global-search field names over HTTP | BLOCKED | BLOCKED | A-OBS: do not substitute source inspection for captured request bodies. |
| Table/card toolbar toggle works | PASS | PASS | Both directions using keyboard Enter. Pointer automation was unreliable; see attempt log. |
| Switching view does not reset page | PASS | PASS | Page 2, 26–31 of 31, retained on card-to-table switch. |
| Switching view does not reset global search | PASS | PASS | `auth` yields five keys before/after switching. |
| Switching view does not reset column filters | PASS | PASS | Key contains `email`: same two keys; category/locale combination also retained. |
| Switching view preserves row selection | PASS | PASS | Row 8 stays selected across both directions. |
| Selection-driven row pinning remains safe | PARTIAL | PARTIAL | No errors/duplicates observed; non-first-row sticky behavior during scrolling still needs focused verification. |
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
| Page-size change works | PARTIAL | PASS | Card changed 25 to 10; size 10 retained in table. Independent table change pending. |
| Global search works | PASS | PASS | `auth` returns five keys; test-key prefix returns isolated CRUD rows. |
| Key filter works | PASS | PENDING RECHECK | `email` passed in table. Generic card filter surface landed in `9c01a2c`; rerun in card view. |
| Description filter works | PASS | PENDING RECHECK | `Password field` passed in table. Generic card filter surface landed in `9c01a2c`; rerun in card view. |
| Category filter works | PASS | PENDING RECHECK | `auth` passed in table. Generic card filter surface landed in `9c01a2c`; rerun in card view. |
| Locale filter works | PARTIAL | PENDING RECHECK | English serialization passed; exclusion case remains. Generic card filter surface landed in `9c01a2c`; rerun both inclusion/exclusion in card view. |
| Sort changes work | PASS | PENDING RECHECK | Table Key descending passed. Generic card sorting menu landed in `9c01a2c`; rerun ascending/descending/clear in card view. |
| Density control | PASS | PASS | Spacious selected in table, Compact in card; card tooltip confirms Compact. |
| Fullscreen enter/exit | PASS | PASS | Enter and Exit control states verified in each renderer. |
| Saved display preference restores after reload | PASS | PASS | Each display restored on its own reload. |
| Saved density/column preferences still restore | PASS | PARTIAL | Spacious active after reload; Key pin-to-start survives table reload, then restored. Card column preference round-trip not independently checked. |
| Shareable semantic query URL survives reload | PASS | PASS | Category 2, locale en, Key desc and size 25 restore five auth records. |
| Browser back/forward restores semantic query | BLOCKED | BLOCKED | A-RATE: URLs restore, but backend throttling interrupted result verification. Default history mode is replace, so each local edit is not a new history entry. |
| No new console errors | PARTIAL | PARTIAL | No DataTable React error observed so far; rate-limit request failures recorded separately. Final capture pending. |

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
| View switch does not issue another Refine list request | BLOCKED — A-OBS: fixture getList invocation count is not exposed. |
| Search state survives view switch | PASS — Budget returns ten matching records in both renderers. |
| Pagination state survives view switch | PASS — 26–50 of 60 retained across both switches. |
| Refresh still issues exactly the expected Refine refetch | BLOCKED — Refresh completes with same ten Budget rows; exact invocation count unverified (A-OBS). |
| Card content matches current row data | PASS — DOC-0026 through DOC-0050 match title/description/status/days/enabled/date fixture values. |
| No new console errors | PASS — no errors in captured log; shared logo positioning warning only. |

This matrix proves that card/table presentation is independent from whether the
resource uses the Standard API adapter or the Refine adapter.

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
| Expanded TranslationValue Add/Edit/Delete controls remain visible at desktop width | PENDING RECHECK | PENDING RECHECK | Detail layout is now intrinsic-width/two-column rather than viewport-breakpoint dependent. |
| Row action footer remains visible when card detail is expanded | N/A | PENDING RECHECK | Generic card renderer now places actions before expanded detail content. |
| Card visual hierarchy matches application neumorphic language | N/A | PENDING RECHECK | Card/detail surfaces now use dedicated `customShadows.dataTableCard` / `customShadows.dataTableInset` tokens so dark mode can stay crisp without changing global neumorphism. Verify light and dark schemes. |
| Column filters use compact filled presentation | PENDING RECHECK | PENDING RECHECK | DataTable filter component families use `variant="filled"`, `margin="none"`, `size="small"`; filled roots now use a compact 5px radius rather than application-form pill geometry. |
| Expansion header has no visible "Details" text | PENDING RECHECK | N/A | TranslationKey uses a 44px disabled double-chevron expand-all affordance while preserving per-row expansion. |
| Narrow/mobile TranslationValue actions remain usable | PENDING RECHECK | PENDING RECHECK | Recheck the prior mobile behavior after removing viewport-dependent action placement. |
| TranslationValue detail panel consumes the complete expanded table row | PENDING RECHECK | N/A | Removed the resource-level 960px width cap; the generic detail row/cell already spans all visible columns. |
| Existing CRUD/filter/sort/persistence behavior remains intact | PENDING RECHECK | PENDING RECHECK | No semantic query, Refine, transport, persistence, or server-state code changed in this follow-up. |

Do not start Matrix B from automated CI alone. Complete the pending Matrix A
browser rows above together with the previously pending card filter/sort,
selection pinning, page-size, saved visual preference, paced history, runtime
request-observability and final console checks.
