"use client";

import { memo, type ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../table";

type Source = MuiDataTableInstance<RowData>["Subscribe"];
type Common = {
  readonly Subscribe: Source;
  /** Stable callback; changing external inputs must change its identity. */
  readonly render: () => ReactNode;
};

export type SelectionDependencyBoundaryProps = Common & (
  | { readonly selectionDependency: "row"; readonly rowId: string }
  | { readonly selectionDependency?: "global"; readonly rowId?: never }
);

/**
 * Experimental output contract, deliberately not exported from the MUI barrel.
 * It owns no state. Unknown output subscribes to the complete authoritative
 * snapshot. Only an explicit local output may omit OTHER rows' selection.
 * All non-selection state and normal changed React inputs still invalidate it.
 * A global descendant keeps its own subscription even when this parent skips.
 */
export function SelectionDependencyBoundary(props: SelectionDependencyBoundaryProps) {
  if (props.selectionDependency === "row") return <LocalOutput {...props} />;
  const { Subscribe, render } = props;
  return <Subscribe selector={state => state}>{() => render()}</Subscribe>;
}

const LocalOutput = memo(function LocalOutput({ Subscribe, render, rowId }: Common & {
  readonly rowId: string;
}) {
  return <Subscribe selector={state => {
    const { rowSelection, ...otherState } = state;
    return { ...otherState, ownSelection: Boolean(rowSelection[rowId]) };
  }}>{() => render()}</Subscribe>;
});
