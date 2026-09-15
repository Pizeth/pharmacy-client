// src/components/DataTable/mui/theme/variants.ts

/**
 * ------------------------------------------------------------------
 * RazethDataTable visual variants
 * ------------------------------------------------------------------
 *
 * Variants are deliberately presentation-only.
 *
 * They must NOT imply:
 *
 * - TanStack configuration
 * - row/resource behavior
 * - filtering behavior
 * - selection behavior
 * - pagination behavior
 * - server/query behavior
 *
 * Those responsibilities remain outside the theme variant contract.
 */
export const DATA_TABLE_VARIANTS = ["outlined", "plain"] as const;

/**
 * Public visual variant accepted by DataTable.
 *
 * outlined:
 *   Existing DataTable shell appearance:
 *
 *   - paper background
 *   - one-pixel divider border
 *   - rounded shell
 *
 * plain:
 *   Embeddable shell:
 *
 *   - no outer border
 *   - no outer radius
 *
 * Internal table/header/body behavior is identical.
 */
export type DataTableVariant = (typeof DATA_TABLE_VARIANTS)[number];

/**
 * Preserve the current visual appearance as the built-in fallback.
 *
 * Theme defaultProps may replace this globally and an explicit
 * DataTable prop may replace the theme default.
 */
export const DATA_TABLE_DEFAULT_VARIANT =
  "outlined" as const satisfies DataTableVariant;

/**
 * ------------------------------------------------------------------
 * Props exposed to MUI's variant/style-owner contract
 * ------------------------------------------------------------------
 *
 * This interface is intentionally MUCH smaller than:
 *
 *   DataTableThemeProps
 *   DataTableProps<TData>
 *
 * MUI variants should match visual variant state only.
 *
 * They must not accidentally advertise selectors for:
 *
 * - initial density
 * - toolbar enablement
 * - search behavior
 * - resource/table objects
 */
export interface DataTableVariantProps {
  readonly variant?: DataTableVariant;
}

/**
 * ------------------------------------------------------------------
 * RazethDataTable Root ownerState
 * ------------------------------------------------------------------
 *
 * Runtime styling state supplied specifically to the shared component
 * Root.
 *
 * This ownerState exists for:
 *
 * - built-in Root variant presentation
 * - MUI theme variant matching
 *
 * It is deliberately NOT propagated through every styled member that
 * uses:
 *
 *   name: "RazethDataTable"
 *
 * because the DataTable theme family contains many independently
 * rendered slots:
 *
 * - toolbar
 * - pagination
 * - header
 * - filter row
 * - body
 * - states
 * - selection controls
 * - refresh indicator
 * - etc.
 *
 * MUI evaluates styleOverride callbacks for the component family while
 * resolving individual slots. Therefore a styleOverride callback must
 * not assume this ownerState is present on every RazethDataTable slot.
 *
 * Variant-specific styling for descendant slots should be expressed by
 * a Root-level theme variant using stable utility-class selectors.
 *
 * Do NOT add:
 *
 * - table
 * - rows
 * - columns
 * - callbacks
 * - density provider state
 * - fullscreen provider state
 * - request state
 */
export interface DataTableOwnerState {
  readonly variant: DataTableVariant;
}
