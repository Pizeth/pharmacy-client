"use client";

import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

export interface DataTablePageSizeSelectProps {
  readonly pageSize: number;
  readonly options: readonly number[];
  readonly onChange: (pageSize: number) => void;
}

export function DataTablePageSizeSelect(props: DataTablePageSizeSelectProps) {
  const { pageSize, options, onChange } = props;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        Rows per page
      </Typography>

      <FormControl size="small">
        <Select<number>
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
          sx={{
            minWidth: 72,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
