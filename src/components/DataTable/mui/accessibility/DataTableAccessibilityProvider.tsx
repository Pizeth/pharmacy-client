// src/components/DataTable/mui/accessibility/DataTableAccessibilityProvider.tsx

"use client";

import { createContext, useContext, useId, useMemo } from "react";
import type { ReactNode } from "react";

/**
 * Accessibility IDs shared by pieces of one DataTable.
 *
 * A DataTable may appear multiple times on the same page, so IDs such
 * as:
 *
 *   "filter-row"
 *   "table-search"
 *
 * are not safe by themselves.
 *
 * The provider creates a unique namespace per DataTable instance.
 */
export interface DataTableAccessibilityContextValue {
  /**
   * Unique namespace for this DataTable.
   */
  readonly namespace: string;

  /**
   * DOM id of the global-search region.
   */
  readonly globalSearchId: string;

  /**
   * DOM id of the optional column-filter subheader row.
   */
  readonly filterRowId: string;

  /**
   * DOM id of one row's expansion button.
   */
  readonly getExpandButtonId: (rowId: string) => string;

  /**
   * DOM id of one row's detail-panel region.
   */
  readonly getDetailPanelId: (rowId: string) => string;
}

const DataTableAccessibilityContext = createContext<
  DataTableAccessibilityContextValue | undefined
>(undefined);

export interface DataTableAccessibilityProviderProps {
  readonly children: ReactNode;
}

/**
 * Convert an arbitrary TanStack row ID into a safe DOM-id fragment.
 *
 * Row IDs may contain:
 *
 *   "."
 *   "/"
 *   spaces
 *   Unicode
 *   application-specific identifiers
 *
 * encodeURIComponent gives us deterministic isolation from those
 * characters.
 */
function createDomIdPart(value: string): string {
  return encodeURIComponent(value).replace(/%/g, "_");
}

/**
 * Creates stable accessibility relationships for one DataTable.
 *
 * This owns no table state and has no dependency on TanStack.
 */
export function DataTableAccessibilityProvider(
  props: DataTableAccessibilityProviderProps,
) {
  const { children } = props;

  const reactId = useId();

  /**
   * React useId() may contain ":".
   *
   * Those characters are legal in HTML IDs, but removing them makes
   * debugging and CSS inspection considerably easier.
   */
  const namespace = useMemo(
    () => `data-table-${reactId.replace(/:/g, "")}`,
    [reactId],
  );

  const value = useMemo<DataTableAccessibilityContextValue>(
    () => ({
      namespace,
      globalSearchId: `${namespace}-global-search`,
      filterRowId: `${namespace}-filter-row`,

      getExpandButtonId: (rowId: string): string =>
        `${namespace}-row-${createDomIdPart(rowId)}-expand`,

      getDetailPanelId: (rowId: string): string =>
        `${namespace}-row-${createDomIdPart(rowId)}-detail`,
    }),
    [namespace],
  );

  return (
    <DataTableAccessibilityContext.Provider value={value}>
      {children}
    </DataTableAccessibilityContext.Provider>
  );
}

/**
 * Access accessibility IDs belonging to the current DataTable.
 */
export function useDataTableAccessibility(): DataTableAccessibilityContextValue {
  const context = useContext(DataTableAccessibilityContext);

  if (context === undefined) {
    throw new Error(
      "useDataTableAccessibility must be used within DataTableAccessibilityProvider.",
    );
  }

  return context;
}
