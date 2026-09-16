import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableBooleanFilter } from "./DataTableBooleanFilter";
import { DataTableNumberFilter } from "./DataTableNumberFilter";
import { DataTableNumberRangeFilter } from "./DataTableNumberRangeFilter";
import { DataTableSelectFilter } from "./DataTableSelectFilter";
import { DataTableTextFilter } from "./DataTableTextFilter";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

const callbacks = { onChange: jest.fn(), onClear: jest.fn() };
const cases = [
  {
    name: DATA_TABLE_THEME_COMPONENT_NAMES.textFilter,
    render: (size?: "small" | "medium") => (
      <DataTableTextFilter {...callbacks} label="Filter" value="" size={size} />
    ),
  },
  {
    name: DATA_TABLE_THEME_COMPONENT_NAMES.numberFilter,
    render: (size?: "small" | "medium") => (
      <DataTableNumberFilter
        {...callbacks}
        label="Filter"
        value={undefined}
        size={size}
      />
    ),
  },
  {
    name: DATA_TABLE_THEME_COMPONENT_NAMES.numberRangeFilter,
    render: (size?: "small" | "medium") => (
      <DataTableNumberRangeFilter
        {...callbacks}
        label="Filter"
        value={[undefined, undefined]}
        size={size}
      />
    ),
  },
  {
    name: DATA_TABLE_THEME_COMPONENT_NAMES.booleanFilter,
    render: (size?: "small" | "medium") => (
      <DataTableBooleanFilter
        {...callbacks}
        label="Filter"
        value={undefined}
        size={size}
      />
    ),
  },
  {
    name: DATA_TABLE_THEME_COMPONENT_NAMES.selectFilter,
    render: (size?: "small" | "medium") => (
      <DataTableSelectFilter
        {...callbacks}
        label="Filter"
        value={undefined}
        options={[]}
        size={size}
      />
    ),
  },
];

describe.each(cases)("$name theme integration", (control) => {
  const theme = createTheme({
    components: {
      [control.name]: {
        defaultProps: { size: "medium" },
        styleOverrides: { root: { paddingTop: "7px" } },
        variants: [
          {
            props: { size: "medium" },
            style: () => ({ paddingBottom: "11px" }),
          },
        ],
      },
    },
  });

  it("applies theme defaults, root overrides, and size variants", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>{control.render()}</ThemeProvider>,
    );
    expect(container.firstChild).toHaveStyle({
      paddingTop: "7px",
      paddingBottom: "11px",
    });
    const inputs = container.querySelectorAll(".MuiInputBase-root");
    expect(inputs.length).toBeGreaterThan(0);
    inputs.forEach((input) =>
      expect(input).not.toHaveClass("MuiInputBase-sizeSmall"),
    );
    expect(container.firstChild).not.toHaveAttribute("ownerState");
  });

  it("lets explicit caller size override the theme default", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>{control.render("small")}</ThemeProvider>,
    );
    container
      .querySelectorAll(".MuiInputBase-root")
      .forEach((input) => expect(input).toHaveClass("MuiInputBase-sizeSmall"));
    expect(container.firstChild).not.toHaveStyle({ paddingBottom: "11px" });
  });
});

describe("number range editing", () => {
  it("preserves the other endpoint when clearing one bound", () => {
    render(
      <DataTableNumberRangeFilter
        {...callbacks}
        label="Price"
        value={[1, 10]}
      />,
    );
    fireEvent.change(screen.getByLabelText("Price minimum"), {
      target: { value: "" },
    });
    expect(callbacks.onChange).toHaveBeenCalledWith([undefined, 10]);
    expect(callbacks.onClear).not.toHaveBeenCalled();
  });

  it("clears the filter when its last bound is removed", () => {
    render(
      <DataTableNumberRangeFilter
        {...callbacks}
        label="Price"
        value={[undefined, 10]}
      />,
    );
    fireEvent.change(screen.getByLabelText("Price maximum"), {
      target: { value: "" },
    });
    expect(callbacks.onClear).toHaveBeenCalledTimes(1);
    expect(callbacks.onChange).not.toHaveBeenCalled();
  });
});

describe("filter Select RTL portal direction", () => {
  const rtlTheme = createTheme({
    direction: "rtl",
  });

  const cases = [
    {
      name: "boolean",

      renderControl: () => (
        <DataTableBooleanFilter
          {...callbacks}
          label="Filter"
          value={undefined}
        />
      ),
    },

    {
      name: "select",

      renderControl: () => (
        <DataTableSelectFilter
          {...callbacks}
          label="Filter"
          value={undefined}
          options={[
            {
              label: "Alpha",

              value: "alpha",
            },
          ]}
        />
      ),
    },
  ] as const;

  it.each(cases)(
    "passes RTL direction into the $name filter listbox portal",
    async ({ renderControl }) => {
      render(
        <ThemeProvider theme={rtlTheme}>
          {/**
           * The normal input itself inherits DOM direction from the
           * DataTable Root.
           *
           * The listbox cannot inherit this wrapper because MUI
           * portals it to document.body.
           */}
          <div dir="rtl">{renderControl()}</div>
        </ThemeProvider>,
      );

      fireEvent.mouseDown(
        screen.getByRole("combobox", {
          name: "Filter",
        }),
      );

      const listbox = await screen.findByRole("listbox");

      expect(listbox.closest('[dir="rtl"]')).not.toBeNull();
    },
  );
});
