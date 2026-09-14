# Phase 1.7.10.6C.5 — Resize-handle theme migration

## Result

The resize handle now belongs to the `RazethDataTable` structural theme family. `resizeHandle` is registered as a stable utility class and a typed style-override slot. The component uses `styled("span", { name, slot, overridesResolver })`; permanent layout and state appearance no longer use `sx`.

No separate leaf component family is introduced. The existing class-derived `DataTableSlotKey` automatically exposes `theme.components.RazethDataTable.styleOverrides.resizeHandle`, so no augmentation edit is needed.

## Geometry and state ownership

- The absolute handle fills the header height, occupies an 8px hit target, and sits at logical inline-end with a -4px offset. It does not contribute width to the centered label grid.
- The visual line remains a 2px `::after` pseudo-element. It is not a separate public slot: the handle theme override can target `&::after`.
- The line now uses `insetInlineStart: "calc(50% - 1px)"`. The old logical 50% position plus physical `translateX(-50%)` shifted the RTL line away from the hit-target center. The logical calculation centers it in both directions.
- Active, hover, and focus colors use the theme primary color. Resting appearance uses the divider color and 0.65 opacity. Focus keeps the existing visible outline.
- `data-resizing` is derived from `column.getIsResizing()`. It is not local React state.
- Mouse and touch events still call `header.getResizeHandler()`. TanStack still owns gesture lifecycle and `onChange` versus `onEnd` commits.
- Keyboard resizing still commits through `table.setColumnSizing()`: 8px normally, 32px with Shift, physical arrow direction mapped to LTR/RTL, configured min/max bounds, and two-decimal normalization.
- Double-click still calls `column.resetSize()`. The existing column-menu Reset width action remains the keyboard-accessible reset path.
- Group headers and columns with resizing disabled continue to omit the handle. Accessible separator role, label, current/min/max size, value text, and shortcut attributes are preserved.

No runtime geometry variable is needed inside this handle: its size and placement are fixed presentation rules, while the parent header already receives TanStack column width through its typed CSS variable. No inline width or duplicate geometry state is introduced.

