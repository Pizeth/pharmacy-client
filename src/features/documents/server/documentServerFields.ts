/**
 * Stable Document DataTable column IDs.
 *
 * Keeping IDs centralized prevents the column family and semantic server
 * mapper from drifting independently.
 */
export const DOCUMENT_COLUMN_IDS = {
  rowNumber: "rowNumber",
  documentNumber: "documentNumber",
  title: "title",
  status: "status",
  processingDays: "processingDays",
  isEnabled: "isEnabled",
  createdAt: "createdAt",
} as const;

export type DocumentColumnId =
  (typeof DOCUMENT_COLUMN_IDS)[keyof typeof DOCUMENT_COLUMN_IDS];

/**
 * Public resource fields accepted by the semantic query contract.
 *
 * These are application/API field names, not Prisma fields.
 */
export const DOCUMENT_SORT_FIELDS = {
  documentNumber: "documentNumber",
  title: "title",
  status: "status",
  createdAt: "createdAt",
} as const;

export const DOCUMENT_FILTER_FIELDS = {
  documentNumber: "documentNumber",
  title: "title",
  status: "status",
  processingDays: "processingDays",
  isEnabled: "isEnabled",
} as const;

export const DOCUMENT_GLOBAL_SEARCH_FIELDS = [
  "documentNumber",
  "title",
  "description",
] as const;
