// src/components/DataTable/mui/components/filtering/types.ts

import type {
  MuiDataTableFilterOption,
  MuiDataTableFilterVariant,
} from "../../meta";

/**
 * Number-range value used by our MUI filter controls.
 *
 * `undefined` means that edge of the range is not constrained.
 *
 * Examples:
 *
 *   [18, 65]
 *   [18, undefined]
 *   [undefined, 65]
 */
export type DataTableNumberRangeValue = readonly [
  min: number | undefined,
  max: number | undefined,
];

/**
 * Boolean filter state.
 *
 * undefined:
 *   no filter
 *
 * true:
 *   true values only
 *
 * false:
 *   false values only
 */
export type DataTableBooleanFilterValue = boolean | undefined;

/**
 * Generic description of a DataTable column filter UI.
 *
 * This is a renderer concern only.
 */
export interface DataTableColumnFilterUiConfig {
  readonly variant: MuiDataTableFilterVariant;
  readonly label: string;
  readonly options?: readonly MuiDataTableFilterOption[];
}
