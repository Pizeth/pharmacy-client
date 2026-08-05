import type { RowData } from "@tanstack/table-core";

import type { DataTableFeatureConfig } from "../features/types";

export interface CreateDataTableInput<
  TData extends RowData,
  TConfig extends DataTableFeatureConfig,
> {
  data: TData[];
  columns: unknown[];
  features: TConfig;
}
