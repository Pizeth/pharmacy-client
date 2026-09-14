import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { DataTableFilterIndicator } from "./DataTableFilterIndicator";

describe("structural filter indicator theme", () => {
  const theme = createTheme({
    components: {
      RazethDataTable: {
        styleOverrides: {
          filterRow: { outlineWidth: "1px" },
          filterCell: { outlineWidth: "2px" },
          filterIndicator: { color: "rgb(12, 34, 56)", fontSize: "20px" },
        },
      },
    },
  });

  it("renders the active indicator with its family override and stable class", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <DataTableFilterIndicator active className="custom-indicator" />
      </ThemeProvider>,
    );
    const indicator = container.firstElementChild;
    expect(indicator?.tagName).toBe("SPAN");
    expect(indicator).toHaveClass(dataTableClasses.filterIndicator, "custom-indicator");
    expect(indicator).toHaveStyle({ color: "rgb(12, 34, 56)", fontSize: "20px" });
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).not.toHaveAttribute("ownerState");
  });

  it("removes the indicator when the caller's canonical filter state becomes inactive", () => {
    const { container, rerender } = render(<DataTableFilterIndicator active />);
    expect(container.firstChild).not.toBeNull();
    rerender(<DataTableFilterIndicator active={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("preserves caller component and sx customization", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <DataTableFilterIndicator active component="div" sx={{ color: "rgb(65, 43, 21)" }} />
      </ThemeProvider>,
    );
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstChild).toHaveClass(dataTableClasses.filterIndicator);
    expect(container.firstChild).toHaveStyle({ color: "rgb(65, 43, 21)" });
  });
});
