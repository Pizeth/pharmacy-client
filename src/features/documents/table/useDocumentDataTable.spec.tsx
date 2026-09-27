import type { DataProvider } from "@refinedev/core";
import { Refine } from "@refinedev/core";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";

import { DOCUMENT_COLUMN_IDS } from "../types";
import {
  createDocumentFixtureDataProvider,
  createDocumentFixtureRows,
} from "../testing";
import { useDocumentDataTable } from "./useDocumentDataTable";

function createWrapper(
  provider: DataProvider,
) {
  const theme = createTheme();

  return function Wrapper(
    props: {
      readonly children: ReactNode;
    },
  ) {
    return (
      <ThemeProvider theme={theme}>
        <Refine
          dataProvider={provider}
          options={{
            disableTelemetry: true,
          }}
        >
          {props.children}
        </Refine>
      </ThemeProvider>
    );
  };
}

describe("useDocumentDataTable", () => {
  it("executes the Document Refine lifecycle through the generic server binding", async () => {
    const provider = createDocumentFixtureDataProvider(
      createDocumentFixtureRows(60),
    );

    const { result } = renderHook(
      () =>
        useDocumentDataTable({
          queryOptions: {
            retry: false,
          },
        }),
      {
        wrapper: createWrapper(provider),
      },
    );

    await waitFor(() => {
      expect(result.current.server.hasResult).toBe(true);
    });

    expect(result.current.server.rows).toHaveLength(25);
    expect(result.current.server.pagination).toEqual({
      pageIndex: 0,
      pageSize: 25,
      rowCount: 60,
      pageCount: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    });

    expect(result.current.table.options.manualPagination).toBe(true);
    expect(result.current.table.options.manualSorting).toBe(true);
    expect(result.current.table.options.manualFiltering).toBe(true);

    act(() => {
      result.current.query.onPaginationChange((previous) => ({
        ...previous,
        pageIndex: 1,
      }));
    });

    await waitFor(() => {
      expect(result.current.server.isPreviousResult).toBe(false);
      expect(result.current.server.pagination.pageIndex).toBe(1);
    });

    expect(result.current.server.rows[0]?.id).toBe(26);

    act(() => {
      result.current.query.onColumnFiltersChange([
        {
          id: DOCUMENT_COLUMN_IDS.status,
          value: "ប្រញ៉ាប់",
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.server.isPreviousResult).toBe(false);
      expect(
        result.current.server.rows.every(
          (row) => row.status === "ប្រញ៉ាប់",
        ),
      ).toBe(true);
    });

    expect(result.current.query.state.pagination.pageIndex).toBe(0);

    act(() => {
      result.current.query.onGlobalFilterChange("budget");
    });

    await waitFor(() => {
      expect(result.current.server.isPreviousResult).toBe(false);
      expect(
        result.current.server.rows.every((row) =>
          [row.documentNumber, row.title, row.description ?? ""]
            .join(" ")
            .toLocaleLowerCase()
            .includes("budget"),
        ),
      ).toBe(true);
    });
  });
});
