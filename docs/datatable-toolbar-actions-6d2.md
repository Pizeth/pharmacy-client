# Phase 1.7.10.6D.2 — Toolbar actions and filter-status slots

## Implemented contract

Seven more named slots join `RazethDataTable`. Every slot has a stable utility class and an explicit `overridesResolver`; the existing registry-derived `DataTableSlotKey` supplies theme augmentation typing automatically.

| Slot | Surface |
| --- | --- |
| toolbarActions | Internal action group |
| toolbarFilterStatus | Active column-filter chip and clear-all action |
| searchToggleButton | Collapsible global-search trigger |
| filterToggleButton | Subheader filter-row trigger |
| densityButton | Density menu trigger |
| fullscreenButton | Fullscreen toggle |
| columnManagerButton | Column-manager dialog trigger |

This remains one structural component family. No new leaf theme families or resource-specific state are introduced. The intentional `error.main` header label accent from the prior correction is unchanged.

## Behavior and presentation

The action group and status chip move `flexShrink: 0` into their styled slots. Trigger focus outlines move from permanent `sx` into their named slots. Focus styling supports both `:focus-visible` and MUI's `.Mui-focusVisible`. Density now shares the explicit focus treatment of the other toolbar buttons.

The manager trigger previously used the legacy `DataTable-columnMenuButton` class. It now has `RazethDataTable-columnManagerButton`, distinct from the per-column header menu trigger. Consumers targeting the old manager class should update their selector or use `styleOverrides.columnManagerButton`.

Existing small-size props, tooltip labels, badges, counts, event callbacks, ARIA attributes, action order, and provider boundaries are preserved. The filters chip remains absent when no column filters are active. Both clicking it and its delete action call `table.setColumnFilters([])`, which also clears stale column IDs. Global search is a separate state slice and remains unchanged.

Search and filter toggles change visibility only. Density and fullscreen remain presentation-provider state. Menu/dialog anchors remain local ephemeral state. No new effects or duplicate TanStack state were added.

The density menu contents, column-manager dialog internals, selection summary, and pagination are outside this step. The unused legacy visibility-button file was not migrated. This phase adds trigger slots, not an entire dialog/menu styling contract.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbarActions: { paddingInlineStart: 4 },
        toolbarFilterStatus: { fontWeight: 600 },
        searchToggleButton: { borderRadius: 6 },
        filterToggleButton: {
          '&[aria-expanded="true"]': { backgroundColor: '#e3f2fd' },
        },
        densityButton: { borderRadius: 6 },
        fullscreenButton: {
          '&[aria-pressed="true"]': { backgroundColor: '#e3f2fd' },
        },
        columnManagerButton: { borderRadius: 6 },
      },
    },
  },
});
```

Use the existing ARIA state attributes when customizing expanded/pressed states. They already reflect the real interaction state and do not need a second state prop. Badge and delete-icon styling can be scoped through the owning slot's descendant selectors if required.

## Complete source

### src/components/DataTable/mui/styles/dataTableClasses.ts

```ts
import { generateUtilityClass, generateUtilityClasses } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME } from "./constants";

/**
 * ------------------------------------------------------------------
 * RazethDataTable utility-class registry
 * ------------------------------------------------------------------
 *
 * Slots are registered incrementally as renderer surfaces migrate to
 * the structural MUI theme architecture.
 *
 * Do NOT pre-register every possible DataTable element.
 *
 * A renderer surface joins this registry when it is actively migrated
 * to:
 *
 *   styled(..., {
 *     name: DATA_TABLE_COMPONENT_NAME,
 *     slot: "...",
 *   })
 *
 * This keeps:
 *
 * - utility classes
 * - styleOverrides keys
 * - renderer implementation
 *
 * synchronized.
 */
