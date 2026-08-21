"use client";

import { Box, useTheme, Paper } from "@mui/material";
import {
  DataTable,
  DataTableColumnFilter,
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "@/components/DataTable";

type User = {
  id: number;

  name: string;

  email: string;

  age: number;

  active: boolean;
};

const columnHelper = createMuiDataTableColumnHelper<User>();

const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "ID",

    size: 90,

    enableResizing: false,
  }),

  columnHelper.accessor("name", {
    header: "Name",

    size: 240,
  }),

  columnHelper.accessor("email", {
    header: "Email",

    size: 320,
  }),

  //   columnHelper.accessor("department", {
  //     header: "Department",

  //     size: 240,
  //   }),

  //   columnHelper.accessor("position", {
  //     header: "Position",

  //     size: 260,
  //   }),

  columnHelper.accessor("age", {
    header: "Age",

    size: 100,

    meta: {
      align: "end",

      headerAlign: "end",
    },
  }),
]);

const data: User[] = [
  {
    id: 1,

    email: "razeth@gmail.com",

    name: "John",

    age: 32,

    active: true,
  },

  {
    id: 2,

    name: "Jane",

    email: "pizeth@gmail.com",

    age: 28,

    active: false,
  },
];

export default function UsersPage() {
  const theme = useTheme();
  const table = useMuiDataTable({
    data,
    columns,

    enableColumnResizing: true,

    columnResizeMode: "onChange",

    columnResizeDirection: theme.direction,

    enableSorting: true,

    enableFilters: true,

    enableColumnFilters: true,

    enableHiding: true,

    enableColumnPinning: true,

    manualPagination: false,

    initialState: {
      pagination: {
        pageIndex: 0,

        pageSize: 25,
      },
    },

    // meta: {
    //   density: "comfortable",
    // },
  });

  return (
    <Box
      sx={{
        width: 900,

        maxWidth: "100%",
      }}
    >
      <DataTable table={table} />
    </Box>
  );
}
