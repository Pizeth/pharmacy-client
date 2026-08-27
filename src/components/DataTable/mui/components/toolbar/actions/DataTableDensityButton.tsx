"use client";

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { DensityLarge, DensityMedium, DensitySmall } from "@mui/icons-material";
import { useState } from "react";
import type { MouseEvent } from "react";
import { useDataTableDensity } from "../../../density";
import type { MuiDataTableDensity } from "../../../density";

interface DensityOption {
  readonly value: MuiDataTableDensity;
  readonly label: string;
  readonly icon: typeof DensitySmall;
}

const DENSITY_OPTIONS: readonly DensityOption[] = [
  {
    value: "compact",
    label: "Compact",
    icon: DensitySmall,
  },

  {
    value: "comfortable",
    label: "Comfortable",
    icon: DensityMedium,
  },

  {
    value: "spacious",
    label: "Spacious",
    icon: DensityLarge,
  },
];

/**
 * Explicit three-option density selector.
 *
 * MRT cycles through densities using one button. We deliberately expose
 * a menu because the current state and destination are clearer to users.
 */
export function DataTableDensityButton() {
  const { density, setDensity } = useDataTableDensity();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = anchorEl !== null;

  const currentOption =
    DENSITY_OPTIONS.find((option) => option.value === density) ??
    DENSITY_OPTIONS[1];

  const CurrentIcon = currentOption.icon;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={`Density: ${currentOption.label}`}>
        <IconButton
          size="small"
          aria-label="Change table density"
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          <CurrentIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            dense: density === "compact",
            "aria-label": "Table density",
          },
        }}
        // MenuListProps={{
        //   dense: density === "compact",
        //   "aria-label": "Table density",
        // }}
      >
        {DENSITY_OPTIONS.map((option) => {
          const Icon = option.icon;

          const selected = option.value === density;

          return (
            <MenuItem
              key={option.value}
              selected={selected}
              onClick={() => {
                setDensity(option.value);

                handleClose();
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>

              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
