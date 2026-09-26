// src/features/documents/types.ts

/**
 * Resource model used by the second DataTable/Refine proof.
 *
 * This deliberately models only the public fields consumed by the table.
 * It is not a Prisma type and does not import backend implementation details.
 */
export interface DocumentRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
}
