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
          fullscreen ? "Exit fullscreen table" : "Enter fullscreen table"
        }
        aria-pressed={fullscreen}
        onClick={toggleFullscreen}
        sx={{
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
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
