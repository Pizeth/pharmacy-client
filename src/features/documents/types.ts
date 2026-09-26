import type { BaseKey } from "@refinedev/core";

/**
 * Canonical row shape for the modern Document DataTable proof.
 *
 * This intentionally models only fields that already participate in the
 * existing semantic table contract.
 *
 * The legacy FTS mock/MRT row shape uses presentation-oriented names such as:
 *
 *   days
 *   types
 *   categories
 *   office
 *
 * Those names are not copied into the new resource boundary. The modern table
 * uses the public document-query field names that are already established by:
 *
 *   documentTableSemanticQuery
 *
 * This keeps the proof focused on architecture rather than silently freezing
 * legacy mock-data terminology into the production contract.
 */
export interface DocumentTableRecord {
  readonly id: BaseKey;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}
