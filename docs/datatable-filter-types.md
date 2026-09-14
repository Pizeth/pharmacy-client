# Phase 1.7.10.6B.1 — Neutral filter prop contracts

All five leaf filter prop interfaces now live in
`src/components/DataTable/mui/components/filtering/types.ts`:

- `DataTableTextFilterProps`
- `DataTableSelectFilterProps`
- `DataTableBooleanFilterProps`
- `DataTableNumberFilterProps`
- `DataTableNumberRangeFilterProps`

Each component imports its interface directly from `./types`. The theme contract
in `mui/theme/types.ts` imports directly from `../components/filtering/types`
instead of the component barrel. This removes the theme's dependency on leaf
component implementations for these contracts.

Existing component-module type imports still work through type-only re-exports:

```ts
import type { DataTableTextFilterProps } from "./types";
export type { DataTableTextFilterProps } from "./types";
```

The filtering barrel already exports `./types`, so public barrel imports keep
working as well. Each interface retains its existing value, label, size, options
where applicable, and callback signatures verbatim. Rendering, styling, and
filter behavior are unchanged. Disabled/loading props and structural theme slots
belong to the subsequent 6B steps.

The 6A walkthrough is a historical source snapshot; use `filtering/types.ts` for
the current interface definitions.
