// src/features/documents/types.ts

/**
 * Canonical document row used by the modern DataTable proof.
 *
 * The legacy FTS components still own their older mock shape:
 *
 *   title
 *   days
 *   types
 *   categories
 *   ...
 *
 * This feature intentionally defines the public row contract expected by the
 * semantic query that already existed in:
 *
 *   documentTableQuery.ts
 *
 * so the migration does not force the generic DataTable to understand legacy
 * presentation names.
 */
export interface DocumentRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly processingDays: number;
  readonly documentType: string;
  readonly category: string;
  readonly office: string;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}

export const DOCUMENT_STATUSES = [
  "ធម្មតា",
  "ប្រញាប់",
  "ប្រញាប់ណាស់",
] as const;

export const DOCUMENT_TYPES = [
  "ឯកសារមុខការ",
  "រដ្ឋបាល",
  "ហិរញ្ញវត្ថុ",
  "បុគ្គលិក",
  "បច្ចេកទេស",
] as const;

export const DOCUMENT_CATEGORIES = [
  "ទំនេរគ្មានបៀវត្ស",
  "ដំឡើងថ្នាក់",
  "តែងតាំង",
  "ផ្ទេរភារកិច្ច",
  "ចូលនិវត្តន៍",
  "សំណើសុំច្បាប់ឈប់សម្រាក",
] as const;

export const DOCUMENT_OFFICES = [
  "ការិយាល័យបុគ្គលិក",
  "ការិយាល័យក្របខណ្ឌនិងបៀវត្ស",
  "ការិយាល័យអភិវឌ្ឍធនធានមនុស្ស",
  "ការិយាល័យកិច្ចការទូទៅ",
] as const;
