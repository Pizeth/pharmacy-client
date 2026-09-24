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
  height: 28,
}));
const PageSizeLabelRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeLabel",
  overridesResolver: (_props, styles) => styles.pageSizeLabel,
})({
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  height: 28,
  lineHeight: "28px",
});
const PageSizeSelectRoot = styled(Select<number>, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeSelect",
  overridesResolver: (_props, styles) => styles.pageSizeSelect,
})(({ theme }) => ({
  minWidth: 52,
  height: 28,
  flex: "0 0 auto",
  fontSize: theme.typography.body2.fontSize,

  /**
   * MUI's standard Select keeps text on an input-style baseline with
   * its own vertical padding. In the pagination footer that made the
   * page-size value sit visibly lower than the adjacent range text.
   *
   * Give the select the same 28px visual line box as the footer text
   * and navigation controls while preserving the standard underline.
   */
  "& .MuiSelect-select": {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    height: 28,
    minHeight: "0 !important",
    paddingTop: 0,
    paddingBottom: 0,
    paddingInlineStart: theme.spacing(0.5),
    paddingInlineEnd: `${theme.spacing(3)} !important`,
    lineHeight: "28px",
  },

  "& .MuiSelect-icon": {
    top: "50%",
    transform: "translateY(-50%)",
  },
}));

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
        renderValue={(value) => (
          <Typography component="span" variant="body2">
            {value}
          </Typography>
        )}
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
            <Typography component="span" variant="body2">
              {option}
            </Typography>
          </MenuItem>
        ))}
      </PageSizeSelectRoot>
    </PageSizeRoot>
  );
}
