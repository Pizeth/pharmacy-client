import type {
  BaseRecord,
  CrudFilter,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";

import type {
  DataTableServerQueryState,
} from "../../mui/server-state";
import type {
  DataTableServerResult,
} from "../../mui/server-data";
import type {
  DataTableSemanticServerQueryAdapter,
  DataTableServerSearchDescriptor,
} from "../../mui/server-query";

/**
 * Search-filter mapper used by the Refine adapter.
 *
 * Refine deliberately has no dedicated "global search" field in
 * GetListParams. Different data providers encode full-text search in
 * different ways.
 *
 * Therefore DataTable never guesses a provider-specific convention.
 * A resource must either:
 *
 * - map semantic search into explicit Refine filters, or
 * - choose the "ignore" policy intentionally.
 */
export type RefineDataTableSearchFilterMapper = (
  search: DataTableServerSearchDescriptor,
) => readonly CrudFilter[];

/**
 * What should happen when the semantic query contains global search but
 * no Refine search-filter mapper has been supplied.
 *
 * "throw" is the safe default because silently dropping search would make
 * the UI look functional while returning incorrect data.
 */
export type RefineDataTableUnsupportedSearchPolicy = "throw" | "ignore";

/**
 * Configuration for the Refine request adapter.
 *
 * The semantic resource mapper remains responsible for translating
 * TanStack column IDs into public resource fields.
 *
 * This layer translates those public semantic fields into Refine's
 * transport-neutral GetListParams contract.
 */
export interface CreateRefineDataTableQueryAdapterOptions {
  readonly resource: string;

  /**
   * Optional Refine data-provider name when multiple providers are
   * registered.
   */
  readonly dataProviderName?: GetListParams["dataProviderName"];

  /**
   * Opaque provider metadata forwarded untouched to Refine.
   */
  readonly meta?: GetListParams["meta"];

  /**
   * Convert semantic global search into Refine filters.
   */
  readonly createSearchFilters?: RefineDataTableSearchFilterMapper;

  /**
   * Default: "throw".
   */
  readonly unsupportedSearchPolicy?: RefineDataTableUnsupportedSearchPolicy;
}

/**
 * Refine-specific DataTable adapter.
 *
 * This interface is intentionally separate from
 * DataTableServerAdapter<TRequest,TResponse,TData>.
 *
 * Refine's GetListResponse returns data + total, but it does not echo the
 * page that produced the response. Normalizing the response therefore also
 * requires the current DataTable query state.
 */
export interface RefineDataTableAdapter<
  TData extends RowData & BaseRecord,
> {
  readonly createRequest: (query: DataTableServerQueryState) => GetListParams;

  readonly readResponse: (
    response: GetListResponse<TData>,
    query: DataTableServerQueryState,
  ) => DataTableServerResult<TData>;
}

/**
 * Arguments accepted when composing a resource semantic mapper with the
 * Refine adapter.
 */
export interface CreateRefineDataTableAdapterOptions
  extends CreateRefineDataTableQueryAdapterOptions {
  readonly semanticAdapter: DataTableSemanticServerQueryAdapter;
}
