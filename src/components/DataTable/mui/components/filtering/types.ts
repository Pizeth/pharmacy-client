// src/components/DataTable/mui/components/filtering/types.ts

import { SxProps, Theme } from "@mui/material/styles";
import type {
  MuiDataTableFilterOption,
  MuiDataTableFilterVariant,
} from "../../meta";
import type { DataTableSelectFilterValue } from "./selectFilterValue";

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

/**
 * Shared leaf-control contracts.
 *
 * Components and theme registration import these types directly from this
 * module, so the theme contract does not depend on React implementations.
 */
export interface DataTableTextFilterProps {
  readonly value: string;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: string) => void;
  readonly onClear: () => void;
}

export interface DataTableSelectFilterProps {
  readonly loading?: boolean;
  /** Safe presentation text supplied by the caller; never a raw transport error. */
  readonly errorMessage?: string;
  readonly value: DataTableSelectFilterValue | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly options: readonly MuiDataTableFilterOption[];
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: DataTableSelectFilterValue) => void;
  readonly onClear: () => void;
}

export interface DataTableBooleanFilterProps {
  readonly value: boolean | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: boolean) => void;
  readonly onClear: () => void;
}

export interface DataTableNumberFilterProps {
  readonly value: number | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: number) => void;
  readonly onClear: () => void;
}

export interface DataTableNumberRangeFilterProps {
  readonly value: DataTableNumberRangeValue;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: DataTableNumberRangeValue) => void;
  readonly onClear: () => void;
}

export interface DataTableFilterIndicatorProps {
  readonly active: boolean;
  readonly component?: React.ElementType | undefined;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
}
