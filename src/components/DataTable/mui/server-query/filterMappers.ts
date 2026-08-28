// src/components/DataTable/mui/server-query/filterMappers.ts

import type { DataTableNumberRangeValue } from "../components/filtering";
import type {
  DataTableServerFilterDescriptor,
  DataTableServerFilterMapper,
  DataTableServerFilterScalar,
} from "./types";

/**
 * Runtime guard for DataTable's supported scalar server values.
 */
function isServerFilterScalar(
  value: unknown,
): value is DataTableServerFilterScalar {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/**
 * Runtime guard for the number-range representation already used by
 * the MUI filtering layer.
 */
function isNumberRangeValue(
  value: unknown,
): value is DataTableNumberRangeValue {
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }

  const [min, max] = value;

  return (
    (min === undefined || typeof min === "number") &&
    (max === undefined || typeof max === "number")
  );
}

/**
 * Text filter:
 *
 * TanStack value:
 *
 *   "hello"
 *
 * semantic query:
 *
 *   {
 *     field,
 *     operator: "contains",
 *     value: "hello"
 *   }
 */
export function createDataTableTextServerFilter(
  field: string,
): DataTableServerFilterMapper {
  return (value) => {
    if (typeof value !== "string") {
      return [];
    }

    const normalized = value.trim();

    if (normalized.length === 0) {
      return [];
    }

    return [
      {
        field,
        operator: "contains",
        value: normalized,
      },
    ];
  };
}

/**
 * Exact numeric filter.
 */
export function createDataTableNumberServerFilter(
  field: string,
): DataTableServerFilterMapper {
  return (value) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return [];
    }

    return [
      {
        field,
        operator: "equals",
        value,
      },
    ];
  };
}

/**
 * Exact boolean filter.
 */
export function createDataTableBooleanServerFilter(
  field: string,
): DataTableServerFilterMapper {
  return (value) => {
    if (typeof value !== "boolean") {
      return [];
    }

    return [
      {
        field,
        operator: "equals",
        value,
      },
    ];
  };
}

/**
 * Exact select filter.
 *
 * Supports the scalar values already allowed by
 * MuiDataTableFilterOption:
 *
 *   string
 *   number
 *   boolean
 */
export function createDataTableSelectServerFilter(
  field: string,
): DataTableServerFilterMapper {
  return (value) => {
    if (!isServerFilterScalar(value)) {
      return [];
    }

    return [
      {
        field,
        operator: "equals",
        value,
      },
    ];
  };
}

/**
 * Number-range filter.
 *
 * Instead of leaking a tuple into the backend protocol, each present
 * boundary becomes its own semantic operation.
 *
 * [18, 65]
 *
 * becomes:
 *
 *   age >= 18
 *   age <= 65
 *
 *
 * [18, undefined]
 *
 * becomes:
 *
 *   age >= 18
 */
export function createDataTableNumberRangeServerFilter(
  field: string,
): DataTableServerFilterMapper {
  return (value) => {
    if (!isNumberRangeValue(value)) {
      return [];
    }

    const [min, max] = value;

    const filters: DataTableServerFilterDescriptor[] = [];

    if (min !== undefined) {
      filters.push({
        field,
        operator: "gte",
        value: min,
      });
    }

    if (max !== undefined) {
      filters.push({
        field,
        operator: "lte",
        value: max,
      });
    }

    return filters;
  };
}

/**
 * Generic scalar exact-match mapper.
 *
 * Useful for application-specific column variants that still resolve
 * to a scalar equality condition.
 */
export function createDataTableScalarServerFilter(
  field: string,
): DataTableServerFilterMapper {
  return (value) => {
    if (!isServerFilterScalar(value)) {
      return [];
    }

    return [
      {
        field,
        operator: "equals",
        value,
      },
    ];
  };
}
