import type {
  ExpandedState,
  RowPinningState,
  RowSelectionState,
} from "@tanstack/table-core";

import {
  createDataTableLiveVisibleRowIdSet,
  reconcileDataTableLiveExpanded,
  reconcileDataTableLiveRowPinning,
  reconcileDataTableLiveRowSelection,
  reconcileDataTableLiveTableState,
  removeDataTableLiveRecordFromExpanded,
  removeDataTableLiveRecordFromRowPinning,
  removeDataTableLiveRecordFromRowSelection,
  resolveDataTableLiveSafePageIndex,
} from "./tableStateSafety";

interface Row {
  readonly id: number;
}

const visibleRows: readonly Row[] = [
  { id: 1 },
  { id: 3 },
];

const visibleRowIds =
  createDataTableLiveVisibleRowIdSet(
    visibleRows,
    (row) => row.id,
  );

describe("DataTable live table-state safety", () => {
  it("normalizes canonical loaded row IDs", () => {
    expect([...visibleRowIds]).toEqual([
      "1",
      "3",
    ]);
  });

  it("removes stale selection IDs while preserving the previous object when unchanged", () => {
    const selection: RowSelectionState = {
      "1": true,
      "2": true,
      "3": true,
    };

    expect(
      reconcileDataTableLiveRowSelection(
        selection,
        visibleRowIds,
      ),
    ).toEqual({
      "1": true,
      "3": true,
    });

    const alreadySafe: RowSelectionState = {
      "1": true,
      "3": true,
    };

    expect(
      reconcileDataTableLiveRowSelection(
        alreadySafe,
        visibleRowIds,
      ),
    ).toBe(alreadySafe);
  });

  it("removes stale top and bottom row-pinning IDs", () => {
    const pinning: RowPinningState = {
      top: ["1", "2"],
      bottom: ["3", "4"],
    };

    expect(
      reconcileDataTableLiveRowPinning(
        pinning,
        visibleRowIds,
      ),
    ).toEqual({
      top: ["1"],
      bottom: ["3"],
    });
  });

  it("removes stale expansion IDs but preserves TanStack expanded=true", () => {
    const expanded: ExpandedState = {
      "1": true,
      "2": true,
      "3": true,
    };

    expect(
      reconcileDataTableLiveExpanded(
        expanded,
        visibleRowIds,
      ),
    ).toEqual({
      "1": true,
      "3": true,
    });

    expect(
      reconcileDataTableLiveExpanded(
        true,
        visibleRowIds,
      ),
    ).toBe(true);
  });

  it("reconciles all identity-bearing state families together", () => {
    const selection: RowSelectionState = {
      "1": true,
      "2": true,
    };

    const pinning: RowPinningState = {
      top: ["2"],
      bottom: ["3"],
    };

    const expanded: ExpandedState = {
      "2": true,
      "3": true,
    };

    const result =
      reconcileDataTableLiveTableState(
        {
          rowSelection: selection,
          rowPinning: pinning,
          expanded,
        },
        visibleRowIds,
      );

    expect(result).toEqual({
      rowSelection: {
        "1": true,
      },
      rowPinning: {
        top: [],
        bottom: ["3"],
      },
      expanded: {
        "3": true,
      },
      rowSelectionChanged: true,
      rowPinningChanged: true,
      expandedChanged: true,
    });
  });

  it("removes a known deleted record immediately from selection, pinning and expansion", () => {
    const selection: RowSelectionState = {
      "1": true,
      "2": true,
    };

    const pinning: RowPinningState = {
      top: ["1", "2"],
      bottom: [],
    };

    const expanded: ExpandedState = {
      "1": true,
      "2": true,
    };

    expect(
      removeDataTableLiveRecordFromRowSelection(
        selection,
        "2",
      ),
    ).toEqual({
      "1": true,
    });

    expect(
      removeDataTableLiveRecordFromRowPinning(
        pinning,
        "2",
      ),
    ).toEqual({
      top: ["1"],
      bottom: [],
    });

    expect(
      removeDataTableLiveRecordFromExpanded(
        expanded,
        "2",
      ),
    ).toEqual({
      "1": true,
    });
  });

  it("preserves references when a deleted ID is not represented in a state family", () => {
    const selection: RowSelectionState = {
      "1": true,
    };

    const pinning: RowPinningState = {
      top: ["1"],
      bottom: [],
    };

    const expanded: ExpandedState = {
      "1": true,
    };

    expect(
      removeDataTableLiveRecordFromRowSelection(
        selection,
        "9",
      ),
    ).toBe(selection);

    expect(
      removeDataTableLiveRecordFromRowPinning(
        pinning,
        "9",
      ),
    ).toBe(pinning);

    expect(
      removeDataTableLiveRecordFromExpanded(
        expanded,
        "9",
      ),
    ).toBe(expanded);
  });

  it("recovers only out-of-range server pages", () => {
    expect(
      resolveDataTableLiveSafePageIndex(2, 3),
    ).toBe(2);

    expect(
      resolveDataTableLiveSafePageIndex(3, 3),
    ).toBe(2);

    expect(
      resolveDataTableLiveSafePageIndex(7, 1),
    ).toBe(0);

    expect(
      resolveDataTableLiveSafePageIndex(4, 0),
    ).toBe(0);

    expect(
      resolveDataTableLiveSafePageIndex(4, -1),
    ).toBe(4);
  });
});
