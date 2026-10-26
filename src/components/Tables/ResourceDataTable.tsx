"use client";

import { useState } from "react";
import type { RowData } from "@tanstack/table-core";
import { IconButton, useColorScheme } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { DataTable } from "@/components/DataTable";
import { ResourceTableLoading } from "./ResourceTableLoading";
import { CompactCardToggle } from "./CompactCardToggle";
import type { DataTableProps } from "@/components/DataTable";

/** Application policy only. Queries, mutations and row content stay resource-owned. */
export function ResourceDataTable<TData extends RowData>({
  resourceId, toolbar, card, tableProps, persistence, loading = false, loadingMessage, ...props
}: DataTableProps<TData> & { readonly resourceId: string; readonly loading?: boolean; readonly loadingMessage?: string }) {
  const { mode, systemMode, setMode } = useColorScheme();
  const [compact, setCompact] = useState(card?.compactCard ?? false);
  const dark = (mode === "system" ? systemMode : mode) === "dark";
  const config = typeof toolbar === "object" ? toolbar : {};
  if (loading) return <ResourceTableLoading message={loadingMessage} />;
  return <DataTable
    defaultDisplayMode={card ? "auto" : "table"}
    autoCardBreakpoint="md"
    tableWidth="100%"
    pagination={{}}
    defaultShowColumnFilters={false}
    columnFilterDisplayMode="subheader"
    {...props}
    tableProps={{ stickyHeader: true, ...tableProps }}
    persistence={persistence ?? { storageId: resourceId }}
    card={card ? { ...card, compactCard: compact } : undefined}
    toolbar={toolbar === false ? false : {
      searchMode: "collapsible", defaultSearchOpen: true, searchPosition: "center",
      searchDebounceMs: 300, enableFilterToggle: true, showFilterStatus: true,
      enableColumnManager: true, enableDensity: true, enableFullscreen: true,
      enableDisplayModeToggle: !!card,
      ...config,
      endContent: <>{config.endContent}{card && <CompactCardToggle checked={compact} onChange={setCompact} />}
        <IconButton aria-label="toggle dark/light theme" onClick={() => setMode(dark ? "light" : "dark")}>{dark ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}</IconButton>
      </>,
    }}
  />;
}
