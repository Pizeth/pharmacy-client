import type { DataTableTypesBase } from "../types";

import type { DataTableServices } from "./types";

/**
 * Creates framework services.
 */
export function createServices<
  TTypes extends DataTableTypesBase,
>(): DataTableServices<TTypes> {
  return {};
}
