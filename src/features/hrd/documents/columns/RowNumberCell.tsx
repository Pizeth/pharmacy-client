"use client";

// src/features/hrd/documents/columns/RowNumberCell.tsx

import { styled } from "@mui/material/styles";

import { useMuiDataTableContext } from "@/components/DataTable/index";

import { publicDocumentsSlot } from "../../styles/styled";
import type { PublicDocumentRecord } from "../../types/publicDocuments.types";
import { MsgUtils } from "@/utils/msgUtils";

const RowNumberRoot = styled(
  "span",
  publicDocumentsSlot("RowNumber"),
)({
  display: "inline-block",
  minWidth: "2ch",
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
});

export interface PublicDocumentRowNumberCellProps {
  readonly rowId: string;
}

/**
 * One-based sequential number across ALL pages, in the order the user
 * currently sees (after search, category filter and sorting).
 *
 * The shared DataTableRowNumberCell is built for server pagination, where
 * row.index is already the position inside the loaded page. Here every row
 * is client-side, so row.index is the position in the ORIGINAL data array
 * and would scramble as soon as the table is sorted or filtered. Instead
 * this looks the row up in the current page's row model.
 */
export function PublicDocumentRowNumberCell(
  props: PublicDocumentRowNumberCellProps,
) {
  const { rowId } = props;

  const table = useMuiDataTableContext<PublicDocumentRecord>();

  return (
    <table.Subscribe
      selector={(state) => ({
        pageIndex: state.pagination.pageIndex,
        pageSize: state.pagination.pageSize,
        // Order-affecting state: re-evaluate the position when it changes.
        sorting: state.sorting,
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
      })}
    >
      {({ pageIndex, pageSize }) => {
        const position = table
          .getRowModel()
          .rows.findIndex((row) => row.id === rowId);

        return position < 0 ? null : (
          <RowNumberRoot>
            {MsgUtils.toLocaleNumerals(
              pageIndex * pageSize + position + 1,
              "km-KH",
            )}
          </RowNumberRoot>
        );
      }}
    </table.Subscribe>
  );
}
