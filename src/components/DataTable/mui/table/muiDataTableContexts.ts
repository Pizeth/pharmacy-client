// src/components/DataTable/mui/table/muiDataTableContexts.ts

"use client";

import { createTableHookContexts } from "@tanstack/react-table";

import type { MuiDataTableFeatures } from "../features";

/**
 * Single dedicated TanStack React context family for the entire
 * MUI DataTable implementation.
 *
 * IMPORTANT:
 *
 * createTableHookContexts() must only be called ONCE for this family.
 *
 * Every Context object and every low-level context hook exported by
 * this module must belong to the same context namespace.
 *
 * Otherwise we could end up with:
 *
 *   AppTable providing TableContext A
 *
 * while:
 *
 *   useScopedTableContext() reads TableContext B
 *
 * which would make the hook unable to see the table provider.
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
 * ------------------------------------------------------------------
 * Actual React Context objects
 * ------------------------------------------------------------------
 *
 * These are supplied to createTableHook() in muiDataTableHook.ts.
 *
 * createTableHook() uses them when constructing:
 *
 *   <table.AppTable>
 *   <table.AppCell>
 *   <table.AppHeader>
 *   <table.AppFooter>
 *
 * and their corresponding richer hooks.
 */
export const muiDataTableContext = muiDataTableHookContexts.tableContext;

export const muiDataTableCellContext = muiDataTableHookContexts.cellContext;

export const muiDataTableHeaderContext = muiDataTableHookContexts.headerContext;

/**
 * ------------------------------------------------------------------
 * Low-level scoped hooks
 * ------------------------------------------------------------------
 *
 * These hooks know:
 *
 *   TFeatures = MuiDataTableFeatures
 *
 * and read directly from our isolated MUI context family.
 *
 * They do NOT know about component maps registered later through
 * createTableHook().
 *
 * Most normal MUI DataTable components should therefore prefer the
 * richer hooks exported by muiDataTableHook.ts:
 *
 *   useMuiDataTableContext
 *   useMuiDataTableCellContext
 *   useMuiDataTableHeaderContext
 *
 * These scoped hooks remain useful for infrastructure that needs
 * direct access to the underlying feature-bound contexts without
 * depending on the higher-level component registration.
 */
export const useMuiDataTableScopedTableContext =
  muiDataTableHookContexts.useTableContext;

export const useMuiDataTableScopedCellContext =
  muiDataTableHookContexts.useCellContext;

export const useMuiDataTableScopedHeaderContext =
  muiDataTableHookContexts.useHeaderContext;
