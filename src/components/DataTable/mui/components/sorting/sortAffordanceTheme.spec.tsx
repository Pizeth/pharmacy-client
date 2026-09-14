import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { DataTableSortIndicator } from "./DataTableSortIndicator";
import { DataTableSortLabel } from "./DataTableSortLabel";

const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        headerLabel: { letterSpacing: "2px" },
        sortLabel: { backgroundColor: "rgb(10, 20, 30)" },
        sortIndicator: { gap: "7px" },
        sortButton: { borderRadius: "7px" },
        sortIcon: { color: "rgb(30, 20, 10)" },
        sortIndex: { backgroundColor: "rgb(40, 50, 60)" },
      },
    },
  },
});

function part(slot: keyof typeof dataTableClasses) {
  const node = document.querySelector(`.${dataTableClasses[slot]}`);
  if (!node) throw new Error(`Missing ${slot}`);
  return node;
}

describe("header sorting affordance theme", () => {
  it("applies structural overrides without adding the indicator to the label", () => {
    render(
      <ThemeProvider theme={theme}>
        <DataTableSortLabel canSort direction="asc">
          Name
        </DataTableSortLabel>
        <DataTableSortIndicator direction="asc" showSortIndex sortIndex={1} />
      </ThemeProvider>,
    );
    expect(part("headerLabel")).toHaveStyle({ letterSpacing: "2px" });
    expect(part("sortLabel")).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });
    expect(part("sortIndicator")).toHaveStyle({ gap: "7px" });
    expect(part("sortButton")).toHaveStyle({ borderRadius: "7px" });
    expect(part("sortIcon")).toHaveStyle({
      color: "rgb(30, 20, 10)",
      transform: "rotate(180deg)",
    });
    expect(part("sortIndex")).toHaveTextContent("2");
    expect(part("sortIndex")).toHaveStyle({
      backgroundColor: "rgb(40, 50, 60)",
    });
    expect(part("sortLabel")).not.toContainElement(
      part("sortIndicator") as HTMLElement,
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(part("sortButton")).toHaveAttribute("tabindex", "-1");
  });

  it.each([false, "asc", "desc"] as const)(
    "derives direction and badge visibility for %s",
    (direction) => {
      render(
        <ThemeProvider theme={theme}>
          <DataTableSortIndicator
            direction={direction}
            showSortIndex
            sortIndex={0}
          />
        </ThemeProvider>,
      );
      expect(part("sortIcon")).toHaveAttribute(
        "data-direction",
        direction || "none",
      );
      expect(part("sortButton")).toHaveAttribute(
        "data-active",
        String(direction !== false),
      );
      expect(
        document.querySelector(`.${dataTableClasses.sortIndex}`) !== null,
      ).toBe(direction !== false);
    },
  );

  it("keeps non-sortable labels non-interactive", () => {
    render(
      <ThemeProvider theme={theme}>
        <DataTableSortLabel canSort={false} direction={false}>
          Name
        </DataTableSortLabel>
      </ThemeProvider>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(part("headerLabel")).toHaveTextContent("Name");
  });

  it("forwards keyboard and modifier clicks to the supplied handler", () => {
    const onClick = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <DataTableSortLabel canSort direction={false} onClick={onClick}>
          Name
        </DataTableSortLabel>
      </ThemeProvider>,
    );
    const label = screen.getByRole("button", { name: "Name" });
    fireEvent.keyDown(label, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(label, { shiftKey: true });
    expect(onClick.mock.calls[1][0].shiftKey).toBe(true);
  });
});
