import type { BaseRecord } from "@refinedev/core";

import type { Data as LegacyDocumentRow } from "@/components/fts/mockData";

/**
 * Document row consumed by the modern DataTable/Refine proof.
 *
 * The existing FTS screen is still backed by generated fixture data. This
 * normalized resource type deliberately uses the same public field names as
 * documentTableSemanticQuery so replacing the proof provider with the real
 * document API later will not require another renderer rewrite.
 */
export interface DocumentRecord extends BaseRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly description?: string;
  readonly status: string;
  readonly processingDays: number;
  readonly documentType: string;
  readonly category: string;
  readonly office: string;
  readonly isEnabled: boolean;
  readonly createdAt: string;

  /**
   * Keep the legacy detail payload while FTS still uses generated fixture
   * records. It is presentation data only and never participates in server
   * query mapping.
   */
  readonly details?: LegacyDocumentRow["details"];
}
