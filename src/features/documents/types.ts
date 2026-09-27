import type { BaseRecord } from "@refinedev/core";

/**
 * Public document row contract consumed by the modern DataTable feature.
 *
 * This intentionally models the fields already established by
 * documentTableSemanticQuery rather than copying the legacy MRT mock-data
 * shape. The semantic query is therefore the stable boundary shared by
 * Standard API and Refine transports.
 */
export interface DocumentRecord extends BaseRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}

/**
 * Legacy FTS status values retained as presentation/filter options.
 *
 * They are resource-owned values. Generic DataTable does not know what a
 * document status means.
 */
export const DOCUMENT_STATUS_OPTIONS = [
  "ធម្មតា",
  "ប្រញ៉ាប់",
  "ប្រញ៉ាប់ណាស់",
] as const;
