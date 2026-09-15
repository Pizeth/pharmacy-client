"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { IconButton, Stack, Tooltip, styled } from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const PaginationActionsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationActions",
  overridesResolver: (_props, styles) => styles.paginationActions,
})({});
const PaginationButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationButton",
  overridesResolver: (_props, styles) => styles.paginationButton,
})({});

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
    <PaginationActionsRoot
      className={dataTableClasses.paginationActions}
      direction="row"
      alignItems="center"
      spacing={0.25}
    >
      {showFirstLastButtons && (
        <Tooltip title="First page">
          <span>
            <PaginationButtonRoot
              className={dataTableClasses.paginationButton}
              size="small"
              disabled={!canPreviousPage}
              onClick={onFirstPage}
              aria-label="First page"
            >
              {rtl ? <LastPage /> : <FirstPage />}
            </PaginationButtonRoot>
          </span>
        </Tooltip>
      )}

      <Tooltip title="Previous page">
        <span>
          <PaginationButtonRoot
            className={dataTableClasses.paginationButton}
            size="small"
            disabled={!canPreviousPage}
            onClick={onPreviousPage}
            aria-label="Previous page"
          >
            {rtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </PaginationButtonRoot>
        </span>
      </Tooltip>

      <Tooltip title="Next page">
        <span>
          <PaginationButtonRoot
            className={dataTableClasses.paginationButton}
            size="small"
            disabled={!canNextPage}
            onClick={onNextPage}
            aria-label="Next page"
          >
            {rtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </PaginationButtonRoot>
        </span>
      </Tooltip>

      {showFirstLastButtons && (
        <Tooltip title="Last page">
          <span>
            <PaginationButtonRoot
              className={dataTableClasses.paginationButton}
              size="small"
              disabled={!canNextPage}
              onClick={onLastPage}
              aria-label="Last page"
            >
              {rtl ? <FirstPage /> : <LastPage />}
            </PaginationButtonRoot>
          </span>
        </Tooltip>
      )}
    </PaginationActionsRoot>
  );
}
