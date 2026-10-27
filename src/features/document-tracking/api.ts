import type { ColumnFiltersState, SortingState } from "@tanstack/table-core";
import { z } from "zod";
import { API_URL, TOKEN_KEY } from "@/types/constants";
import {
  detailSchema,
  documentInputSchema,
  documentSchema,
  metadataSchema,
  progressInputSchema,
  type DocumentInput,
  type ProgressInput,
} from "./contracts";

export class TrackingRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TrackingRequestError";
  }
}
export function trackingUrl(path = "") {
  return `${API_URL.replace(/\/(?:api(?:\/v1)?)?\/?$/, "").replace(/\/$/, "")}/api/v1/document-tracking${path}`;
}
async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Promise<T> {
  const token =
    typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);
  const response = await fetch(trackingUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? body.message
        : null;
    throw new TrackingRequestError(
      typeof message === "string"
        ? message
        : `Document request failed (${response.status}).`,
      response.status,
    );
  }
  return schema.parse(
    body && typeof body === "object" && "data" in body ? body.data : body,
  );
}
export function buildTrackingQuery(
  pageIndex: number,
  pageSize: number,
  search: string,
  filters: ColumnFiltersState,
  sorting: SortingState,
) {
  return {
    page: pageIndex + 1,
    pageSize,
    sorting: sorting.map((item) => ({
      field: item.id,
      direction: item.desc ? "desc" : "asc",
    })),
    filters: filters
      .filter((item) => item.value !== "" && item.value != null)
      .map((item) => ({
        field: item.id,
        operator:
          item.id === "title" || item.id === "incomingNumber"
            ? "contains"
            : "equals",
        value:
          item.id === "assignedToId" || item.id === "responsibleDepartmentId"
            ? Number(item.value)
            : item.value,
      })),
    ...(search.trim() ? { search: { term: search.trim() } } : {}),
  };
}
export const trackingApi = {
  metadata: (signal?: AbortSignal) =>
    request("/metadata", metadataSchema, { signal }),
  list: (
    pageIndex: number,
    pageSize: number,
    search: string,
    filters: ColumnFiltersState,
    sorting: SortingState,
    signal?: AbortSignal,
  ) =>
    request(
      "/query",
      z.object({
        documents: z.array(documentSchema),
        total: z.number().int().nonnegative(),
      }),
      {
        method: "POST",
        signal,
        body: JSON.stringify(
          buildTrackingQuery(pageIndex, pageSize, search, filters, sorting),
        ),
      },
    ),
  get: (id: string, signal?: AbortSignal) =>
    request(`/${encodeURIComponent(id)}`, detailSchema, { signal }),
  save: (input: DocumentInput, record?: { id: string; version: number }) =>
    request(record ? `/${encodeURIComponent(record.id)}` : "", detailSchema, {
      method: record ? "PATCH" : "POST",
      body: JSON.stringify({
        ...documentInputSchema.parse(input),
        ...(record ? { version: record.version } : {}),
      }),
    }),
  progress: (id: string, input: ProgressInput) =>
    request(`/${encodeURIComponent(id)}/progress`, detailSchema, {
      method: "POST",
      body: JSON.stringify(progressInputSchema.parse(input)),
    }),
  archive: (id: string, version: number, note: string) =>
    request(`/${encodeURIComponent(id)}`, detailSchema, {
      method: "DELETE",
      body: JSON.stringify({ version, note }),
    }),
  attachment: (
    id: string,
    version: number,
    input: {
      name: string;
      url: string;
      kind: "INCOMING" | "OUTGOING" | "SUPPORTING";
    },
  ) =>
    request(`/${encodeURIComponent(id)}/attachments`, detailSchema, {
      method: "POST",
      body: JSON.stringify({ version, ...input }),
    }),
};
