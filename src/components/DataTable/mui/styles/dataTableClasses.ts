import { generateUtilityClass, generateUtilityClasses } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME } from "./constants";

/**
 * We are starting the utility-class registry incrementally.
 *
 * Do not define every future DataTable slot before we actually migrate it.
 *
 * Existing components will be added during the later visual/theme audit.
 */
export const dataTableClasses = generateUtilityClasses(
  DATA_TABLE_COMPONENT_NAME,
  [
    "globalFilter",
    "globalFilterFullWidth",
    "globalFilterClearButton",
    "filterRow",
    "filterCell",
    "filterIndicator",
  ],
);

export type DataTableClassKey = keyof typeof dataTableClasses;

/** Only named styled slots have a direct styleOverrides resolver. */
export type DataTableSlotKey = Exclude<
  DataTableClassKey,
  "globalFilterFullWidth" | "globalFilterClearButton"
>;

/**
 * Generate one stable DataTable utility class.
 */
export function getDataTableUtilityClass(slot: DataTableClassKey): string {
  return generateUtilityClass(DATA_TABLE_COMPONENT_NAME, slot);
}