export const dataTableClasses = generateUtilityClasses(
  DATA_TABLE_COMPONENT_NAME,
  [
    /**
     * ============================================================
     * Global filtering
     * ============================================================
     */
    "globalFilter",

    /**
     * Utility/state classes.
     *
     * These are NOT named styled slots and therefore are excluded
     * from DataTableSlotKey below.
     */
    "globalFilterFullWidth",
    "globalFilterClearButton",

    /**
     * ============================================================
     * Filter structure
     * ============================================================
     */
    "filterRow",
    "filterCell",
    "filterIndicator",

    /**
     * ============================================================
     * Header structure
     * ============================================================
     *
     * Phase 1.7.10.6C begins the migration of the physical header
     * renderer to the same slot-based architecture already used by
     * the filter row.
     */

    /**
     * One physical TanStack header-group row.
     *
     * Future styled slot:
     *
     *   slot: "HeaderRow"
     */
    "toolbarSearch",
    "toolbar",
    "toolbarActions",
    "toolbarFilterStatus",
    "searchToggleButton",
    "filterToggleButton",
    "densityButton",
    "fullscreenButton",
    "columnManagerButton",

    "toolbarRow",
    "toolbarStart",
    "toolbarCenter",
    "toolbarEnd",
    "toolbarSearchRow",
    "head",
    "headerRow",

    /**
     * One physical MUI TableCell representing either:
     *
     * - a real header
     * - a TanStack placeholder header
     *
     * Future styled slot:
     *
     *   slot: "HeaderCell"
     */
    "headerCell",

    /**
     * Width-owning content wrapper immediately inside HeaderCell.
     *
     * It separates:
     *
     *   physical cell geometry
     *
     * from:
     *
     *   semantic/interactable header layout
     *
     * Future styled slot:
     *
     *   slot: "HeaderCellContent"
     */
    "headerCellContent",

    /**
     * Semantic layout surface rendered by DataTableHeaderContent.
     *
     * For centered headers this owns the frozen:
     *
     *   1fr | label | 1fr
     *
     * layout contract.
     *
     * Future styled slot:
     *
     *   slot: "HeaderContent"
     */
    "headerContent",

    /**
     * Group-header label surface.
     *
     * Future styled slot:
     *
     *   slot: "HeaderGroupLabel"
     */
    "headerGroupLabel",

    /**
     * Exact centered-label track used by the symmetric header grid.
     *
     * Sort/filter/menu controls do NOT participate in this track's
     * intrinsic width.
     *
     * Future styled slot:
     *
     *   slot: "HeaderLabelTrack"
     */
    "headerLabelTrack",

    /**
     * Trailing header affordance region containing controls such as:
     *
     * - sort indicator
     * - active-filter indicator
     * - column menu
     *
     * Future styled slot:
     *
     *   slot: "HeaderActions"
     */
    "headerActions",
    "headerLabel",
    "sortLabel",
    "sortIndicator",
    "sortButton",
    "sortIcon",
    "sortIndex",
    "columnMenuButton",
    "resizeHandle",
  ],
);

/**
 * Every generated utility class.
 *
 * This includes:
 *
 * - named styled slots
 * - state/utility classes
 */
export type DataTableClassKey = keyof typeof dataTableClasses;

/**
 * Utility classes that are NOT direct named styled slots.
 *
 * They may still be useful for state/selectors, but they do not map to:
 *
 *   theme.components.RazethDataTable.styleOverrides.<key>
 */
export type DataTableNonSlotClassKey =
  | "globalFilterFullWidth"
  | "globalFilterClearButton";

/**
 * Named structural slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 *
 * Examples after 6C:
 *
 *   styleOverrides: {
 *     headerCell: { ... },
 *     headerContent: { ... },
 *     headerActions: { ... },
 *     filterCell: { ... },
 *   }
 */
export type DataTableSlotKey = Exclude<
  DataTableClassKey,
  DataTableNonSlotClassKey
>;

/**
 * Generate one stable RazethDataTable utility class.
 *
 * Example:
 *
 *   getDataTableUtilityClass(
 *     "headerCell",
 *   )
 *
 * produces:
 *
 *   RazethDataTable-headerCell
 */
export function getDataTableUtilityClass(slot: DataTableClassKey): string {
  return generateUtilityClass(DATA_TABLE_COMPONENT_NAME, slot);
}
```

### src/components/DataTable/mui/components/toolbar/DataTableToolbarActions.tsx

```tsx
"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

// src/components/DataTable/mui/components/toolbar/DataTableToolbarActions.tsx

