// src/components/DataTable/aggregations.ts
export const sumAggregation =
  <TData>(accessor: (row: TData) => number) =>
  ({ table }: { table: any }) => {
    const total = table
      .getFilteredRowModel()
      .rows.reduce((sum: number, row: any) => sum + accessor(row.original), 0);
    return total;
  };
