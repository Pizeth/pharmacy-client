import { Table, TableBody } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { render, screen } from "@testing-library/react";

import type { ReactNode } from "react";

import { dataTableClasses } from "../../styles";

import { DataTableEmptyState } from "./DataTableEmptyState";

import { DataTableErrorState } from "./DataTableErrorState";

import { DataTableLoadingState } from "./DataTableLoadingState";

const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        bodyStateRow: {
          backgroundColor: "rgb(10, 20, 30)",
        },

        bodyStateCell: {
          color: "rgb(20, 30, 40)",
        },

        emptyState: {
          backgroundColor: "rgb(30, 40, 50)",
        },

        loadingState: {
          backgroundColor: "rgb(40, 50, 60)",
        },

        errorState: {
          outline: "2px solid rgb(50, 60, 70)",
        },
      },
    },
  },
});

function renderState(state: ReactNode) {
  return render(
    <ThemeProvider theme={theme}>
      {/**
       * MUI TableBody is intentional.
       *
       * The state shell contains MUI TableRow/TableCell and should be
       * tested under the same semantic table-section context used by
       * DataTableBody.
       */}
      <Table>
        <TableBody>{state}</TableBody>
      </Table>
    </ThemeProvider>,
  );
}

describe("DataTable body states", () => {
  it("themes the empty-state row, spanning cell and content surface", () => {
    renderState(<DataTableEmptyState colSpan={3} />);

    const row = screen.getByRole("row");

    const cell = screen.getByRole("cell");

    const status = screen.getByRole("status");

    expect(row).toHaveClass(dataTableClasses.bodyStateRow);

    expect(row).toHaveAttribute("data-state", "empty");

    expect(row).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });

    expect(cell).toHaveClass(dataTableClasses.bodyStateCell);

    expect(cell).toHaveAttribute("data-state", "empty");

    expect(cell).toHaveAttribute("colspan", "3");

    expect(cell).toHaveStyle({
      color: "rgb(20, 30, 40)",
    });

    expect(status).toHaveClass(dataTableClasses.emptyState);

    expect(status).toHaveAttribute("aria-live", "polite");

    expect(status).not.toHaveAttribute("data-filtered");

    expect(status).toHaveStyle({
      backgroundColor: "rgb(30, 40, 50)",
    });

    expect(screen.getByText("No rows to display")).toBeInTheDocument();
  });

  it("represents filtered empty results without creating a second state family", () => {
    renderState(
      <DataTableEmptyState colSpan={2} filtered>
        Nothing matched
      </DataTableEmptyState>,
    );

    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("data-filtered", "true");

    expect(screen.getByText("Nothing matched")).toBeInTheDocument();

    expect(screen.queryByText("No matching rows")).toBeNull();

    expect(screen.getByRole("cell")).toHaveAttribute("colspan", "2");
  });

  it("themes the loading state while preserving live-region semantics", () => {
    renderState(<DataTableLoadingState colSpan={4} />);

    const row = screen.getByRole("row");

    const cell = screen.getByRole("cell");

    const status = screen.getByRole("status");

    expect(row).toHaveClass(dataTableClasses.bodyStateRow);

    expect(row).toHaveAttribute("data-state", "loading");

    expect(cell).toHaveClass(dataTableClasses.bodyStateCell);

    expect(cell).toHaveAttribute("data-state", "loading");

    expect(cell).toHaveAttribute("colspan", "4");

    expect(status).toHaveClass(dataTableClasses.loadingState);

    expect(status).toHaveAttribute("aria-live", "polite");

    expect(status).toHaveAttribute("aria-busy", "true");

    expect(status).toHaveStyle({
      backgroundColor: "rgb(40, 50, 60)",
    });

    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("themes the error state while preserving assertive error semantics", () => {
    const { container } = renderState(<DataTableErrorState colSpan={5} />);

    const row = screen.getByRole("row");

    const cell = container.querySelector<HTMLElement>(
      `.${dataTableClasses.bodyStateCell}`,
    );

    const errorSurface = container.querySelector<HTMLElement>(
      `.${dataTableClasses.errorState}`,
    );

    expect(row).toHaveClass(dataTableClasses.bodyStateRow);

    expect(row).toHaveAttribute("data-state", "error");

    expect(cell).not.toBeNull();

    expect(cell).toHaveAttribute("data-state", "error");

    expect(cell).toHaveAttribute("colspan", "5");

    expect(cell).toHaveAttribute("role", "alert");

    expect(cell).toHaveAttribute("aria-live", "assertive");

    expect(errorSurface).not.toBeNull();

    expect(errorSurface).toHaveClass(dataTableClasses.errorState);

    expect(errorSurface).toHaveStyle({
      outline: "2px solid rgb(50, 60, 70)",
    });

    expect(screen.getByText("Unable to load table data.")).toBeInTheDocument();
  });

  it("preserves custom loading and error content", () => {
    const { unmount } = renderState(
      <DataTableLoadingState colSpan={1}>
        Loading custom rows
      </DataTableLoadingState>,
    );

    expect(screen.getByText("Loading custom rows")).toBeInTheDocument();

    expect(screen.queryByText("Loading…")).toBeNull();

    unmount();

    renderState(
      <DataTableErrorState colSpan={1}>
        Custom table failure
      </DataTableErrorState>,
    );

    expect(screen.getByText("Custom table failure")).toBeInTheDocument();

    expect(screen.queryByText("Unable to load table data.")).toBeNull();
  });
});
