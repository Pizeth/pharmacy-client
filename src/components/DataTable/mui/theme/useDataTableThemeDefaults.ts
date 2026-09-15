"use client";

import { useThemeProps } from "@mui/material/styles";
import { DATA_TABLE_COMPONENT_NAME } from "../styles/constants";
import type { DataTableThemeProps } from "./types";

/** Read presentation defaults without merging resource or controlled state props. */
export function useDataTableThemeDefaults(): DataTableThemeProps {
  return useThemeProps({
    props: {} as DataTableThemeProps,
    name: DATA_TABLE_COMPONENT_NAME,
  });
}