The obsolete commented-out implementation at the bottom of the resize-handle file was removed. Existing 6C.3 and 6C.4 changes remain intact.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        resizeHandle: {
          // Keep the wider hit target even when changing the visual line.
          '&::after': {
            borderRadius: 0,
          },
          '&[data-resizing="true"]::after': {
            backgroundColor: '#1565c0',
            opacity: 1,
          },
          '&:focus-visible': {
            outlineWidth: 3,
          },
        },
      },
    },
  },
});
```

## Complete source

These are the full current versions of all three files changed for this phase. The class registry includes the earlier 6C.4 slots.

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

### src/components/DataTable/mui/components/DataTableResizeHandle.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/DataTableResizeHandle.tsx

import { styled, useTheme } from "@mui/material";

import type { KeyboardEvent } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";

import { useMuiDataTableContext, useMuiDataTableHeaderContext } from "../table";

/** The hit target is structural; the thin rule remains its pseudo-element. */
const ResizeHandleRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ResizeHandle",
  overridesResolver: (_props, styles) => styles.resizeHandle,
})(({ theme }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  insetInlineEnd: -4,
  width: 8,
  zIndex: 5,
  cursor: "col-resize",
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  display: "block",
  "&::after": {
    content: '\"\"',
    position: "absolute",
    top: "20%",
    bottom: "20%",
    // Center the 2px rule in either writing direction without a physical transform.
    insetInlineStart: "calc(50% - 1px)",
    width: 2,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (theme.vars ?? theme).palette.divider,
    opacity: 0.65,
    transition: theme.transitions.create(["background-color", "opacity"], {
      duration: theme.transitions.duration.shortest,
    }),
  },
  '&[data-resizing="true"]::after, &:hover::after, &:focus-visible::after': {
    backgroundColor: (theme.vars ?? theme).palette.primary.main,
    opacity: 1,
  },
  "&:focus-visible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 1,
    borderRadius:
      typeof theme.shape.borderRadius === "number"
        ? theme.shape.borderRadius * 0.5
        : `calc(${theme.shape.borderRadius} * 0.5)`,
  },
}));

/**
 * TanStack's stock default minimum column size.
 *
 * We duplicate the numeric fallback here only because columnDef.minSize
 * is optional in the public type.
 *
 * The actual committed size is still owned and constrained by TanStack.
 */
const DEFAULT_MIN_COLUMN_SIZE = 20;

/**
 * TanStack's stock default maximum column size.
 */
const DEFAULT_MAX_COLUMN_SIZE = Number.MAX_SAFE_INTEGER;

/**
 * Normal keyboard resize increment in pixels.
 *
 * Eight pixels aligns naturally with MUI's default spacing grid.
 */
const KEYBOARD_RESIZE_STEP = 8;

/**
 * Shift + Arrow uses a larger resize increment.
 */
const KEYBOARD_RESIZE_LARGE_STEP = 32;

/**
 * Clamp a requested width to the column's configured sizing range.
 */
function clampColumnSize(
  size: number,
  minSize: number,
  maxSize: number,
): number {
  return Math.min(maxSize, Math.max(minSize, size));
}

/**
 * Keep committed keyboard sizes at a maximum of two decimal places.
 *
 * Pointer resizing can produce fractional sizes, so we deliberately
 * avoid forcing all sizes to integers.
 */
function normalizeColumnSize(size: number): number {
  return Math.round(size * 100) / 100;
}

/**
 * Resolve a human-readable column label for accessibility.
 *
 * Priority:
 *
 * 1. MUI column meta.label
 * 2. string TanStack header
 * 3. stable column id
 *
 * This mirrors the policy used by the Column Manager without creating
 * a dependency from the low-level resize handle to that component.
 */
function getResizeColumnLabel(
  column: ReturnType<typeof useMuiDataTableHeaderContext>["column"],
): string {
  const meta = column.columnDef.meta;

  if (meta?.label) {
    return meta.label;
  }

  const header = column.columnDef.header;

  if (typeof header === "string") {
    return header;
  }

  return column.id;
}

/**
 * Interactive resize handle for one leaf header.
 *
 * Pointer/touch resizing:
 *
 *   delegated entirely to TanStack's
 *   header.getResizeHandler()
 *
 * Keyboard resizing:
 *
 *   commits directly through
 *   table.setColumnSizing()
 *
 * Keyboard controls:
 *
 *   ArrowLeft / ArrowRight
 *     Resize by 8px.
 *
 *   Shift + ArrowLeft / ArrowRight
 *     Resize by 32px.
 *
 * Direction semantics are physical:
 *
 *   LTR:
 *     ArrowRight -> wider
 *     ArrowLeft  -> narrower
 *
 *   RTL:
 *     ArrowLeft  -> wider
 *     ArrowRight -> narrower
 *
 * This matches the physical movement of the logical inline-end resize
 * handle in each writing direction.
 */
export function DataTableResizeHandle() {
  const table = useMuiDataTableContext();

  const header = useMuiDataTableHeaderContext();

  const theme = useTheme();

  const column = header.column;

  /**
   * Group headers must not own independent resize handles in renderer.
   *
   * Their width is derived from their leaf columns.
   */
  const leafHeader = header.subHeaders.length === 0;

  const canResize = leafHeader && column.getCanResize();

  if (!canResize) {
    return null;
  }

  const resizeHandler = header.getResizeHandler();

  const label = getResizeColumnLabel(column);

  return (
    <table.Subscribe
      selector={(state) => ({
        /**
         * Re-render when committed widths change.
         */
        columnSizing: state.columnSizing,

        /**
         * Re-render while pointer/touch resizing begins, moves,
         * and ends.
         */
        columnResizing: state.columnResizing,
      })}
    >
      {() => {
        const size = column.getSize();

        const isResizing = column.getIsResizing();

        const minSize = column.columnDef.minSize ?? DEFAULT_MIN_COLUMN_SIZE;

        const maxSize = column.columnDef.maxSize ?? DEFAULT_MAX_COLUMN_SIZE;

        /**
         * TanStack's columnResizeDirection is already synchronized
         * with our MUI theme direction by the table setup.
         *
         * Falling back to theme.direction keeps this component safe
         * even if a lower-level consumer omits that option.
         */
        const resizeDirection =
          table.options.columnResizeDirection ?? theme.direction;

        /**
         * Commit one keyboard size adjustment.
         *
         * We intentionally do NOT touch state.columnResizing here.
         *
         * That state represents an active drag gesture:
         *
         *   startOffset
         *   startSize
         *   deltaOffset
         *   deltaPercentage
         *   columnSizingStart
         *   isResizingColumn
         *
         * A keyboard press has no corresponding drag lifecycle.
         */
        const resizeBy = (delta: number): void => {
          const currentSize = column.getSize();

          const nextSize = normalizeColumnSize(
            clampColumnSize(currentSize + delta, minSize, maxSize),
          );

          if (nextSize === currentSize) {
            return;
          }

          table.setColumnSizing((previous) => ({
            ...previous,

            [column.id]: nextSize,
          }));
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
          }

          event.preventDefault();

          event.stopPropagation();

          const step = event.shiftKey
            ? KEYBOARD_RESIZE_LARGE_STEP
            : KEYBOARD_RESIZE_STEP;

          /**
           * The handle lives on logical inline-end.
           *
           * LTR:
           *
           *     column |handle
           *
           * ArrowRight physically moves the handle outward and
           * therefore increases width.
           *
           * RTL:
           *
           *     handle| column
           *
           * ArrowLeft physically moves the handle outward and
           * therefore increases width.
           */
          const increasing =
            resizeDirection === "rtl"
              ? event.key === "ArrowLeft"
              : event.key === "ArrowRight";

          resizeBy(increasing ? step : -step);
        };

        return (
          <ResizeHandleRoot
            className={dataTableClasses.resizeHandle}
            role="separator"
            tabIndex={0}
            aria-label={`Resize ${label}`}
            aria-orientation="vertical"
            aria-valuemin={minSize}
            aria-valuemax={maxSize}
            aria-valuenow={Math.round(size)}
            aria-valuetext={`${Math.round(size)} pixels`}
            aria-keyshortcuts="ArrowLeft ArrowRight Shift+ArrowLeft Shift+ArrowRight"
            data-column-resize-handle={column.id}
            data-resizing={isResizing ? "true" : undefined}
            /**
             * TanStack owns pointer/touch resize lifecycle.
             */
            onMouseDown={resizeHandler}
            onTouchStart={resizeHandler}
            /**
             * Keyboard resizing commits directly into columnSizing.
             */
            onKeyDown={handleKeyDown}
            /**
             * Pointer users retain the familiar double-click reset.
             *
             * Keyboard users can reach the existing "Reset width"
             * action through the column menu.
             */
            onDoubleClick={(event) => {
              event.preventDefault();

              event.stopPropagation();

              column.resetSize();
            }}
          />
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/resizeHandleTheme.spec.tsx

```tsx
import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

