"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../../styles";

// src/components/DataTable/mui/components/toolbar/actions/DataTableFullscreenButton.tsx

import { styled, IconButton, Tooltip } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { useDataTableFullscreen } from "../../../fullscreen";

const FullscreenButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FullscreenButton",
  overridesResolver: (_props, styles) => styles.fullscreenButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export function DataTableFullscreenButton() {
  const { fullscreen, toggleFullscreen } = useDataTableFullscreen();

  return (
    <Tooltip title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
      <FullscreenButtonRoot
        className={dataTableClasses.fullscreenButton}
        size="small"
        aria-label={
          fullscreen ? "Exit fullscreen table" : "Enter fullscreen table"
        }
        aria-pressed={fullscreen}
        onClick={toggleFullscreen}
      >
        {fullscreen ? (
          <FullscreenExit fontSize="small" />
        ) : (
          <Fullscreen fontSize="small" />
        )}
      </FullscreenButtonRoot>
    </Tooltip>
  );
}
