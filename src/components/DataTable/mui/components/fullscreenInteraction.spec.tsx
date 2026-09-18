import { createPortal } from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { DataTable } from "./DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { dataTableClasses } from "../styles";
import type { DataTableVariant } from "../theme";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", {})]);
const data = [{ name: "Alpha" }];
function Fixture({
  controlled,
  onChange,
  variant = "outlined",
}: {
  controlled?: boolean;
  onChange?: (value: boolean) => void;
  variant?: DataTableVariant;
}) {
  const table = useMuiDataTable({ columns, data });
  return (
    <ThemeProvider theme={createTheme()}>
      <button>Outside</button>
      <DataTable
        table={table}
        variant={variant}
        fullscreen={controlled}
        defaultFullscreen
        onFullscreenChange={onChange}
        toolbar={{
          search: false,
          enableColumnManager: false,
          enableDensity: true,
          startContent: (
            <>
              <button
                onKeyDown={(event) => {
                  if (event.key === "Escape") event.preventDefault();
                }}
              >
                Consumes Escape
              </button>
              {createPortal(<button>Portal control</button>, document.body)}
            </>
          ),
        }}
      />
    </ThemeProvider>
  );
}
function root(container: HTMLElement) {
  return container.querySelector(`.${dataTableClasses.root}`)!;
}
it("exits uncontrolled fullscreen on Escape and keeps focus on the mounted action", async () => {
  const onChange = jest.fn();

  const { container } = render(<Fixture onChange={onChange} />);

  const button = screen.getByRole("button", {
    name: "Exit fullscreen table",
  });

  await act(async () => {
    button.focus();
    await Promise.resolve();
  });

  await act(async () => {
    fireEvent.keyDown(button, {
      key: "Escape",
    });

    await Promise.resolve();
  });

  expect(root(container)).not.toHaveAttribute("data-fullscreen");

  expect(onChange).toHaveBeenCalledWith(false);

  expect(
    screen.getByRole("button", {
      name: "Enter fullscreen table",
    }),
  ).toHaveFocus();

  fireEvent.keyDown(button, {
    key: "Escape",
  });

  expect(onChange).toHaveBeenCalledTimes(1);
});
it("requests a controlled exit without changing owner-controlled state", () => {
  const onChange = jest.fn();
  const view = render(<Fixture controlled onChange={onChange} />);
  fireEvent.keyDown(
    screen.getByRole("button", { name: "Exit fullscreen table" }),
    { key: "Escape" },
  );
  expect(onChange).toHaveBeenCalledWith(false);
  expect(root(view.container)).toHaveAttribute("data-fullscreen", "true");
  view.rerender(<Fixture controlled={false} onChange={onChange} />);
  expect(root(view.container)).not.toHaveAttribute("data-fullscreen");
});
it("does not intercept consumed, portal, outside, or unrelated keyboard events", () => {
  const onChange = jest.fn();
  const { container } = render(<Fixture onChange={onChange} />);
  for (const name of ["Consumes Escape", "Portal control", "Outside"])
    fireEvent.keyDown(screen.getByRole("button", { name }), { key: "Escape" });
  fireEvent.keyDown(
    screen.getByRole("button", { name: "Exit fullscreen table" }),
    { key: "Enter" },
  );
  expect(onChange).not.toHaveBeenCalled();
  expect(root(container)).toHaveAttribute("data-fullscreen", "true");
});
it.each(["outlined", "plain"] as const)(
  "contains fullscreen layout for the %s variant",
  (variant) => {
    const { container } = render(<Fixture variant={variant} />);
    expect(root(container)).toHaveStyle({
      boxSizing: "border-box",
      height: "100dvh",
    });
    expect(container.querySelector(`.${dataTableClasses.content}`)).toHaveStyle(
      { flex: "1 1 0%", minHeight: "0", overflow: "hidden" },
    );
    expect(container.querySelector(`.${dataTableClasses.toolbar}`)).toHaveStyle(
      { flexShrink: "0" },
    );
    expect(
      container.querySelector(`.${dataTableClasses.pagination}`),
    ).toHaveStyle({ flexShrink: "0" });
    fireEvent.click(
      screen.getByRole("button", { name: "Exit fullscreen table" }),
    );
    expect(
      container.querySelector(`.${dataTableClasses.content}`),
    ).not.toHaveStyle({ overflow: "hidden" });
    expect(root(container)).toHaveAttribute("data-variant", variant);
  },
);

it("keeps the density menu modal above the fullscreen shell", () => {
  const { container } = render(<Fixture />);
  fireEvent.click(screen.getByRole("button", { name: "Change table density" }));
  const menu = screen.getByRole("menu", { name: "Table density" });
  const modal = menu.closest(".MuiModal-root")!;
  expect(Number(getComputedStyle(modal).zIndex)).toBeGreaterThan(
    Number(getComputedStyle(root(container)).zIndex),
  );
  fireEvent.click(screen.getByRole("menuitem", { name: "Compact" }));
  expect(
    container.querySelector(`.${dataTableClasses.bodyCell}`),
  ).toHaveAttribute("data-density", "compact");
  expect(root(container)).toHaveAttribute("data-fullscreen", "true");
});
