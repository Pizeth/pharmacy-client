"use client";

import { IconButton, Stack, Tooltip } from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export interface DataTablePaginationActionsProps {
  readonly canPreviousPage: boolean;
  readonly canNextPage: boolean;
  readonly showFirstLastButtons: boolean;
  readonly onFirstPage: () => void;
  readonly onPreviousPage: () => void;
  readonly onNextPage: () => void;
  readonly onLastPage: () => void;
}

export function DataTablePaginationActions(
  props: DataTablePaginationActionsProps,
) {
  const {
    canPreviousPage,
    canNextPage,
    showFirstLastButtons,
    onFirstPage,
    onPreviousPage,
    onNextPage,
    onLastPage,
  } = props;

  const theme = useTheme();

  const rtl = theme.direction === "rtl";

  return (
    <Stack direction="row" alignItems="center" spacing={0.25}>
      {showFirstLastButtons && (
        <Tooltip title="First page">
          <span>
            <IconButton
              size="small"
              disabled={!canPreviousPage}
              onClick={onFirstPage}
              aria-label="First page"
            >
              {rtl ? <LastPage /> : <FirstPage />}
            </IconButton>
          </span>
        </Tooltip>
      )}

      <Tooltip title="Previous page">
        <span>
          <IconButton
            size="small"
            disabled={!canPreviousPage}
            onClick={onPreviousPage}
            aria-label="Previous page"
          >
            {rtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Next page">
        <span>
          <IconButton
            size="small"
            disabled={!canNextPage}
            onClick={onNextPage}
            aria-label="Next page"
          >
            {rtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
        </span>
      </Tooltip>

      {showFirstLastButtons && (
        <Tooltip title="Last page">
          <span>
            <IconButton
              size="small"
              disabled={!canNextPage}
              onClick={onLastPage}
              aria-label="Last page"
            >
              {rtl ? <FirstPage /> : <LastPage />}
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Stack>
  );
}
