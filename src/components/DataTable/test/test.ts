type User = {
  id: number;

  name: string;

  age: number;

  birthday: Date;

  active: boolean;
};

import { createMuiDataTableColumnHelper } from "@/components/DataTable";

const columnHelper = createMuiDataTableColumnHelper<User>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",

    meta: {
      align: "start",

      filterVariant: "text",
    },

    enableSorting: true,

    enableColumnFilter: true,

    enableHiding: true,

    enablePinning: true,

    enableResizing: true,

    sortFn: "text",

    filterFn: "includesString",
  }),

  columnHelper.accessor("age", {
    header: "Age",

    meta: {
      align: "end",

      headerAlign: "end",

      filterVariant: "number-range",
    },

    sortFn: "basic",

    filterFn: "inNumberRange",
  }),

  columnHelper.accessor("birthday", {
    header: "Birthday",

    meta: {
      filterVariant: "date-range",
    },

    sortFn: "datetime",

    filterFn: "inDateRange",
  }),

  columnHelper.accessor("active", {
    header: "Active",

    meta: {
      filterVariant: "boolean",
    },

    filterFn: "equals",
  }),
]);
