"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import {
  styled,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const PageSizeRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSize",
  overridesResolver: (_props, styles) => styles.pageSize,
})({});
const PageSizeLabelRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeLabel",
  overridesResolver: (_props, styles) => styles.pageSizeLabel,
})({ whiteSpace: "nowrap" });
const PageSizeSelectRoot = styled(Select<number>, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeSelect",
  overridesResolver: (_props, styles) => styles.pageSizeSelect,
})({ minWidth: 72 });

export interface DataTablePageSizeSelectProps {
  readonly pageSize: number;
  readonly options: readonly number[];
  readonly onChange: (pageSize: number) => void;
}

export function DataTablePageSizeSelect(props: DataTablePageSizeSelectProps) {
  const { pageSize, options, onChange } = props;

  return (
    <PageSizeRoot
      className={dataTableClasses.pageSize}
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <PageSizeLabelRoot
        className={dataTableClasses.pageSizeLabel}
        variant="body2"
        color="text.secondary"
      >
        Rows per page
      </PageSizeLabelRoot>

      <FormControl size="small">
        <PageSizeSelectRoot
          className={dataTableClasses.pageSizeSelect}
          value={pageSize}
          onChange={(event) => {
            const nextPageSize = event.target.value;

            if (typeof nextPageSize !== "number") {
              return;
            }

            onChange(nextPageSize);
          }}
          inputProps={{
            "aria-label": "Rows per page",
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </PageSizeSelectRoot>
      </FormControl>
    </PageSizeRoot>
  );
}
