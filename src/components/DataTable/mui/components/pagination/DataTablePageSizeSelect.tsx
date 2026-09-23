"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import {
  styled,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PageSizeRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSize",
  overridesResolver: (_props, styles) => styles.pageSize,
})(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(0.75),
  flex: "0 0 auto",
}));
const PageSizeLabelRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeLabel",
  overridesResolver: (_props, styles) => styles.pageSizeLabel,
})({ whiteSpace: "nowrap" });
const PageSizeSelectRoot = styled(Select<number>, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeSelect",
  overridesResolver: (_props, styles) => styles.pageSizeSelect,
})({
  minWidth: 52,
  flex: "0 0 auto",
});

export interface DataTablePageSizeSelectProps {
  readonly pageSize: number;
  readonly options: readonly number[];
  readonly onChange: (pageSize: number) => void;
}

export function DataTablePageSizeSelect(props: DataTablePageSizeSelectProps) {
  const { pageSize, options, onChange } = props;

  const { direction } = useTheme();

  return (
    <PageSizeRoot className={dataTableClasses.pageSize}>
      <PageSizeLabelRoot
        className={dataTableClasses.pageSizeLabel}
        variant="body2"
        color="text.secondary"
      >
        Rows per page
      </PageSizeLabelRoot>

      <PageSizeSelectRoot
        className={dataTableClasses.pageSizeSelect}
        value={pageSize}
        size="small"
        variant="standard"
        MenuProps={{
          dir: direction,
        }}
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
    </PageSizeRoot>
  );
}
