/**
 * Scalar values supported by a DataTable select filter.
 */
export type DataTableSelectFilterValue = string | number | boolean;

/**
 * Encode one scalar filter value into a string suitable for MUI Select.
 *
 * Prefixing the primitive type prevents collisions such as:
 *
 *   "1"
 *
 * versus:
 *
 *   1
 */
export function encodeDataTableSelectFilterValue(
  value: DataTableSelectFilterValue,
): string {
  switch (typeof value) {
    case "boolean":
      return value ? "boolean:true" : "boolean:false";

    case "number":
      return `number:${value}`;

    case "string":
      return `string:${value}`;
  }
}

/**
 * Decode an encoded MUI Select value back into DataTable's scalar
 * filter representation.
 */
export function decodeDataTableSelectFilterValue(
  encoded: string,
): DataTableSelectFilterValue {
  if (encoded.startsWith("boolean:")) {
    return encoded === "boolean:true";
  }

  if (encoded.startsWith("number:")) {
    return Number(encoded.slice("number:".length));
  }

  return encoded.slice("string:".length);
}