const helper = createMuiDataTableColumnHelper<{
  name: string;
  fixed: string;
}>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    size: 100,
    minSize: 80,
    maxSize: 140,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { enableColumnMenu: false },
  }),
  helper.accessor("fixed", {
    header: "Fixed",
    enableResizing: false,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { enableColumnMenu: false },
  }),
]);
const data = [{ name: "A", fixed: "B" }];
function Fixture({
  direction = "ltr",
  enabled = true,
  mode = "onChange",
}: {
  direction?: "ltr" | "rtl";
  enabled?: boolean;
  mode?: "onChange" | "onEnd";
}) {
  const table = useMuiDataTable({
    columns,
    data,
    enableColumnResizing: enabled,
    columnResizeDirection: direction,
    columnResizeMode: mode,
  });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <Table>
          <TableHead>
            <DataTableHeaderRow
              table={table}
              headerGroup={table.getHeaderGroups()[0]}
              headerRowIndex={0}
            />
          </TableHead>
        </Table>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}
function mount(
  direction: "ltr" | "rtl" = "ltr",
  enabled = true,
  mode: "onChange" | "onEnd" = "onChange",
) {
  return render(
    <ThemeProvider
      theme={createTheme({
        direction,
        components: {
          RazethDataTable: {
            styleOverrides: {
              resizeHandle: { backgroundColor: "rgb(10, 20, 30)" },
            },
          },
        },
      })}
    >
      <Fixture direction={direction} enabled={enabled} mode={mode} />
    </ThemeProvider>,
  );
}
function handle() {
  return screen.getByRole("separator", { name: "Resize Name" });
}

