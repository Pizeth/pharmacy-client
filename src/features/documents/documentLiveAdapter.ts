// src/features/documents/documentLiveAdapter.ts

import type {
  LiveEvent,
} from "@refinedev/core";

import type {
  DataTableLiveUpdatedRecordStabilityProof,
  RefineDataTableLiveEventAdapter,
} from "@/components/DataTable";

import {
  DOCUMENT_REFINE_RESOURCE,
} from "./documentTableRefineAdapter";
import type {
  DocumentRecord,
} from "./types";

function readRequiredIdentity(
  value: unknown,
  label: string,
): string | number {
  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return value;
  }

  throw new Error(
    `Document live event requires ${label}.`,
  );
}

function isDocumentRecord(
  value: unknown,
): value is DocumentRecord {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return false;
  }

  const record =
    value as Partial<DocumentRecord>;

  return (
    typeof record.id === "number" &&
    typeof record.documentNumber === "string" &&
    typeof record.title === "string" &&
    typeof record.status === "string" &&
    typeof record.processingDays === "number" &&
    typeof record.isEnabled === "boolean" &&
    typeof record.createdAt === "string"
  );
}

/**
 * Explicit Refine payload contract for the Document realtime proof.
 *
 * No generic Refine adapter guesses eventId/recordId/record fields.
 */
export const documentRefineLiveEventAdapter:
  RefineDataTableLiveEventAdapter<DocumentRecord> = {
    resource: DOCUMENT_REFINE_RESOURCE,

    getEventId: (event) =>
      readRequiredIdentity(
        event.payload.eventId,
        "payload.eventId",
      ),

    getRecordId: (event) => {
      const value = event.payload.id;

      if (value === undefined) {
        return undefined;
      }

      return readRequiredIdentity(
        value,
        "payload.id",
      );
    },

    readRecord: (event) => {
      const record = event.payload.record;

      return isDocumentRecord(record)
        ? record
        : undefined;
    },

    /**
     * Fixture reconnect notification means the current query should be
     * revalidated. Standard CRUD events keep their standard names.
     */
    mapType: (event: LiveEvent) => {
      switch (event.type) {
        case "created":
        case "updated":
        case "deleted":
          return event.type;

        case "reconnected":
          return "invalidate";

        default:
          return undefined;
      }
    },

    getRevision: (event) => {
      const revision =
        event.payload.revision;

      return typeof revision === "string" ||
        typeof revision === "number"
        ? revision
        : undefined;
    },
  };

/**
 * Document fixture/proof can safely patch an already-visible update only when
 * no semantic query transformation is active.
 *
 * Under the fixture provider's default ordering, changing non-ID fields then
 * cannot affect membership, ordering, rowCount or pageCount.
 *
 * Any active search/filter/sort selects the conservative generic refetch path.
 */
export const canReconcileDocumentLiveUpdate:
  DataTableLiveUpdatedRecordStabilityProof<DocumentRecord> = ({
    query,
    currentRow,
    nextRow,
  }) =>
    currentRow.id === nextRow.id &&
    query.sorting.length === 0 &&
    query.columnFilters.length === 0 &&
    query.globalFilter.trim().length === 0;
