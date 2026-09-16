# Phase 1.7.10.6F.4 — Fullscreen containment and Escape interaction

This phase builds on the completed 6F.3 variants and ownerState contract. It changes one production file and adds one focused test file.

## What changed and why

The shell already occupied 100dvh in fullscreen, but its content child retained the automatic minimum size of a flex item. A tall table could therefore extend below the fixed shell and push pagination beyond the clipped viewport. The fullscreen selector now gives the content child flex: 1 1 0%, minHeight: 0, and overflow: hidden. The existing container remains the flexible scrolling viewport. Toolbar and non-container content children (refresh indicator, selection bar, pagination) do not shrink. Border-box sizing includes the outlined border inside the viewport dimensions.

These rules are scoped to the existing data-fullscreen selector. Normal inline table layout retains its previous behavior. Variant stays in ownerState; mutable fullscreen state stays in the provider.

Escape now calls the existing setFullscreen(false) when the event originates inside the fullscreen shell. The handler uses bubbling so a nested control can preventDefault or stopPropagation first. React portal events can bubble through the component tree despite originating outside the shell's DOM; the contains check explicitly excludes them. Outside-page keyboard events are not intercepted because there is no document listener.

Controlled fullscreen still requests a change through onFullscreenChange and waits for the owner to update the prop. Uncontrolled fullscreen updates immediately. The fullscreen action remains mounted, so a focused action retains focus when its label changes to Enter fullscreen table.

This remains a CSS fullscreen surface, not a modal dialog or the browser Fullscreen API. The phase does not add a focus trap, background inertness, or body scroll locking. No broad accessibility-completion claim is made.

## Usage

Existing usage needs no changes:

```tsx
<DataTable table={table} defaultFullscreen variant="outlined" />
```

Controlled usage continues to work:

```tsx
const [fullscreen, setFullscreen] = useState(false);

<DataTable
  table={table}
  fullscreen={fullscreen}
  onFullscreenChange={setFullscreen}
  variant="plain"
/>
```

Custom nested controls can consume Escape before the shell handler:

```tsx
<input
  onKeyDown={(event) => {
    if (event.key === "Escape" && editorOpen) {
      event.preventDefault();
      closeEditor();
    }
  }}
/>
```

## Validation

- npm run typecheck passed, including TanStack feature synchronization.
- npm run test:datatable -- --runInBand: 35 suites, 186 tests passed.
- git diff --check passed; Windows line-ending warnings remain informational.
- Five new tests cover uncontrolled exit and retained action focus, controlled callback semantics, consumed/portal/outside/unrelated events, and fullscreen CSS containment for both outlined and plain variants.
- Existing 6F.3 variant tests remain green.
- The intentional header error.main color and the user's theme typing fixes are preserved.

## Browser acceptance still pending

Automated tests assert CSS and interaction contracts in JSDOM. They do not measure browser layout. Verify a tall table at narrow and wide viewport sizes: enter fullscreen, scroll to the final row, keep pagination reachable, open a menu and press Escape, then press Escape from the fullscreen action. Repeat for plain and outlined variants. Check unusually tall custom toolbar/selection content separately; fixed chrome taller than the viewport is outside the tested layout assumptions.

## Next phase

6F.5 should address logical RTL alignment and the remaining live acceptance matrix. The alignment helper still maps start/end to left/right without direction awareness; that needs a coordinated audit of MUI alignment, header flex direction, and the application's RTL style pipeline rather than changing one mapping in isolation. Sticky-cell background compositing also remains pending.

## Complete production file

### src/components/DataTable/mui/components/DataTableShell.tsx

