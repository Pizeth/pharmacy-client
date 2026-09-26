// src/features/documents/refine/documentFixtureDataProvider.ts

import type {
  BaseRecord,
  CrudFilter,
  CrudSort,
  DataProvider,
  GetListParams,
  GetListResponse,
  LogicalFilter,
} from "@refinedev/core";

import generateLegacyDocumentRows from "@/components/fts/mockData";
import type { Data as LegacyDocumentRow } from "@/components/fts/mockData";

import type { DocumentRecord } from "../types";

export const DOCUMENT_REFINE_PROVIDER_NAME = "documentFixture";
export const DOCUMENT_REFINE_RESOURCE = "documents";

/**
 * Translate the legacy FTS fixture into the public row contract used by the
 * modern DataTable.
 *
 * Keeping this translation at the data-provider boundary gives 1.8.4 a real
 * Refine execution path without teaching the new table about old MRT field
 * names.
 *
 * When the backend exposes the production document list endpoint, this fixture
 * provider can be removed without changing:
 *
 * - Document columns
 * - DataTable state
 * - semantic query mapping
 * - Refine adapter
 * - renderer
 */
export function adaptLegacyDocumentFixture(
  row: LegacyDocumentRow,
): DocumentRecord {
  return {
    id: row.id,
    documentNumber: row.details?.originId ?? "DOC-" + row.id,
    title: row.title,
    status: row.status,
    processingDays: row.days,
    type: row.types,
    category: row.categories,
    office: row.office,
    isEnabled: true,
    description: row.description,
    createdAt: row.details?.acceptedDate
      ? new Date(row.details.acceptedDate).toISOString()
      : new Date(2026, 0, 1).toISOString(),
    details: row.details,
  };
}

/**
 * Application fixture used only until the real document API is available.
 *
 * generateRows() is evaluated once at module load, so one browser session sees
 * a stable collection rather than a different result on every Refine request.
 */
export const DOCUMENT_FIXTURE_ROWS: readonly DocumentRecord[] =
  generateLegacyDocumentRows(200).map(adaptLegacyDocumentFixture);

function isLogicalFilter(filter: CrudFilter): filter is LogicalFilter {
  return "field" in filter;
}

function readField(
  row: DocumentRecord,
  field: string,
): unknown {
  return row[field as keyof DocumentRecord];
}

function matchesLogicalFilter(
  row: DocumentRecord,
  filter: LogicalFilter,
): boolean {
  const actual = readField(row, filter.field);

  switch (filter.operator) {
    case "eq":
      return actual === filter.value;

    case "contains":
      return (
        typeof actual === "string" &&
        typeof filter.value === "string" &&
        actual.toLocaleLowerCase().includes(
          filter.value.toLocaleLowerCase(),
        )
      );

    case "gte":
      return (
        typeof actual === "number" &&
        typeof filter.value === "number" &&
        actual >= filter.value
      );

    case "lte":
      return (
        typeof actual === "number" &&
        typeof filter.value === "number" &&
        actual <= filter.value
      );

    case "in":
      return Array.isArray(filter.value) && filter.value.includes(actual);

    default:
      /**
       * The DataTable Refine adapter emits only the operator family above.
       * Returning false for another operator makes accidental expansion of the
       * provider contract visible instead of silently broadening a result.
       */
      return false;
  }
}

function matchesFilter(
  row: DocumentRecord,
  filter: CrudFilter,
): boolean {
  if (isLogicalFilter(filter)) {
    return matchesLogicalFilter(row, filter);
  }

  const predicates = filter.value;

  if (filter.operator === "or") {
    return predicates.some((child) => matchesFilter(row, child));
  }

  return predicates.every((child) => matchesFilter(row, child));
}

function compareValues(
  left: unknown,
  right: unknown,
): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left ?? "").localeCompare(String(right ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function sortRows(
  rows: readonly DocumentRecord[],
  sorters: readonly CrudSort[],
): DocumentRecord[] {
  if (sorters.length === 0) {
    return [...rows];
  }

  return [...rows].sort((left, right) => {
    for (const sorter of sorters) {
      const comparison = compareValues(
        readField(left, sorter.field),
        readField(right, sorter.field),
      );

      if (comparison !== 0) {
        return sorter.order === "desc" ? -comparison : comparison;
      }
    }

    return 0;
  });
}

/**
 * Create the named Refine provider used by the Document/FTS migration proof.
 *
 * The provider intentionally implements full getList semantics required by the
 * DataTable adapter:
 *
 * - server pagination
 * - multiple sort descriptors
 * - column filters
 * - OR global-search filter groups
 *
 * Other CRUD methods are unsupported because 1.8.4 is specifically the
 * reusable list/query proof. Resource mutations remain a later Document
 * migration slice.
 */
export function createDocumentFixtureDataProvider(
  sourceRows: readonly DocumentRecord[] = DOCUMENT_FIXTURE_ROWS,
): DataProvider {
  const unsupported = async (): Promise<never> => {
    throw new Error(
      "Document fixture provider currently supports only Refine getList().",
    );
  };

  return {
    async getList<TData extends BaseRecord = BaseRecord>(
      params: GetListParams,
    ): Promise<GetListResponse<TData>> {
      if (params.resource !== DOCUMENT_REFINE_RESOURCE) {
        throw new Error(
          'Document fixture provider cannot serve resource "' +
            params.resource +
            '".',
        );
      }

      const filters = params.filters ?? [];
      const sorters = params.sorters ?? [];

      const filtered = sourceRows.filter((row) =>
        filters.every((filter) => matchesFilter(row, filter)),
      );

      const sorted = sortRows(filtered, sorters);

      const {
        currentPage = 1,
        pageSize = 25,
        mode = "server",
      } = params.pagination ?? {};

      const paginated =
        mode === "server"
          ? sorted.slice(
              Math.max(0, currentPage - 1) * pageSize,
              Math.max(0, currentPage - 1) * pageSize + pageSize,
            )
          : sorted;

      return {
        data: paginated.map((row) => ({ ...row })) as TData[],
        total: filtered.length,
      };
    },

    getOne: unsupported as DataProvider["getOne"],
    create: unsupported as DataProvider["create"],
    update: unsupported as DataProvider["update"],
    deleteOne: unsupported as DataProvider["deleteOne"],

    getApiUrl: () => "fixture://documents",
  };
}

export const documentFixtureDataProvider =
  createDocumentFixtureDataProvider();
