// src/components/DataTable/adapters/standard-api/types.ts

/**
 * Successful API envelope produced by the application's global
 * TransformInterceptor.
 *
 * The DataTable adapter does not care that NestJS created this
 * envelope. It only cares about the wire contract.
 */
export interface StandardApiResponse<TData> {
  readonly requestStatus: "SUCCESS";
  readonly statusCode: number;
  readonly statusText: string;

  /**
   * Some successful endpoints move a controller-returned message into
   * the response envelope.
   */
  readonly message?: string;
  readonly data: TData;
}

/**
 * Backend pagination metadata.
 *
 * Important:
 *
 * backend pages are 1-based:
 *
 *   page = 1
 *
 * TanStack pagination remains:
 *
 *   pageIndex = 0
 *
 * That translation belongs to our generic DataTable query layer,
 * not this resource.
 */
export interface StandardApiPaginationMetadata {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

/**
 * Shape returned by DBHelper.getPaginatedData().
 */
export interface StandardApiPaginatedData<TData> {
  readonly data: TData[];
  readonly metadata: StandardApiPaginationMetadata;
}

/**
 * Final successful HTTP shape for one paginated endpoint:
 *
 * {
 *   requestStatus,
 *   statusCode,
 *   statusText,
 *   data: {
 *     data: [...],
 *     metadata: {...}
 *   }
 * }
 */
export type StandardApiPaginatedResponse<TData> = StandardApiResponse<
  StandardApiPaginatedData<TData>
>;
