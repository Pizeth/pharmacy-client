// src/components/DataTable/mui/table/muiDataTableHook.ts

"use client";

import { createTableHook } from "@tanstack/react-table";
import { DataTableResizeHandle } from "../components/DataTableResizeHandle";
import { muiDataTableFeatures } from "../features";
import {
  muiDataTableCellContext,
  muiDataTableContext,
  muiDataTableHeaderContext,
} from "./muiDataTableContexts";

/**
 * MUI DataTable React composition family.
 *
 * TFeatures is statically bound here once for every high-level MUI table.
 *
 * Per-table behavior continues to be controlled through options such as:
 *
 * - enableSorting
 * - enableFilters
 * - enableRowSelection
 * - enableColumnPinning
 * - enableColumnResizing
 * - manualSorting
 * - manualFiltering
 * - manualPagination
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

  /**
   * Header-level reusable components.
   *
   * These become available as:
   *
   *   header.ResizeHandle
   *
   * inside createAppColumnHelper() header definitions and inside AppHeader
   * children.
   */
  headerComponents: {
    ResizeHandle: DataTableResizeHandle,
  },

  /**
   * MUI DataTable sizing defaults.
   *
   * Individual column definitions may override all three values.
   */
  defaultColumn: {
    size: 180,
    minSize: 64,
    maxSize: 600,
  },
});
