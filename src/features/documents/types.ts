import type { BaseRecord } from "@refinedev/core";

/**
 * Canonical row shape for the modern Document DataTable resource.
 *
 * This is deliberately smaller than the legacy FTS mock-data structure.
 * The second-resource proof is about the reusable query/data lifecycle, so
 * only fields that participate in the current public semantic query contract
 * belong here.
 *
 * Additional workflow/detail fields can be added when the real Document API
 * exposes them; the generic DataTable layer must not depend on them.
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