describe("resize handle theme and TanStack interactions", () => {
  it("exposes the structural slot, theme override, and accessible size", () => {
    mount();
    expect(handle()).toHaveClass(dataTableClasses.resizeHandle);
    expect(handle()).toHaveStyle({
      position: "absolute",
      width: "8px",
      insetInlineEnd: "-4px",
      backgroundColor: "rgb(10, 20, 30)",
    });
    expect(handle()).toHaveAttribute("aria-valuenow", "100");
    expect(handle()).toHaveAttribute("aria-valuemin", "80");
    expect(handle()).toHaveAttribute("aria-valuemax", "140");
    expect(handle()).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });
  it("omits handles when table resizing is disabled", () => {
    mount("ltr", false);
    expect(screen.queryByRole("separator")).toBeNull();
  });
  it.each(["ltr", "rtl"] as const)(
    "preserves keyboard steps, bounds and reset in %s",
    (direction) => {
      mount(direction);
      const grow = direction === "ltr" ? "ArrowRight" : "ArrowLeft";
      const shrink = direction === "ltr" ? "ArrowLeft" : "ArrowRight";
      fireEvent.keyDown(handle(), { key: grow });
      expect(handle()).toHaveAttribute("aria-valuenow", "108");
      fireEvent.keyDown(handle(), { key: grow, shiftKey: true });
      expect(handle()).toHaveAttribute("aria-valuenow", "140");
      fireEvent.keyDown(handle(), { key: grow });
      expect(handle()).toHaveAttribute("aria-valuenow", "140");
      fireEvent.keyDown(handle(), { key: shrink, shiftKey: true });
      fireEvent.keyDown(handle(), { key: shrink, shiftKey: true });
      expect(handle()).toHaveAttribute("aria-valuenow", "80");
      expect(handle()).not.toHaveAttribute("data-resizing");
      fireEvent.doubleClick(handle());
      expect(handle()).toHaveAttribute("aria-valuenow", "100");
      fireEvent.keyDown(handle(), { key: "Enter" });
      expect(handle()).toHaveAttribute("aria-valuenow", "100");
    },
  );
  it.each(["onChange", "onEnd"] as const)(
    "delegates mouse lifecycle and %s commits to TanStack",
    (mode) => {
      mount("ltr", true, mode);
      fireEvent.mouseDown(handle(), { clientX: 100, button: 0 });
      expect(handle()).toHaveAttribute("data-resizing", "true");
      fireEvent.mouseMove(document, { clientX: 120 });
      expect(handle()).toHaveAttribute(
        "aria-valuenow",
        mode === "onChange" ? "120" : "100",
      );
      fireEvent.mouseUp(document, { clientX: 120 });
      expect(handle()).toHaveAttribute("aria-valuenow", "120");
      expect(handle()).not.toHaveAttribute("data-resizing");
    },
  );
  it("delegates touch resizing to TanStack", () => {
    mount();
    fireEvent.touchStart(handle(), { touches: [{ clientX: 100 }] });
    expect(handle()).toHaveAttribute("data-resizing", "true");
    fireEvent.touchMove(document, { touches: [{ clientX: 116 }] });
    fireEvent.touchEnd(document, {
      touches: [],
      changedTouches: [{ clientX: 116 }],
    });
    expect(handle()).toHaveAttribute("aria-valuenow", "116");
    expect(handle()).not.toHaveAttribute("data-resizing");
  });
});
```

## Validation

`npm run typecheck` passed, including the TanStack feature synchronization check.

`npm run test:datatable -- --runInBand` passed: **19 suites, 103 tests**.

Seven new cases verify:

1. Named-slot override application, logical placement, hit-target width, and accessible sizing attributes.
2. Table-level resize disabling and per-column disabling.
3. LTR keyboard steps, min/max clamping, reset, and ignored unrelated keys.
4. The same keyboard contract in RTL.
5. Mouse drag lifecycle and immediate `onChange` sizing.
6. Mouse drag lifecycle and deferred `onEnd` sizing.
7. Touch drag lifecycle and committed width.

The fixtures use real TanStack table/header contexts and MUI TableHead. They assert public UI/state behavior rather than generated Emotion class names.

Live-browser acceptance was not rerun for this phase. Jest/jsdom does not verify painted pseudo-elements or real pointer hit testing.

## Browser acceptance checklist

1. Drag a TranslationKey column edge and verify header/body/filter widths stay aligned.
2. Double-click the edge and verify the configured width returns.
3. Tab to the resize separator; use arrows and Shift+arrows, including at minimum/maximum widths.
4. Repeat in RTL; verify the rule remains centered on the hit target and physical arrow direction behaves naturally.
5. Check focus and drag highlighting, touch input, pinned boundaries, and horizontal scrolling.

This completes the resize-handle implementation step. Remaining header browser acceptance and the header/pinning slot audit should be resolved before declaring the full 6C phase closed or proceeding to 6D.
