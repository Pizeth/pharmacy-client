"use client";

import OpenInNew from "@mui/icons-material/OpenInNew";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import type { DataTableRowAction } from "@/components/DataTable";

export function resourceRecordMenuActions<T extends { readonly id: string | number }>({
  basePath,
  navigate,
  canEdit,
  canDelete,
  deleteLabel = "Open delete page",
}: {
  readonly basePath: string;
  readonly navigate: (href: string) => void;
  readonly canEdit?: (record: T) => boolean;
  readonly canDelete?: (record: T) => boolean;
  readonly deleteLabel?: string;
}): readonly DataTableRowAction<T>[] {
  return [
    {
      id: "edit-page",
      label: "Open edit page",
      renderIcon: () => <OpenInNew fontSize="small" />,
      isDisabled: ({ row }) => !row.getIsSelected() || canEdit?.(row.original) === false,
      onClick: ({ row }) => { navigate(`${basePath}/edit/${encodeURIComponent(String(row.original.id))}`); },
    },
    {
      id: "delete-page",
      label: deleteLabel,
      renderIcon: () => <OpenInNew fontSize="small" />,
      isDisabled: ({ row }) => !row.getIsSelected() || canDelete?.(row.original) === false,
      onClick: ({ row }) => { navigate(`${basePath}/delete/${encodeURIComponent(String(row.original.id))}`); },
    },
    {
      id: "print",
      label: "Print details",
      renderIcon: () => <PrintOutlined fontSize="small" />,
      isDisabled: ({ row }) => !row.getIsSelected(),
      onClick: ({ row }) => { navigate(`${basePath}/${encodeURIComponent(String(row.original.id))}?print=1`); },
    },
  ];
}