```tsx
"use client";

import { Box, styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { ReactNode } from "react";
import { useDataTableFullscreen } from "../fullscreen";
import type { DataTableOwnerState } from "../theme";

/**
 * ------------------------------------------------------------------
 * Root structural slot
 * ------------------------------------------------------------------
 *
 * The shared structural ownerState deliberately contains only stable
 * visual variant state.
 *
 * Mutable fullscreen state remains represented through:
 *
 *   data-fullscreen
 *
 * rather than being duplicated into ownerState.
 */
const ShellRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{
  readonly ownerState: DataTableOwnerState;
}>(({ theme, ownerState }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,

  /**
   * ============================================================
   * Built-in visual variants
   * ============================================================
   *
   * `outlined` preserves the exact pre-6F.3 shell appearance.
   *
   * `plain` removes only outer chrome.
   *
   * Neither variant modifies:
   *
   * - table state
   * - toolbar behavior
   * - header/body behavior
   * - density
   * - pagination
   * - selection
   */
  ...(ownerState.variant === "outlined"
    ? {
        border: "1px solid",
        borderColor: (theme.vars ?? theme).palette.divider,
        borderRadius:
          typeof theme.shape.borderRadius === "number"
            ? theme.shape.borderRadius * 2
            : `calc(${theme.shape.borderRadius} * 2)`,
      }
    : {
        border: 0,
        borderRadius: 0,
      }),

  overflow: "hidden",
  boxSizing: "border-box",

  /**
   * ============================================================
   * Mutable fullscreen state
   * ============================================================
   *
   * This remains provider-owned runtime state rather than variant
   * ownerState.
   */
  '&[data-fullscreen="true"]': {
    borderRadius: 0,
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100dvh",
    maxWidth: "100vw",
    maxHeight: "100dvh",
    zIndex: theme.zIndex.modal + 1,
    [`& > .${dataTableClasses.content}`]: {
      flex: "1 1 0%",
      minHeight: 0,
      overflow: "hidden",
      [`& > :not(.${dataTableClasses.container})`]: { flexShrink: 0 },
    },
    [`& > .${dataTableClasses.toolbar}`]: { flexShrink: 0 },
  },
}));

export interface DataTableShellProps {
  readonly children: ReactNode;

  /**
   * Shared styling state resolved by DataTable.
   *
   * This is intentionally not the full DataTable props object.
   */
  readonly ownerState: DataTableOwnerState;
}

/**
 * Outer visual shell for the high-level DataTable.
 *
 * Fullscreen applies here so:
 *
 * - toolbar
 * - table body
 * - selection bar
 * - pagination
 *
 * participate together.
 */
export function DataTableShell(props: DataTableShellProps) {
  const { children, ownerState } = props;

  const { fullscreen, setFullscreen } = useDataTableFullscreen();

  return (
    <ShellRoot
      ownerState={ownerState}
      className={dataTableClasses.root}
      /**
       * Stable debugging/theme selector for the resolved public
       * visual variant.
       *
       * The actual `variant` prop itself is NOT forwarded to the DOM.
       */
      data-variant={ownerState.variant}
      data-fullscreen={fullscreen ? "true" : undefined}
      onKeyDown={(event) => {
        // Respect nested controls that consume Escape (menus, popovers, inputs).
        // Ignore portal events: their DOM target is outside this shell.
        if (
          fullscreen &&
          event.key === "Escape" &&
          !event.defaultPrevented &&
          event.currentTarget.contains(event.target as Node)
        ) {
          event.preventDefault();
          event.stopPropagation();
          setFullscreen(false);
        }
      }}
    >
      {children}
    </ShellRoot>
  );
}

```

### src/components/DataTable/mui/components/fullscreenInteraction.spec.tsx

```tsx
import { createPortal } from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
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
          enableDensity: false,
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
it("exits uncontrolled fullscreen on Escape and keeps focus on the mounted action", () => {
  const onChange = jest.fn();
  const { container } = render(<Fixture onChange={onChange} />);
  const button = screen.getByRole("button", { name: "Exit fullscreen table" });
  button.focus();
  fireEvent.keyDown(button, { key: "Escape" });
  expect(root(container)).not.toHaveAttribute("data-fullscreen");
  expect(onChange).toHaveBeenCalledWith(false);
  expect(
    screen.getByRole("button", { name: "Enter fullscreen table" }),
  ).toHaveFocus();
  fireEvent.keyDown(button, { key: "Escape" });
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

```

