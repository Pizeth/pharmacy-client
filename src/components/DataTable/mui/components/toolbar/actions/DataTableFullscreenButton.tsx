"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { useDataTableFullscreen } from "../../../fullscreen";

export function DataTableFullscreenButton() {
  const { fullscreen, toggleFullscreen } = useDataTableFullscreen();

  return (
    <Tooltip title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
      <IconButton
        size="small"
        aria-label={
          fullscreen ? "Exit table fullscreen" : "Enter table fullscreen"
        }
        aria-pressed={fullscreen}
        onClick={toggleFullscreen}
      >
        {fullscreen ? (
          <FullscreenExit fontSize="small" />
        ) : (
          <Fullscreen fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
