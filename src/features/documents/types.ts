// src/features/documents/types.ts

/**
 * Canonical row shape for the modern Document DataTable.
 *
 * This intentionally follows the public query contract established by
 * documentTableQuery.ts rather than copying the legacy MRT mock-data model.
 *
 * The old FTS screen used presentation-era names such as:
 *
 *   days
 *   types
 *   categories
 *   office
 *
 * The new resource contract uses stable domain-facing field names so the
 * transport layer, table state, and future backend endpoint do not depend on
 * an old renderer's mock shape.
 */
export interface DocumentRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly documentType: string;
  readonly category: string;
  readonly office: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
