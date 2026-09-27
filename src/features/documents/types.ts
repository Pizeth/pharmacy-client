import type { BaseKey, BaseRecord } from "@refinedev/core";

/**
 * Canonical row shape used by the modern Document DataTable proof.
 *
 * This type intentionally models the public resource fields already referenced
 * by documentTableSemanticQuery rather than the legacy MRT mock shape.
 *
 * The second-resource proof must demonstrate that DataTable/Refine integration
 * is reusable without coupling the new stack to:
 *
 * - MRT row types
 * - component-local mock data
 * - Prisma models
 */
export interface DocumentRecord extends BaseRecord {
  readonly id: BaseKey;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string | null;
  readonly status: string;
  readonly processingDays: number;
  readonly isEnabled: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string;
}
