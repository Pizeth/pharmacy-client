/**
 * Stable MUI component-family name used by every styled DataTable slot.
 *
 * Application themes will eventually customize the complete table through:
 *
 *   theme.components.RazethDataTable
 *
 * Do not derive it from file/component names.
 *
 * Keeping one stable family name lets all DataTable visual slots be
 * customized from one theme location.
 *
 * Individual visual pieces use named slots:
 *
 *   Root
 *   Toolbar
 *   GlobalFilter
 *   HeaderCell
 *   BodyCell
 *   Pagination
 *   ...
 */
export const DATA_TABLE_COMPONENT_NAME = "RazethDataTable" as const;
