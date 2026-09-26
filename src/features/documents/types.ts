// src/features/documents/types.ts

import type { BaseRecord } from "@refinedev/core";

/**
 * Normalized row shape for the Document/FTS DataTable migration.
 *
 * IMPORTANT:
 *
 * This is the application-facing list-row contract used by the new table
 * architecture. It intentionally contains only fields required by the current
 * document list/query proof.
 *
 * The legacy MRT mock model contains additional presentation-only detail
 * fields. Those will be migrated separately when the real Document backend
 * contract is available.
 */
export interface DocumentTableRecord extends BaseRecord {
  readonly id: number;

  /**
   * Stable public document identifier displayed to administrators.
   */
  readonly documentNumber: string;

  readonly title: string;
  readonly description?: string | null;

  /**
   * Resource-owned status value.
   *
   * The current legacy FTS UI uses Khmer status labels directly, therefore the
   * new table keeps this as a string instead of inventing an enum that the
   * backend does not expose yet.
   */
  readonly status: string;

  readonly processingDays: number;
  readonly isEnabled: boolean;

  /**
   * ISO timestamp supplied by the eventual resource API.
   */
  readonly createdAt: string;
}
