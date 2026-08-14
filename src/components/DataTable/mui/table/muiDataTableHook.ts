// src/components/DataTable/mui/table/muiDataTableHook.ts

"use client";

import { createTableHook } from "@tanstack/react-table";

import { muiDataTableFeatures } from "../features";

import {
  muiDataTableCellContext,
  muiDataTableContext,
  muiDataTableHeaderContext,
} from "./muiDataTableContexts";

/**
 * TanStack React composition family for our MUI DataTable.
 *
 * Phase 1.4 intentionally registers no custom UI components yet.
 *
 * Phase 1.5 will introduce:
 *
 * - tableComponents
 * - cellComponents
 * - headerComponents
 *
 * without changing this family's static feature identity.
 */
export const {
  /**
   * Creates one reactive MUI-family table.
   */
  useAppTable: useMuiDataTable,

  /**
   * Feature-bound, component-aware column helper.
   *
   * During Phase 1.4 no custom components are registered yet,
   * but this is still preferable to using createColumnHelper directly
   * because the feature type is permanently bound here.
   */
  createAppColumnHelper: createMuiDataTableColumnHelper,

  /**
   * Reads the nearest table provided by <table.AppTable>.
   */
  useTableContext: useMuiDataTableContext,

  /**
   * Reads the nearest cell provided by <table.AppCell>.
   */
  useCellContext: useMuiDataTableCellContext,

  /**
   * Reads the nearest header/footer provided by
   * <table.AppHeader> / <table.AppFooter>.
   */
  useHeaderContext: useMuiDataTableHeaderContext,

  /**
   * Exact feature family returned for introspection/debugging.
   */
  appFeatures: muiAppFeatures,
} = createTableHook({
  features: muiDataTableFeatures,

  tableContext: muiDataTableContext,

  cellContext: muiDataTableCellContext,

  headerContext: muiDataTableHeaderContext,
});
