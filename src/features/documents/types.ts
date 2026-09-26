// src/features/documents/types.ts

/**
 * Canonical row shape for the modern Document DataTable.
 *
 * This intentionally reflects the public table/query contract established by
 * documentTableQuery.ts rather than the old MRT mock-data shape.
 *
 * The legacy FTS table currently uses fields such as:
 *
 *   days
 *   types
 *   categories
 *   office
 *
 * Those names are presentation-era mock fields and must not leak into the new
 * transport contract simply because the old table happened to render them.
 */
export interface DocumentRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string;
}
