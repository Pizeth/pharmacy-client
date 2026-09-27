import type { DataProvider } from "@refinedev/core";
import { Refine } from "@refinedev/core";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  createDocumentFixtureDataProvider,
  createDocumentFixtureRows,
} from "../testing";
import { DocumentTable } from "./DocumentTable";

describe("DocumentTable", () => {
  it("renders the second-resource Refine proof through the generic MUI DataTable", async () => {
    const baseProvider = createDocumentFixtureDataProvider(
      createDocumentFixtureRows(30),
    );

    const getList = jest.fn(baseProvider.getList);

    const provider: DataProvider = {
      ...baseProvider,
      getList: getList as DataProvider["getList"],
    };

    render(
      <ThemeProvider theme={createTheme()}>
        <Refine
          dataProvider={provider}
          options={{
            disableTelemetry: true,
          }}
        >
          <DocumentTable />
        </Refine>
      </ThemeProvider>,
    );

    expect(
      await screen.findByText("DOC-0001"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Search documents…"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Refresh",
      }),
    ).toBeInTheDocument();

    expect(getList).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Refresh",
      }),
    );

    await waitFor(() => {
      expect(getList).toHaveBeenCalledTimes(2);
    });
  });
});
