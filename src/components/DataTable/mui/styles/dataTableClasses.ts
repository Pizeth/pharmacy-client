import { generateUtilityClass, generateUtilityClasses } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME } from "./constants";

// /**
//  * Themeable/stable visual slots belonging to the DataTable family.
//  *
//  * These are semantic visual slots rather than implementation-specific
//  * DOM-node names.
//  */
// export interface DataTableClasses {
//   readonly root: string;

//   readonly shell: string;

//   readonly toolbar: string;
//   readonly toolbarStart: string;
//   readonly toolbarCenter: string;
//   readonly toolbarEnd: string;

//   readonly tableContainer: string;
//   readonly table: string;

//   readonly head: string;

//   readonly headerRow: string;
//   readonly headerCell: string;
//   readonly headerCellContent: string;
//   readonly headerLabel: string;
//   readonly headerActions: string;

//   readonly resizeHandle: string;

//   readonly filterRow: string;
//   readonly filterCell: string;

//   readonly body: string;
//   readonly bodyRow: string;
//   readonly bodyCell: string;

//   readonly pagination: string;

//   readonly selectionBar: string;

//   /**
//    * Visual state hooks.
//    */
//   readonly pinned: string;
//   readonly sorted: string;
//   readonly filtered: string;
//   readonly selected: string;
//   readonly resizing: string;
//   readonly loading: string;
// }

// /**
//  * Generate one stable DataTable utility class.
//  *
//  * Example:
//  *
//  *   getDataTableUtilityClass("headerCell")
//  *
//  * becomes something comparable to:
//  *
//  *   RazethDataTable-headerCell
//  */
// export function getDataTableUtilityClass(slot: keyof DataTableClasses): string {
//   return generateUtilityClass(DATA_TABLE_COMPONENT_NAME, slot);
// }

// /**
//  * Stable utility classes used internally and available to application
//  * themes/styles.
//  */
// export const dataTableClasses: DataTableClasses = generateUtilityClasses(
//   DATA_TABLE_COMPONENT_NAME,
//   [
//     "root",

//     "shell",

//     "toolbar",
//     "toolbarStart",
//     "toolbarCenter",
//     "toolbarEnd",

//     "tableContainer",
//     "table",

//     "head",

//     "headerRow",
//     "headerCell",
//     "headerCellContent",
//     "headerLabel",
//     "headerActions",

//     "resizeHandle",

//     "filterRow",
//     "filterCell",

//     "body",
//     "bodyRow",
//     "bodyCell",

//     "pagination",

//     "selectionBar",

//     "pinned",
//     "sorted",
//     "filtered",
//     "selected",
//     "resizing",
//     "loading",
//   ],
// );

/**
 * We are starting the utility-class registry incrementally.
 *
 * Do not define every future DataTable slot before we actually migrate it.
 *
 * Existing components will be added during the later visual/theme audit.
 */
export const dataTableClasses = generateUtilityClasses(
  DATA_TABLE_COMPONENT_NAME,
  ["globalFilter", "globalFilterFullWidth", "globalFilterClearButton"],
);

export type DataTableClassKey = keyof typeof dataTableClasses;

/**
 * Generate one stable DataTable utility class.
 */
export function getDataTableUtilityClass(slot: DataTableClassKey): string {
  return generateUtilityClass(DATA_TABLE_COMPONENT_NAME, slot);
}
