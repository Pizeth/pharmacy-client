import type { BaseRecord } from "@refinedev/core";

/**
 * Canonical row shape used by the modern Document DataTable proof.
 *
 * This intentionally models only fields that have an established semantic
 * query contract in documentServerQueryAdapter.ts.
 *
 * The legacy FTS/MRT mock row contains additional presentation fields. Those
 * are not copied into the new resource contract until a real backend document
 * API establishes their public names and types.
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
