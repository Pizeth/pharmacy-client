"use client";
import { ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import { createMuiDataTableColumnHelper } from "@/components/DataTable/mui/table";
import { createSelectionColumn } from "@/components/DataTable/mui/columns/selection";
import { createExpansionColumn } from "@/components/DataTable/mui/columns/expansion";
import { createActionsColumn, type DataTableRowAction } from "@/components/DataTable/mui/columns/actions";
import type { SocialProvider } from "../api";
import { ProviderWebsite } from "./ProviderWebsite";

const helper = createMuiDataTableColumnHelper<SocialProvider>();
export function providerColumns(actions: readonly DataTableRowAction<SocialProvider>[]) {
  return helper.columns([
    createExpansionColumn<SocialProvider>({ showExpandAll: false }),
    createSelectionColumn<SocialProvider>(),
    helper.accessor("name", { header: "Name", size: 220, meta: { label: "Name", filterVariant: "text" } }),
    helper.accessor("key", { header: "Key", size: 160, meta: { label: "Key", filterVariant: "text" } }),
    helper.accessor(provider => provider.isEnabled ? "Enabled" : "Disabled", {
      id: "status", header: "Status", size: 150, filterFn: "equals",
      cell: ({ getValue }) => <ResourceStatusBadge active={getValue() === "Enabled"} activeLabel="Enabled" inactiveLabel="Disabled" />,
      meta: { label: "Status", align: "center", headerAlign: "center", filterVariant: "select", filterOptions: [{ value: "Enabled", label: "Enabled" }, { value: "Disabled", label: "Disabled" }] },
    }),
    helper.accessor("websiteUrl", { header: "Website", size: 260, cell: ({ getValue }) => <ProviderWebsite url={getValue()} />, meta: { label: "Website", filterVariant: "text" } }),
    helper.accessor("icon", { header: "Icon key", size: 150, cell: ({ getValue }) => getValue() || "—", meta: { label: "Icon key", filterVariant: "text" } }),
    createActionsColumn<SocialProvider>({ actions, size: 152, maxInlineActions: 3 }),
  ]);
}