import { Stack, styled } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import { DataTableColumnManagerButton } from "../column-manager";
import type { DataTableColumnManagerConfig } from "../column-manager";
import type { MuiDataTableInstance } from "../../table";
import {
  DataTableDensityButton,
  DataTableFilterToggleButton,
  DataTableFullscreenButton,
} from "./actions";

const ToolbarActionsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarActions",
  overridesResolver: (_props, styles) => styles.toolbarActions,
})({ flexShrink: 0 });

export interface DataTableToolbarActionsProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly enableFilterToggle: boolean;
  readonly enableColumnManager: boolean;
  readonly columnManager?: DataTableColumnManagerConfig;
  readonly enableDensity: boolean;
  readonly enableFullscreen: boolean;
}

/**
 * Standard DataTable-internal toolbar actions.
 *
 * Search visibility is intentionally handled by DataTableToolbar
 * itself because the search button and search input form one
 * presentation feature.
 */
export function DataTableToolbarActions<TData extends RowData>(
  props: DataTableToolbarActionsProps<TData>,
) {
  const {
    table,
    enableFilterToggle,
    enableColumnManager,
    columnManager,
    enableDensity,
    enableFullscreen,
  } = props;

  return (
    <ToolbarActionsRoot
      className={dataTableClasses.toolbarActions}
      direction="row"
      alignItems="center"
      spacing={0.25}
    >
      {enableFilterToggle && (
        <DataTableFilterToggleButton<TData> table={table} />
      )}

      {enableColumnManager && (
        <DataTableColumnManagerButton table={table} {...columnManager} />
      )}

      {enableDensity && <DataTableDensityButton />}

      {enableFullscreen && <DataTableFullscreenButton />}
    </ToolbarActionsRoot>
  );
}
```

### src/components/DataTable/mui/components/toolbar/DataTableToolbarFilterStatus.tsx

```tsx
// src/components/DataTable/mui/components/toolbar/DataTableToolbarFilterStatus.tsx

"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { Chip, styled } from "@mui/material";
import { FilterAltOffOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

const ToolbarFilterStatusRoot = styled(Chip, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarFilterStatus",
  overridesResolver: (_props, styles) => styles.toolbarFilterStatus,
})({ flexShrink: 0 });

export interface DataTableToolbarFilterStatusProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Compact status surface for active column filters.
 *
 * This does not include global search because globalFilter is a
 * separate TanStack state slice with its own UI.
 */
