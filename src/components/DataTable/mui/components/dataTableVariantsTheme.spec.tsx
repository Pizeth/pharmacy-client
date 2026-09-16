import { createTheme, ThemeProvider } from "@mui/material/styles";

import { render } from "@testing-library/react";

import { dataTableClasses } from "../styles";

import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";

import type { DataTableVariant } from "../theme";

import { DataTable } from "./DataTable";

type Row = {
  readonly name: string;
};

const helper = createMuiDataTableColumnHelper<Row>();

const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",

    enableSorting: false,

    enableColumnFilter: false,

    enableResizing: false,

    meta: {
      enableColumnMenu: false,
    },
  }),
]);

const data: readonly Row[] = [
  {
    name: "Alpha",
  },
];

interface FixtureProps {
  readonly variant?: DataTableVariant;
}

function Fixture(props: FixtureProps) {
  const { variant } = props;

  const table = useMuiDataTable({
    columns,

    data: [...data],

    enableColumnResizing: false,
  });

  return (
    <DataTable
      table={table}
      variant={variant}
      toolbar={false}
      pagination={false}
    />
  );
}

function getSlot(
  container: HTMLElement,

  className: string,
): HTMLElement {
  const element = container.querySelector<HTMLElement>(`.${className}`);

  if (!element) {
    throw new Error(`Missing DataTable slot "${className}".`);
  }

  return element;
}

describe("DataTable variants and ownerState", () => {
  it("uses outlined as the built-in fallback without leaking styling props to the DOM", () => {
    const theme = createTheme({
      components: {
        RazethDataTable: {
          /**
           * Keep styleOverrides independent of DataTable variant
           * ownerState.
           *
           * RazethDataTable contains many separately rendered slots
           * and not every one carries the Root ownerState.
           */
          styleOverrides: {
            root: {
              outline: "2px solid rgb(10, 20, 30)",
            },

            content: {
              backgroundColor: "rgb(20, 30, 40)",
            },

            container: {
              outline: "1px solid rgb(30, 40, 50)",
            },

            table: {
              backgroundColor: "rgb(40, 50, 60)",
            },
          },
        },
      },
    });

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Fixture />
      </ThemeProvider>,
    );

    const root = getSlot(container, dataTableClasses.root);

    const content = getSlot(container, dataTableClasses.content);

    const tableContainer = getSlot(container, dataTableClasses.container);

    const table = getSlot(container, dataTableClasses.table);

    expect(root).toHaveAttribute("data-variant", "outlined");

    /**
     * Styling-only ownerState is filtered by MUI.
     */
    expect(root).not.toHaveAttribute("ownerstate");

    /**
     * The public variant is represented intentionally through the
     * stable data-variant attribute rather than leaking a raw variant
     * prop onto the DOM.
     */
    expect(root).not.toHaveAttribute("variant");

    expect(root).toHaveStyle({
      outline: "2px solid rgb(10, 20, 30)",
    });

    expect(content).toHaveStyle({
      backgroundColor: "rgb(20, 30, 40)",
    });

    expect(tableContainer).toHaveStyle({
      outline: "1px solid rgb(30, 40, 50)",
    });

    expect(table).toHaveStyle({
      backgroundColor: "rgb(40, 50, 60)",
    });

    /**
     * Existing outlined presentation remains the built-in fallback.
     */
    const computedRoot = window.getComputedStyle(root);

    expect(computedRoot.borderTopWidth).toBe("1px");

    expect(computedRoot.borderTopStyle).toBe("solid");
  });

  it("uses the theme default variant and applies matching Root variants with scoped descendant styles", () => {
    const variantOutline = "4px solid rgb(60, 70, 80)";

    const contentBackground = "rgb(70, 80, 90)";

    const theme = createTheme({
      components: {
        RazethDataTable: {
          defaultProps: {
            variant: "plain",
          },

          variants: [
            {
              props: {
                variant: "plain",
              },

              style: {
                /**
                 * Direct variant style applies to the DataTable Root.
                 */
                outline: variantOutline,

                /**
                 * Variant-aware child-slot presentation is expressed
                 * through stable utility classes beneath the Root.
                 *
                 * Do not depend on ownerState inside shared
                 * styleOverrides callbacks.
                 */
                [`& .${dataTableClasses.content}`]: {
                  backgroundColor: contentBackground,
                },
              },
            },
          ],
        },
      },
    });

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Fixture />
      </ThemeProvider>,
    );

    const root = getSlot(container, dataTableClasses.root);

    const content = getSlot(container, dataTableClasses.content);

    const tableContainer = getSlot(container, dataTableClasses.container);

    expect(root).toHaveAttribute("data-variant", "plain");

    /**
     * MUI's matching variant applies at the component Root.
     */
    expect(root).toHaveStyle({
      outline: variantOutline,
    });

    /**
     * The Root variant can deliberately theme known descendant slots
     * through their stable utility classes.
     */
    expect(content).toHaveStyle({
      backgroundColor: contentBackground,
    });

    /**
     * Slots not addressed by the variant remain unaffected.
     */
    expect(tableContainer).not.toHaveStyle({
      outline: variantOutline,
    });

    const computedRoot = window.getComputedStyle(root);

    /**
     * Built-in plain variant removes outer shell chrome.
     */
    expect(computedRoot.borderTopWidth).toBe("0px");

    /**
     * Zero-length CSS values may be serialized by different DOM
     * implementations as either:
     *
     *   0
     *
     * or:
     *
     *   0px
     *
     * The contract being tested is zero radius, not a serialization unit.
     */
    expect(Number.parseFloat(computedRoot.borderRadius)).toBe(0);
  });

  it("lets an explicit component variant override the theme default", () => {
    const theme = createTheme({
      components: {
        RazethDataTable: {
          defaultProps: {
            variant: "plain",
          },

          variants: [
            {
              props: {
                variant: "plain",
              },

              style: {
                outline: "3px solid rgb(80, 20, 20)",
              },
            },

            {
              props: {
                variant: "outlined",
              },

              style: {
                outline: "5px solid rgb(20, 80, 20)",
              },
            },
          ],
        },
      },
    });

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Fixture variant="outlined" />
      </ThemeProvider>,
    );

    const root = getSlot(container, dataTableClasses.root);

    expect(root).toHaveAttribute("data-variant", "outlined");

    expect(root).toHaveStyle({
      outline: "5px solid rgb(20, 80, 20)",
    });

    const computedRoot = window.getComputedStyle(root);

    expect(computedRoot.borderTopWidth).toBe("1px");
  });

  it("updates a theme-default variant when the surrounding theme changes", () => {
    const plainTheme = createTheme({
      components: {
        RazethDataTable: {
          defaultProps: {
            variant: "plain",
          },
        },
      },
    });

    const outlinedTheme = createTheme({
      components: {
        RazethDataTable: {
          defaultProps: {
            variant: "outlined",
          },
        },
      },
    });

    const { container, rerender } = render(
      <ThemeProvider theme={plainTheme}>
        <Fixture />
      </ThemeProvider>,
    );

    expect(getSlot(container, dataTableClasses.root)).toHaveAttribute(
      "data-variant",
      "plain",
    );

    rerender(
      <ThemeProvider theme={outlinedTheme}>
        <Fixture />
      </ThemeProvider>,
    );

    /**
     * Variant is presentation configuration, not uncontrolled
     * component state.
     *
     * Unlike density, a new theme default applies immediately.
     */
    expect(getSlot(container, dataTableClasses.root)).toHaveAttribute(
      "data-variant",
      "outlined",
    );
  });
});
