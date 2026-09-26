import type { BaseRecord } from "@refinedev/core";

/**
 * Canonical row shape for the modern Document DataTable resource.
 *
 * This is deliberately smaller than the legacy FTS mock-data structure.
 *
 * Phase 1.8.4 is proving the reusable query/data lifecycle, so this type owns
 * only fields that participate in the current public semantic query contract
 * and its immediate table presentation.
 *
 * Additional workflow/detail fields belong here only after the real Document
 * API exposes them. The generic DataTable layer must never depend on those
 * future resource fields.
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
