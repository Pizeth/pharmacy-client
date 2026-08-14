// src/components/DataTable/mui/table/muiDataTableContexts.ts

"use client";

import { createTableHookContexts } from "@tanstack/react-table";

import type { MuiDataTableFeatures } from "../features";

/**
 * Isolated TanStack React contexts for the MUI DataTable family.
 *
 * We intentionally avoid TanStack's shared module-level contexts.
 *
 * This gives our DataTable family its own:
 *
 * - table context
 * - cell context
 * - header context
 *
 * and prevents unrelated createTableHook families from sharing the
 * same context namespace.
 */
export const {
  tableContext: muiDataTableContext,

  cellContext: muiDataTableCellContext,

  headerContext: muiDataTableHeaderContext,
} = createTableHookContexts<MuiDataTableFeatures>();
