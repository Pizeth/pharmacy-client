// mui/components/column-manager/DataTableColumnManagerButton.tsx

"use client";

import { IconButton, Tooltip } from "@mui/material";
import { ViewColumnOutlined } from "@mui/icons-material";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnManager } from "./DataTableColumnManager";
import type { DataTableColumnManagerConfig } from "./types";

export interface DataTableColumnManagerButtonProps<
  TData extends RowData,
> extends DataTableColumnManagerConfig {
  readonly table: MuiDataTableInstance<TData>;
}

export function DataTableColumnManagerButton<TData extends RowData>(
  props: DataTableColumnManagerButtonProps<TData>,
) {
  const { table, ...managerConfig } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = anchorEl !== null;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Manage columns">
        <IconButton
          size="small"
          aria-label="Manage table columns"
          aria-haspopup="dialog"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          <ViewColumnOutlined fontSize="small" />
        </IconButton>
      </Tooltip>

      <DataTableColumnManager
        table={table}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        {...managerConfig}
      />
    </>
  );
}
