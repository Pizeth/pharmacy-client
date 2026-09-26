// src/features/documents/types.ts

import type { BaseRecord } from "@refinedev/core";

/**
 * Nested document workflow details carried by the existing FTS fixture.
 *
 * The second-resource Refine proof intentionally preserves the useful shape
 * already exercised by the legacy MRT screen instead of inventing a different
 * demo model.
 */
export interface DocumentWorkflowDetails {
  readonly originId?: string;
  readonly acceptedDate: string;
  readonly acceptedTime: string;
  readonly originDoc?: string;
  readonly recieptant: string;
  readonly currentProcessor: string;
  readonly deliverBy: string;
  readonly note?: string;
  readonly recievedBy: string;
  readonly retrievedBy: string;
  readonly retreivedDate: string;
  readonly stampedBy?: string;
  readonly stampedDate?: string;
  readonly issuanceNumber?: string;
  readonly issuanceDate?: string;
  readonly lastRecipient: string;
  readonly finishedDoc?: string;
  readonly shelveNo?: string;
  readonly archiveNo?: string;
  readonly docSequence?: string;
}

/**
 * Canonical row consumed by the modern Document DataTable.
 *
 * The property names deliberately match the semantic query mapping already
 * established in documentTableQuery.ts:
 *
 *   documentNumber
 *   title
 *   status
 *   processingDays
 *   isEnabled
 *
 * Legacy MRT fixture names such as "days" are translated at the fixture
 * provider boundary instead of leaking into the new resource architecture.
 */
export interface DocumentRecord extends BaseRecord {
  readonly id: number;
  readonly documentNumber: string;
  readonly title: string;
  readonly status: string;
  readonly processingDays: number;
  readonly type: string;
  readonly category: string;
  readonly office: string;
  readonly isEnabled: boolean;
  readonly description?: string;
  readonly createdAt: string;
  readonly details?: DocumentWorkflowDetails;
}
