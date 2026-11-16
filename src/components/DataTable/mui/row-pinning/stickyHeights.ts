export interface StickyRowMeasurement {
  readonly id: string;
  readonly edge: "top" | "bottom";
  readonly height: number;
}

export interface StickyRowOffsets {
  readonly offset: number;
  readonly bottom?: number;
}

/** Independent edge bands in final displayed order; never pin insertion order. */
export function getStickyRowOffsets(
  rows: readonly StickyRowMeasurement[],
  top: number,
  dualEdge: boolean,
): ReadonlyMap<string, StickyRowOffsets> {
  const offsets = new Map<string, StickyRowOffsets>();
  const topRows = rows.filter((row) => row.edge === "top");
  let before = 0;
  let after = topRows.reduce((sum, row) => sum + row.height, 0);
  for (const row of topRows) {
    after -= row.height;
    offsets.set(row.id, {
      offset: top + before,
      ...(dualEdge ? { bottom: Math.max(0, after) } : {}),
    });
    before += row.height;
  }
  let below = 0;
  for (const row of rows.filter((row) => row.edge === "bottom").reverse()) {
    offsets.set(row.id, { offset: below });
    below += row.height;
  }
  return offsets;
}
