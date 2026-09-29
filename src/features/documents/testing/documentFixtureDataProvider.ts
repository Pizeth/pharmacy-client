// src/features/documents/testing/documentFixtureDataProvider.ts

import type {
  CrudFilter,
  CrudSort,
  DataProvider,
  GetListParams,
  GetListResponse,
  LogicalFilter,
} from "@refinedev/core";

import { DOCUMENT_REFINE_RESOURCE } from "../documentTableRefineAdapter";
import type { DocumentRecord } from "../types";

const FIXTURE_STATUSES = [
  "ធម្មតា",
  "ប្រញ៉ាប់",
  "ប្រញ៉ាប់ណាស់",
] as const;

/**
 * Deterministic rows for the 1.8.4 acceptance proof.
 *
 * Do not depend on the legacy MRT mock-data shape here. The fixture talks only
 * in the modern public Document contract, making the old FTS implementation a
 * visual/behavior reference rather than an architectural dependency.
 */
export function createDocumentFixtureRows(
  count = 60,
): DocumentRecord[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const budgetDocument = id % 6 === 0;

    return {
      id,
      documentNumber: `DOC-${String(id).padStart(4, "0")}`,
      title: budgetDocument
        ? `Budget report ${id}`
        : `Document ${id}`,
      description:
        id % 5 === 0
          ? `Urgent ministry review ${id}`
          : `Routine circulation ${id}`,
      status: FIXTURE_STATUSES[index % FIXTURE_STATUSES.length],
      processingDays: (index % 12) + 1,
      isEnabled: id % 4 !== 0,
      createdAt: new Date(Date.UTC(2026, 0, id)).toISOString(),
    };
  });
}

export const DOCUMENT_FIXTURE_ROWS: readonly DocumentRecord[] =
  createDocumentFixtureRows();

function isLogicalFilter(
  filter: CrudFilter,
): filter is LogicalFilter {
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
      throw new Error(
        `Unsupported Document fixture filter operator: ${filter.operator}`,
      );
  }
}

function matchesFilter(
  row: DocumentRecord,
  filter: CrudFilter,
): boolean {
  if (isLogicalFilter(filter)) {
    return matchesLogicalFilter(row, filter);
  }

  if (filter.operator === "or") {
    return filter.value.some((child) => matchesFilter(row, child));
  }

  if (filter.operator === "and") {
    return filter.value.every((child) => matchesFilter(row, child));
  }

  throw new Error(
    `Unsupported Document fixture conditional operator: ${filter.operator}`,
  );
}

function compareValues(
  left: unknown,
  right: unknown,
): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left ?? "").localeCompare(
    String(right ?? ""),
    undefined,
    {
      numeric: true,
      sensitivity: "base",
    },
  );
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
 * Minimal Refine provider for the Document list/query acceptance proof.
 *
 * Mutations intentionally throw. Phase 1.8.4 proves reusable list transport;
 * it does not invent a production Document mutation API before the backend
 * contract exists.
 */
export function createDocumentFixtureDataProvider(
  sourceRows: readonly DocumentRecord[] = DOCUMENT_FIXTURE_ROWS,
): DataProvider {
  const getList = async (
    params: GetListParams,
  ): Promise<GetListResponse<DocumentRecord>> => {
    // Temporary Matrix A runtime evidence; removed after acceptance capture.
    if (process.env.NODE_ENV === "development") {
      console.info("[matrix-a] document.getList " + JSON.stringify({ resource: params.resource, pagination: params.pagination, filters: params.filters, sorters: params.sorters }));
    }
    if (params.resource !== DOCUMENT_REFINE_RESOURCE) {
      throw new Error(
        `Document fixture provider cannot serve resource "${params.resource}".`,
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

    const start = Math.max(0, currentPage - 1) * pageSize;

    const data =
      mode === "server"
        ? sorted.slice(start, start + pageSize)
        : sorted;

    return {
      data: data.map((row) => ({ ...row })),
      total: filtered.length,
    };
  };

  const unsupported = async (): Promise<never> => {
    throw new Error(
      "Document fixture provider currently supports only Refine getList().",
    );
  };

  return {
    getList: getList as DataProvider["getList"],
    getOne: unsupported as DataProvider["getOne"],
    create: unsupported as DataProvider["create"],
    update: unsupported as DataProvider["update"],
    deleteOne: unsupported as DataProvider["deleteOne"],
    getApiUrl: () => "fixture://documents",
  };
}

export const documentFixtureDataProvider =
  createDocumentFixtureDataProvider();
