// src/features/documents/types.ts

import type { BaseRecord } from "@refinedev/core";

/**
 * Canonical row shape consumed by the modern Document DataTable proof.
 *
 * This intentionally models only fields required by the current table/query
 * contract. The legacy FTS mock row contains many workflow-specific display
 * fields; those can move across in later resource-migration slices without
 * weakening the generic DataTable boundary.
 */
export interface DocumentRecord extends BaseRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}

/**
 * Stable column IDs used by:
 *
 * - column definitions,
 * - server semantic mapping,
 * - tests,
 * - future persisted table state.
 */
export const DOCUMENT_COLUMN_IDS = {
  rowNumber: "rowNumber",
  documentNumber: "documentNumber",
  title: "title",
  description: "description",
  status: "status",
  processingDays: "processingDays",
  isEnabled: "isEnabled",
  createdAt: "createdAt",
} as const;
