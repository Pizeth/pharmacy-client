// src/components/DataTable/core/density/types.ts

export type MuiDataTableDensity =
  | "compact"
  | "comfortable"
  | "spacious";

export interface DataTableDensityConfig {
  readonly density?: MuiDataTableDensity;
  readonly defaultDensity?: MuiDataTableDensity;
  readonly onDensityChange?: (
    density: MuiDataTableDensity,
  ) => void;
}
