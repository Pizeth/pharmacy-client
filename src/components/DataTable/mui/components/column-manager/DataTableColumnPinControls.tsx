// mui/components/column-manager/DataTableColumnPinControls.tsx

"use client";

import { IconButton, Stack, Tooltip } from "@mui/material";
import { PushPinOutlined } from "@mui/icons-material";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import { getColumnManagerLabel } from "./getColumnManagerLabel";

export interface DataTableColumnPinControlsProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
}

/**
 * Logical start/end column pinning controls.
 *
 * TanStack v9 owns the actual pinning state.
 */
export function DataTableColumnPinControls<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnPinControlsProps<TData, TValue>) {
  const { column } = props;

  const label = getColumnManagerLabel(column);

  const canPin = column.getCanPin();

  if (!canPin) {
    return null;
  }

  const pinned = column.getIsPinned();

  const pinnedStart = pinned === "start";

  const pinnedEnd = pinned === "end";

  const handleStart = (): void => {
    /**
     * Clicking the active pin button acts as unpin.
     */
    column.pin(pinnedStart ? false : "start");
  };

  const handleEnd = (): void => {
    column.pin(pinnedEnd ? false : "end");
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0}
      sx={{
        flexShrink: 0,
      }}
    >
      <Tooltip title={pinnedStart ? "Unpin" : "Pin to start"}>
        <IconButton
          size="small"
          color={pinnedStart ? "primary" : "default"}
          aria-label={
            pinnedStart ? `Unpin ${label} from start` : `Pin ${label} to start`
          }
          aria-pressed={pinnedStart}
          onClick={(event) => {
            event.stopPropagation();

            handleStart();
          }}
          sx={{
            width: 28,
            height: 28,

            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          <PushPinOutlined
            fontSize="small"
            sx={{
              /**
               * Visual distinction only.
               *
               * Pinning semantics remain logical start/end.
               */
              transform: "rotate(-90deg)",
            }}
          />
        </IconButton>
      </Tooltip>

      <Tooltip title={pinnedEnd ? "Unpin" : "Pin to end"}>
        <IconButton
          size="small"
          color={pinnedEnd ? "primary" : "default"}
          aria-label={
            pinnedEnd ? `Unpin ${label} from end` : `Pin ${label} to end`
          }
          aria-pressed={pinnedEnd}
          onClick={(event) => {
            event.stopPropagation();

            handleEnd();
          }}
          sx={{
            width: 28,
            height: 28,

            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          <PushPinOutlined
            fontSize="small"
            sx={{
              transform: "rotate(90deg)",
            }}
          />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
