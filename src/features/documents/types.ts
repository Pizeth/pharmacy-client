import type { BaseRecord } from "@refinedev/core";

/**
 * Row contract for the modern Document DataTable proof.
 *
 * This is intentionally smaller and cleaner than the legacy FTS mock row.
 * It models only fields that participate in the current generic server-query
 * contract.
 *
 * The legacy MRT screen remains untouched until a real Document endpoint is
 * available. This type therefore proves the resource boundary without
 * pretending that the current mock-data shape is the final backend contract.
 */
export interface DocumentTableRow extends BaseRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}
