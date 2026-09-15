import { DATA_TABLE_COMPONENT_NAME } from "./constants";
import { dataTableClasses, getDataTableUtilityClass } from "./dataTableClasses";
import type { DataTableClassKey, DataTableSlotKey } from "./dataTableClasses";

/**
 * Header slots introduced by Phase 1.7.10.6C.1.
 *
 * `satisfies` ensures this fixture cannot drift away from the actual
 * class registry.
 */
const HEADER_STRUCTURAL_SLOTS = [
  "headerRow",
  "headerCell",
  "headerCellContent",
  "headerContent",
  "headerGroupLabel",
  "headerLabelTrack",
  "headerActions",
] as const satisfies readonly DataTableClassKey[];

/**
 * Body-wide state slots introduced by Phase 1.7.10.6E.3.
 */
const BODY_STATE_STRUCTURAL_SLOTS = [
  "bodyStateRow",
  "bodyStateCell",
  "emptyState",
  "loadingState",
  "errorState",
] as const satisfies readonly DataTableClassKey[];

/**
 * Detail-panel structural slots introduced by Phase 1.7.10.6E.4.
 */
const DETAIL_PANEL_STRUCTURAL_SLOTS = [
  "detailPanelRow",
  "detailPanelCell",
  "detailPanel",
] as const satisfies readonly DataTableClassKey[];

/**
 * Compile-time assertion helper.
 *
 * Passing these values through DataTableSlotKey ensures the new header
 * classes are theme slots rather than utility-only classes.
 */
function asDataTableSlot(slot: DataTableSlotKey): DataTableSlotKey {
  return slot;
}

describe("RazethDataTable utility classes", () => {
  it.each(HEADER_STRUCTURAL_SLOTS)(
    "registers %s as a stable header structural utility class",
    (slot) => {
      expect(dataTableClasses[slot]).toBe(
        `${DATA_TABLE_COMPONENT_NAME}-${slot}`,
      );

      expect(getDataTableUtilityClass(slot)).toBe(
        `${DATA_TABLE_COMPONENT_NAME}-${slot}`,
      );
    },
  );

  it("exposes header structural classes as theme slots", () => {
    const slots = HEADER_STRUCTURAL_SLOTS.map((slot) => asDataTableSlot(slot));

    expect(slots).toEqual(HEADER_STRUCTURAL_SLOTS);
  });

  it.each(BODY_STATE_STRUCTURAL_SLOTS)(
    "registers %s as a stable body-state utility class",
    (slot) => {
      expect(dataTableClasses[slot]).toBe(
        `${DATA_TABLE_COMPONENT_NAME}-${slot}`,
      );

      expect(getDataTableUtilityClass(slot)).toBe(
        `${DATA_TABLE_COMPONENT_NAME}-${slot}`,
      );
    },
  );

  it("exposes body-state structural classes as theme slots", () => {
    const slots = BODY_STATE_STRUCTURAL_SLOTS.map((slot) =>
      asDataTableSlot(slot),
    );

    expect(slots).toEqual(BODY_STATE_STRUCTURAL_SLOTS);
  });

  it.each(DETAIL_PANEL_STRUCTURAL_SLOTS)(
    "registers %s as a stable detail-panel utility class",
    (slot) => {
      expect(dataTableClasses[slot]).toBe(
        `${DATA_TABLE_COMPONENT_NAME}-${slot}`,
      );

      expect(getDataTableUtilityClass(slot)).toBe(
        `${DATA_TABLE_COMPONENT_NAME}-${slot}`,
      );
    },
  );

  it("exposes detail-panel structural classes as theme slots", () => {
    const slots = DETAIL_PANEL_STRUCTURAL_SLOTS.map((slot) =>
      asDataTableSlot(slot),
    );

    expect(slots).toEqual(DETAIL_PANEL_STRUCTURAL_SLOTS);
  });

  it("keeps utility-only global-filter classes registered separately", () => {
    expect(dataTableClasses.globalFilterFullWidth).toBe(
      `${DATA_TABLE_COMPONENT_NAME}-globalFilterFullWidth`,
    );

    expect(dataTableClasses.globalFilterClearButton).toBe(
      `${DATA_TABLE_COMPONENT_NAME}-globalFilterClearButton`,
    );
  });
});