export function DataTableToolbarFilterStatus<TData extends RowData>(
  props: DataTableToolbarFilterStatusProps<TData>,
) {
  const { table } = props;

  return (
    <table.Subscribe selector={(state) => state.columnFilters}>
      {(columnFilters) => {
        const activeCount = columnFilters.length;

        if (activeCount === 0) {
          return null;
        }

        const clearFilters = (): void => {
          // One update clears even stale column IDs without changing search.
          table.setColumnFilters([]);
        };

        return (
          <ToolbarFilterStatusRoot
            className={dataTableClasses.toolbarFilterStatus}
            size="small"
            variant="outlined"
            label={activeCount === 1 ? "1 filter" : `${activeCount} filters`}
            aria-label={`Clear all column filters (${activeCount} active)`}
            onClick={clearFilters}
            deleteIcon={<FilterAltOffOutlined fontSize="small" />}
            onDelete={clearFilters}
          />
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/toolbar/actions/DataTableSearchToggleButton.tsx

```tsx
// src/components/DataTable/mui/components/toolbar/actions/DataTableSearchToggleButton.tsx

"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../../styles";

import { styled, Badge, IconButton, Tooltip } from "@mui/material";
import { SearchOffOutlined, SearchOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../../table";
import { normalizeDataTableGlobalFilter } from "../../../utils/globalFilter";
import { useDataTableAccessibility } from "../../../accessibility";

const SearchToggleButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SearchToggleButton",
  overridesResolver: (_props, styles) => styles.searchToggleButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export interface DataTableSearchToggleButtonProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly open: boolean;
  readonly onToggle: () => void;
}

/**
 * Toggles only the visibility of the global-search control.
 *
 * Existing globalFilter state remains active when the input is hidden.
 */
export function DataTableSearchToggleButton<TData extends RowData>(
  props: DataTableSearchToggleButtonProps<TData>,
) {
  const { table, open, onToggle } = props;

  const { globalSearchId } = useDataTableAccessibility();

  return (
    <table.Subscribe selector={(state) => state.globalFilter}>
      {(globalFilter) => {
        const normalizedFilter = normalizeDataTableGlobalFilter(globalFilter);

        const active = normalizedFilter.length > 0;

        return (
          <Tooltip title={open ? "Hide search" : "Show search"}>
            <SearchToggleButtonRoot
              className={dataTableClasses.searchToggleButton}
              size="small"
              aria-label={open ? "Hide global search" : "Show global search"}
              //   aria-expanded={open}
              //   aria-pressed={open}
              aria-expanded={open}
              aria-controls={open ? globalSearchId : undefined}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                onToggle();
              }}
            >
              <Badge color="primary" variant="dot" invisible={!active}>
                {open ? (
                  <SearchOffOutlined fontSize="small" />
                ) : (
                  <SearchOutlined fontSize="small" />
                )}
              </Badge>
            </SearchToggleButtonRoot>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/toolbar/actions/DataTableFilterToggleButton.tsx

```tsx
"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../../styles";

// src/components/DataTable/mui/components/toolbar/actions/DataTableFilterToggleButton.tsx

import { styled, Badge, IconButton, Tooltip } from "@mui/material";
import { FilterAltOutlined, FilterListOffOutlined } from "@mui/icons-material";
import { useDataTableFilterDisplay } from "../../../filter-display";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../../table";
import { useDataTableAccessibility } from "../../../accessibility";

const FilterToggleButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterToggleButton",
  overridesResolver: (_props, styles) => styles.filterToggleButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export interface DataTableFilterToggleButtonProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Shows/hides the subheader filter row.
 *
 * This button changes presentation only.
 *
 * Existing TanStack columnFilters remain active when the row is hidden.
 */
export function DataTableFilterToggleButton<TData extends RowData>(
  props: DataTableFilterToggleButtonProps<TData>,
) {
  const { table } = props;

  const { filterRowId } = useDataTableAccessibility();

  const { columnFilterDisplayMode, showColumnFilters, toggleColumnFilters } =
    useDataTableFilterDisplay();

  /**
   * A row toggle is only meaningful in subheader mode.
   */
  if (columnFilterDisplayMode !== "subheader") {
    return null;
  }

  return (
    <table.Subscribe selector={(state) => state.columnFilters}>
      {(columnFilters) => {
        const activeFilterCount = columnFilters.length;

        const Icon = showColumnFilters
          ? FilterListOffOutlined
          : FilterAltOutlined;

        return (
          <Tooltip title={showColumnFilters ? "Hide filters" : "Show filters"}>
            <FilterToggleButtonRoot
              className={dataTableClasses.filterToggleButton}
              size="small"
              aria-label={
                showColumnFilters
                  ? "Hide column filters"
                  : "Show column filters"
              }
              //   aria-pressed={showColumnFilters}
              aria-expanded={showColumnFilters}
              aria-controls={showColumnFilters ? filterRowId : undefined}
              onClick={toggleColumnFilters}
            >
              <Badge
                color="primary"
                badgeContent={activeFilterCount}
                invisible={activeFilterCount === 0}
                max={99}
              >
                <Icon fontSize="small" />
              </Badge>
            </FilterToggleButtonRoot>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/toolbar/actions/DataTableDensityButton.tsx

```tsx
"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../../styles";

// src/components/DataTable/mui/components/toolbar/actions/DataTableDensityButton.tsx

import {
  styled,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { DensityLarge, DensityMedium, DensitySmall } from "@mui/icons-material";
import { useState } from "react";
import type { MouseEvent } from "react";
import { useDataTableDensity } from "../../../density";
import type { MuiDataTableDensity } from "../../../density";

interface DensityOption {
  readonly value: MuiDataTableDensity;
  readonly label: string;
  readonly icon: typeof DensitySmall;
}

const DENSITY_OPTIONS: readonly DensityOption[] = [
  {
    value: "compact",
    label: "Compact",
    icon: DensitySmall,
  },

  {
    value: "comfortable",
    label: "Comfortable",
    icon: DensityMedium,
  },

  {
    value: "spacious",
    label: "Spacious",
    icon: DensityLarge,
  },
];

/**
 * Explicit three-option density selector.
 *
 * MRT cycles through densities using one button. We deliberately expose
 * a menu because the current state and destination are clearer to users.
 */
const DensityButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "DensityButton",
  overridesResolver: (_props, styles) => styles.densityButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export function DataTableDensityButton() {
  const { density, setDensity } = useDataTableDensity();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = anchorEl !== null;

  const currentOption =
    DENSITY_OPTIONS.find((option) => option.value === density) ??
    DENSITY_OPTIONS[1];

  const CurrentIcon = currentOption.icon;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={`Density: ${currentOption.label}`}>
        <DensityButtonRoot
          className={dataTableClasses.densityButton}
          size="small"
          aria-label="Change table density"
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          <CurrentIcon fontSize="small" />
        </DensityButtonRoot>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            dense: density === "compact",
            "aria-label": "Table density",
          },
        }}
        // MenuListProps={{
        //   dense: density === "compact",
        //   "aria-label": "Table density",
        // }}
      >
        {DENSITY_OPTIONS.map((option) => {
          const Icon = option.icon;

          const selected = option.value === density;

          return (
            <MenuItem
              key={option.value}
              selected={selected}
              onClick={() => {
                setDensity(option.value);

                handleClose();
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>

              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
```

### src/components/DataTable/mui/components/toolbar/actions/DataTableFullscreenButton.tsx

```tsx
"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../../styles";

// src/components/DataTable/mui/components/toolbar/actions/DataTableFullscreenButton.tsx

import { styled, IconButton, Tooltip } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { useDataTableFullscreen } from "../../../fullscreen";

const FullscreenButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FullscreenButton",
  overridesResolver: (_props, styles) => styles.fullscreenButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export function DataTableFullscreenButton() {
  const { fullscreen, toggleFullscreen } = useDataTableFullscreen();

  return (
    <Tooltip title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
      <FullscreenButtonRoot
        className={dataTableClasses.fullscreenButton}
        size="small"
        aria-label={
          fullscreen ? "Exit fullscreen table" : "Enter fullscreen table"
        }
        aria-pressed={fullscreen}
        onClick={toggleFullscreen}
      >
        {fullscreen ? (
          <FullscreenExit fontSize="small" />
        ) : (
          <Fullscreen fontSize="small" />
        )}
      </FullscreenButtonRoot>
    </Tooltip>
  );
}
```

### src/components/DataTable/mui/components/column-manager/DataTableColumnManagerButton.tsx

```tsx
// mui/components/column-manager/DataTableColumnManagerButton.tsx

"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { styled, IconButton, Tooltip } from "@mui/material";
import { ViewColumnOutlined } from "@mui/icons-material";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnManager } from "./DataTableColumnManager";
import type { DataTableColumnManagerConfig } from "./types";

const ColumnManagerButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ColumnManagerButton",
  overridesResolver: (_props, styles) => styles.columnManagerButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export interface DataTableColumnManagerButtonProps<
  TData extends RowData,
> extends DataTableColumnManagerConfig {
  readonly table: MuiDataTableInstance<TData>;
}

export function DataTableColumnManagerButton<TData extends RowData>(
  props: DataTableColumnManagerButtonProps<TData>,
) {
  const { table, ...managerConfig } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = anchorEl !== null;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Manage columns">
        <ColumnManagerButtonRoot
          className={dataTableClasses.columnManagerButton}
          size="small"
          aria-label="Manage table columns"
          aria-haspopup="dialog"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          <ViewColumnOutlined fontSize="small" />
        </ColumnManagerButtonRoot>
      </Tooltip>

      <DataTableColumnManager
        table={table}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        {...managerConfig}
      />
    </>
  );
}
```

### src/components/DataTable/mui/components/toolbar/toolbarActionsTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { DataTableDensityProvider } from "../../density";
import { DataTableFilterDisplayProvider } from "../../filter-display";
import { DataTableFullscreenProvider } from "../../fullscreen";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTableToolbar } from "./DataTableToolbar";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "alpha" }];
function Fixture() {
  const table = useMuiDataTable({
    columns,
    data,
    initialState: {
      globalFilter: "alpha",
      columnFilters: [{ id: "name", value: "alpha" }],
    },
  });
  return (
    <table.AppTable>
      <DataTableAccessibilityProvider>
        <DataTableDensityProvider>
          <DataTableFullscreenProvider>
            <DataTableFilterDisplayProvider defaultColumnFilterDisplayMode="subheader">
              <DataTableToolbar
                table={table}
                searchMode="collapsible"
                defaultSearchOpen
                showFilterStatus
                showSelectionSummary={false}
              />
            </DataTableFilterDisplayProvider>
          </DataTableFullscreenProvider>
        </DataTableDensityProvider>
      </DataTableAccessibilityProvider>
    </table.AppTable>
  );
}
const slots = [
  "toolbarActions",
  "toolbarFilterStatus",
  "searchToggleButton",
  "filterToggleButton",
  "densityButton",
  "fullscreenButton",
  "columnManagerButton",
] as const;
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbarActions: { backgroundColor: "rgb(10, 20, 30)" },
        toolbarFilterStatus: { backgroundColor: "rgb(10, 20, 30)" },
        searchToggleButton: { backgroundColor: "rgb(10, 20, 30)" },
        filterToggleButton: { backgroundColor: "rgb(10, 20, 30)" },
        densityButton: { backgroundColor: "rgb(10, 20, 30)" },
        fullscreenButton: { backgroundColor: "rgb(10, 20, 30)" },
        columnManagerButton: { backgroundColor: "rgb(10, 20, 30)" },
      },
    },
  },
});
function mount() {
  return render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
}
it("applies all action/status overrides through the structural family", () => {
  const { container } = mount();
  for (const slot of slots)
    expect(container.querySelector(`.${dataTableClasses[slot]}`)).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });
});
it("toggles filter presentation and clears filters without clearing search", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Show column filters" }));
  expect(
    screen.getByRole("button", { name: "Hide column filters" }),
  ).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByRole("button", { name: "Clear all column filters (1 active)" }),
  ).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Clear all column filters (1 active)" }),
  );
  expect(screen.queryByText("1 filter")).toBeNull();
  expect(screen.getByRole("textbox")).toHaveValue("alpha");
});
it("preserves fullscreen state and density selection", async () => {
  mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Enter fullscreen table" }),
  );
  expect(
    screen.getByRole("button", { name: "Exit fullscreen table" }),
  ).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "Change table density" }));
  fireEvent.click(await screen.findByRole("menuitem", { name: "Compact" }));
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  fireEvent.click(screen.getByRole("button", { name: "Change table density" }));
  expect(await screen.findByRole("menuitem", { name: "Compact" })).toHaveClass(
    "Mui-selected",
  );
});
it("opens the column manager through its dedicated trigger", async () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Manage table columns" }));
  expect(await screen.findByRole("dialog")).toBeVisible();
});
```

## Validation

- `npm run typecheck`: passed, including TanStack feature synchronization.
- `npm run test:datatable -- --runInBand`: **22 suites, 114 tests passed**.
- New integration tests exercise all seven theme overrides, filter visibility, clear-all while preserving the query, fullscreen state, density selection, and opening the column manager.
- Existing keyboard clear-all, stale-filter clearing, search visibility, header accent, sorting, resizing, and request-contract suites remain passing.
- Component review confirmed no new effects or duplicate table state and preserved accessible names/state attributes.

This phase has not been rerun in the live browser. Earlier live RTL/touch/pinned-scrolling gaps remain pending; provider-level fullscreen tests do not verify browser rendering or overlay positioning.

Next focused phase: **6D.3 — pagination structural theme slots**. Selection-summary styling and the complete 6D browser audit remain separately trackable before closing 6D.
