"use client";

// src/components/link/usePublicDocumentsDataTable.ts

import { useCallback, useMemo, useState } from "react";

import { useMuiDataTable } from "@/components/DataTable";

import { createPublicDocumentColumns } from "./columns";
import { PUBLIC_DOCUMENTS } from "./data";
import type { PublicDocumentCategory } from "./data";
import { createPublicDocumentActions } from "./documentActions";
import type { PublicDocumentActionsConfig } from "./documentActions";
import type { PublicDocumentRecord } from "./types";

export const PUBLIC_DOCUMENTS_DEFAULT_PAGE_SIZE = 25;

export interface UsePublicDocumentsDataTableOptions {
  /**
   * Both handlers must be referentially stable (wrap in useCallback) so
   * column definitions are not rebuilt on every render.
   */
  readonly onViewDocument: (doc: PublicDocumentRecord) => void;
  readonly onDownloadDocument: (doc: PublicDocumentRecord) => void;

  /**
   * Optional per-action visibility overrides. Must also be referentially
   * stable (define it at module level). By default View is shown only for
   * PDF/image files and Download for both Drive links and files.
   */
  readonly actions?: PublicDocumentActionsConfig;
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
  const {
    onViewDocument,
    onDownloadDocument,
    actions: actionsConfig,
  } = options;

  const [category, setCategory] = useState<PublicDocumentCategory>("ទាំងអស់");

  /**
   * One definition of View / Download, shared by the table column (labelled
   * buttons) and the card presentation (icon-only buttons).
   */
  const actions = useMemo(
    () =>
      createPublicDocumentActions(
        { onView: onViewDocument, onDownload: onDownloadDocument },
        actionsConfig,
      ),
    [onViewDocument, onDownloadDocument, actionsConfig],
  );

  const columns = useMemo(
    () => createPublicDocumentColumns(actions),
    [actions],
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
      pagination: {
        pageIndex: 0,
        pageSize: PUBLIC_DOCUMENTS_DEFAULT_PAGE_SIZE,
      },
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

  return { table, category, changeCategory, actions };
}
