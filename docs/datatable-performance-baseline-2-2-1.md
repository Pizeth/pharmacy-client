# DataTable 2.2.1 — performance baseline

> Living browser acceptance status is tracked in
> `docs/datatable-browser-matrix.md`. Update that file after each completed
> matrix so the next Codex/ChatGPT session can continue from the recorded gate.

Phase 2.2 is evidence-driven. This checkpoint deliberately adds **no
virtualization**.

The purpose is to establish a repeatable browser fixture for measuring the
existing TanStack v9 + MUI renderer before deciding whether row/column
virtualization is justified.

## Development fixture

Start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:8080/dev/datatable/performance
```

The route is development-only and returns `notFound()` outside development.

## Controlled dimensions

The fixture can vary:

- rows: 25, 100, 200, 500, 1000,
- columns: 8, 16, 32,
- presentation: table or card.

The table case keeps the first and last data columns pinned and renders all
configured rows on one TanStack page. This intentionally exposes the cost of
the current non-virtualized DOM rather than hiding it behind server pagination.

The card case uses the same table instance/row model and establishes a separate
baseline for the card presentation boundary.

## Measurements

A React `Profiler` records:

- commit count,
- last actual duration,
- average actual duration,
- maximum actual duration,
- last base duration.

The fixture also reports rendered DOM row/cell counts.

There are intentionally **no CI timing thresholds**. React development mode,
browser extensions, hardware, thermal state and background tasks can materially
change timings. Performance numbers are useful only as comparative evidence
under the same environment.

## Repeatable manual protocol

For each candidate size:

1. choose the row/column count,
2. choose table presentation,
3. click **Reset measurement**,
4. record the clean mount sample,
5. toggle first-row selection,
6. toggle first-row expansion,
7. toggle Name sort twice,
8. horizontally and vertically scroll the viewport,
9. repeat the same sequence three times,
10. record last/average/max duration and DOM row/cell count.

Repeat the relevant sizes in card presentation.

Recommended first matrix:

| Rows | Columns | Table | Card |
| ---: | ---: | :---: | :---: |
| 25 | 8 | yes | yes |
| 100 | 16 | yes | yes |
| 200 | 16 | yes | yes |
| 500 | 16 | yes | optional stress |
| 1000 | 32 | stress | optional stress |

## Decision rule

Do not add virtualization merely because a high synthetic stress case is
expensive.

Virtualization becomes justified only when profiling shows a material,
user-visible renderer bottleneck at a row/column density that a real resource
is expected to render.

In particular, server-backed resources which normally render a bounded page
should not inherit virtualization complexity without evidence.

If virtualization is justified, the follow-up implementation must preserve:

- sticky headers,
- logical start/end column pinning,
- row pinning,
- selection,
- expansion/detail panels,
- keyboard accessibility,
- RTL,
- density,
- card/table presentation boundaries.

This fixture remains the before/after comparison surface for that work.
