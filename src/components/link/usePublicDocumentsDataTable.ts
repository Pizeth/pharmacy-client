"use client";

// src/components/link/usePublicDocumentsDataTable.ts

import { useCallback, useMemo, useState } from "react";

import { useMuiDataTable } from "@/components/DataTable";

import { createPublicDocumentColumns } from "./columns";
import { PUBLIC_DOCUMENTS } from "./data";
import type { PublicDocumentCategory } from "./data";
import type { PublicDocumentRecord } from "./types";

export interface UsePublicDocumentsDataTableOptions {
  /**
   * Must be referentially stable (wrap in useCallback) so column
   * definitions are not rebuilt on every render.
   */
  readonly onOpenDocument: (doc: PublicDocumentRecord) => void;
}

/**
 * Client-side table over the static directory.
 *
 * No row models are passed: the MUI feature family already registers
 * filtered/sorted/paginated row models, and they run because the
 * manual* options stay unset.
 */
export function usePublicDocumentsDataTable(
  options: UsePublicDocumentsDataTableOptions,
) {
  const { onOpenDocument } = options;

  const [category, setCategory] = useState<PublicDocumentCategory>("ទាំងអស់");

  const columns = useMemo(
    () => createPublicDocumentColumns(onOpenDocument),
    [onOpenDocument],
  );

  const table = useMuiDataTable({
    data: PUBLIC_DOCUMENTS,
    columns,
    getRowId: (row) => row.id,

    enableGlobalFilter: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableRowSelection: false,

    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },

    meta: {
      emptyContent: "No documents to display.",
      noResultsContent:
        "មិនមានឯកសារណាដែលពាក់ព័ន្ធ ឬត្រូវគ្នានឹងការស្វែងរកនោះទេ",
    },
  });

  const changeCategory = useCallback(
    (next: PublicDocumentCategory) => {
      setCategory(next);
      table
        .getColumn("category")
        ?.setFilterValue(next === "ទាំងអស់" ? undefined : next);
    },
    [table],
  );

  return { table, category, changeCategory };
}
