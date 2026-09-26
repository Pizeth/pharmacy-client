import type { BaseRecord } from "@refinedev/core";

/**
 * Canonical row shape for the modern Document DataTable.
 *
 * This is intentionally much smaller than the legacy MRT mock record.
 *
 * Only fields that belong to the current public server-query contract are
 * modeled here. Legacy-only presentation details can be layered back in once
 * the real document API exposes them.
 */
export interface DocumentTableRecord extends BaseRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}
