"use client";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import type { RowData } from "@tanstack/table-core";
import type { DataTableRowAction } from "@/components/DataTable";
export function resourceViewAction<T extends RowData>(navigate: (href: string) => void, href: (record: T) => string): DataTableRowAction<T> {
  return { id: "view", label: "View details", inline: true, renderIcon: () => <VisibilityOutlined />, onClick: ({ row }) => navigate(href(row.original)) };
}
