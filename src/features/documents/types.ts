import type { BaseRecord } from "@refinedev/core";

/**
 * Minimal public row contract for the Document/FTS DataTable proof.
 *
 * This type intentionally mirrors the fields already established by
 * documentTableSemanticQuery.
 *
 * It is NOT the old mockData.Data shape and it is NOT a Prisma model.
 * The resource boundary should speak in public API/domain fields only.
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

/**
 * Current FTS status values from the legacy table fixture.
 *
 * Keeping them resource-local avoids teaching generic DataTable anything
 * about document workflow vocabulary.
 */
export const DOCUMENT_STATUS_FILTER_OPTIONS = [
  {
    label: "ធម្មតា",
    value: "ធម្មតា",
  },
  {
    label: "ប្រញ៉ាប់",
    value: "ប្រញ៉ាប់",
  },
  {
    label: "ប្រញ៉ាប់ណាស់",
    value: "ប្រញ៉ាប់ណាស់",
  },
] as const;
