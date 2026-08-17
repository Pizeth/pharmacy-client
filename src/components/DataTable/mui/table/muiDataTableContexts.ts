// src/components/DataTable/mui/table/muiDataTableContexts.ts

"use client";

import { createTableHookContexts } from "@tanstack/react-table";

import type { MuiDataTableFeatures } from "../features";

/**
 * Dedicated TanStack context family for the MUI DataTable.
 *
 * Using scoped contexts instead of TanStack's shared default contexts so
 * nested/independent table families cannot accidentally read one another's
 * table/header/cell instances.
 *
 * The context hooks returned here know:
 *
 *   TFeatures = MuiDataTableFeatures
 *
 * but do not know the component maps later registered by createTableHook().
 *
 * That's fine for low-level infrastructure components such as ResizeHandle.
 * Application components should normally prefer the richer hooks returned by
 * createTableHook().
 */
const muiDataTableHookContexts =
  createTableHookContexts<MuiDataTableFeatures>();

/**
 * Low-level scoped context hooks.
 *
 * These are primarily intended for MUI DataTable infrastructure components.
 */
export const useMuiDataTableScopedTableContext =
  muiDataTableHookContexts.useTableContext;

export const useMuiDataTableScopedCellContext =
  muiDataTableHookContexts.useCellContext;

export const useMuiDataTableScopedHeaderContext =
  muiDataTableHookContexts.useHeaderContext;

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
