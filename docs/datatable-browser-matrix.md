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

**Status: READY AFTER CI**

Purpose:

Verify that the production TranslationKey resource and the Refine-backed
Document proof both exercise the shared table/card presentation architecture
before performance measurements begin.

### Environment

Record before running:

- Date:
- Commit SHA:
- Browser:
- Browser version:
- OS:
- Viewport:
- Development command: `npm run dev`
- API/backend commit if TranslationKey uses a local backend:

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
| Initial rows load | ☐ | ☐ | |
| Named TranslationKey Refine provider handles list query | ☐ | ☐ | |
| POST /api/v1/i18n/keys/query remains the network wire contract | ☐ | ☐ | |
| Refine query does not send global-search field names over HTTP | ☐ | ☐ | |
| Table/card toolbar toggle works | ☐ | ☐ | |
| Switching view does not reset page | ☐ | ☐ | |
| Switching view does not reset global search | ☐ | ☐ | |
| Switching view does not reset column filters | ☐ | ☐ | |
| Switching view preserves row selection | ☐ | ☐ | |
| Selection-driven row pinning remains safe | ☐ | ☐ | |
| Edit row action honors selected-row policy | ☐ | ☐ | |
| Delete row action honors selected-row policy | ☐ | ☐ | |
| Expand/collapse translation details | ☐ | ☐ | |
| TranslationValue create | ☐ | ☐ | |
| TranslationValue edit | ☐ | ☐ | |
| TranslationValue delete | ☐ | ☐ | |
| TranslationKey create | ☐ | ☐ | |
| TranslationKey edit | ☐ | ☐ | |
| TranslationKey delete | ☐ | ☐ | |
| Pagination works | ☐ | ☐ | |
| Page-size change works | ☐ | ☐ | |
| Global search works | ☐ | ☐ | |
| Key filter works | ☐ | ☐ | |
| Description filter works | ☐ | ☐ | |
| Category filter works | ☐ | ☐ | |
| Locale filter works | ☐ | ☐ | |
| Sort changes work | ☐ | ☐ | |
| Density control | ☐ | ☐ | |
| Fullscreen enter/exit | ☐ | ☐ | |
| Saved display preference restores after reload | ☐ | ☐ | |
| Saved density/column preferences still restore | ☐ | ☐ | |
| Shareable semantic query URL survives reload | ☐ | ☐ | |
| Browser back/forward restores semantic query | ☐ | ☐ | |
| No new console errors | ☐ | ☐ | |

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
| Initial Refine list load | ☐ |
| Switch table -> card from toolbar | ☐ |
| Switch card -> table from toolbar | ☐ |
| View switch does not issue another Refine list request | ☐ |
| Search state survives view switch | ☐ |
| Pagination state survives view switch | ☐ |
| Refresh still issues exactly the expected Refine refetch | ☐ |
| Card content matches current row data | ☐ |
| No new console errors | ☐ |

This matrix proves that card/table presentation is independent from whether the
resource uses the Standard API adapter or the Refine adapter.

### Matrix A completion record

Fill this only after every required item passes.

- Status: ☐ PASS / ☐ BLOCKED
- Completed date:
- Commit SHA:
- Notes:

When Matrix A passes, promote **Matrix B** below to current.

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
