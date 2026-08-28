// src/components/DataTable/adapters/standard-api/index.ts

export * from "./query";

export {
  adaptStandardPaginatedResponse,
  createStandardPaginatedResponseAdapter,
} from "./adaptStandardPaginatedResponse";

export type {
  StandardApiPaginatedData,
  StandardApiPaginatedResponse,
  StandardApiPaginationMetadata,
  StandardApiResponse,
} from "./types";
