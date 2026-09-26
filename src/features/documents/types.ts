import type { BaseRecord } from "@refinedev/core";

export interface DocumentDetails {
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
 * Document row used by the second-resource Refine proof.
 *
 * This type intentionally normalizes the legacy FTS mock shape into the
 * semantic field names already established in documentTableQuery.ts.
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
  readonly details?: DocumentDetails;
}
