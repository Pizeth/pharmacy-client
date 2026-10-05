import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { DataTable } from "../../components/DataTable";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import type { DataTableCardConfig } from "./types";

interface Row {
  readonly id: number;
  readonly name: string;
}

const columnHelper = createMuiDataTableColumnHelper<Row>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", { id: "name", header: "Name" }),
]);

const FLIP_CARD: DataTableCardConfig<Row> = {
  detailMode: "flip",
  renderHeader: ({ row }) => `Header ${row.original.name}`,
  renderBody: ({ row }) => `Body ${row.original.name}`,
  renderActions: () => <button type="button">Act</button>,
  renderDetail: ({ row }) => `Detail ${row.original.name}`,
};

interface FixtureProps {
  readonly card?: DataTableCardConfig<Row>;
  readonly canExpand?: boolean;
  readonly rows?: readonly Row[];
}

function Fixture(props: FixtureProps) {
  const { card = FLIP_CARD, canExpand = true } = props;
  const rows = props.rows ?? [
    { id: 1, name: "Alpha" },
    { id: 2, name: "Beta" },
  ];

  const table = useMuiDataTable({
    columns,
    data: rows as Row[],
    getRowId: (row) => String(row.id),
    getRowCanExpand: canExpand ? () => true : undefined,
  });

  return (
    <DataTable
      table={table}
      toolbar={false}
      pagination={false}
      displayMode="card"
      card={card}
    />
  );
}

function mount(props: FixtureProps = {}) {
  return render(
    <ThemeProvider theme={createTheme()}>
      <Fixture {...props} />
    </ThemeProvider>,
  );
}

function getCard(container: HTMLElement, id: string): HTMLElement {
  const card = container.querySelector<HTMLElement>(
    `.${dataTableClasses.cardFlip}[data-row-id="${id}"]`,
  );

  if (!card) {
    throw new Error(`Flip card ${id} not rendered.`);
  }

  return card;
}

function face(card: HTMLElement, which: "front" | "back"): HTMLElement {
  const element = card.querySelector<HTMLElement>(`[data-face="${which}"]`);

  if (!element) {
    throw new Error(`No ${which} face.`);
  }

  return element;
}

/**
 * jsdom has no PointerEvent, so the pointer type is attached by hand.
 * React derives onPointerEnter/Leave from pointerover/pointerout.
 */
function pointer(
  element: HTMLElement,
  type: "pointerover" | "pointerout",
  pointerType: "mouse" | "touch" | "pen",
): void {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true });

  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(element, event);
}

describe("DataTable card flip mode", () => {
  it("renders two faces per card, front showing and back hidden", () => {
    const { container } = mount();

    const card = getCard(container, "1");

    expect(card).toHaveAttribute("role", "listitem");
    expect(card).toHaveAttribute("data-flipped", "false");

    expect(within(face(card, "front")).getByText("Body Alpha")).toBeVisible();

    expect(face(card, "front")).not.toHaveAttribute("inert");
    expect(face(card, "front")).not.toHaveAttribute("aria-hidden");
    expect(face(card, "back")).toHaveAttribute("inert");
    expect(face(card, "back")).toHaveAttribute("aria-hidden", "true");
  });

  it("flips with the front control and turns back with the back control", () => {
    const { container } = mount();
    const card = getCard(container, "1");

    fireEvent.click(
      within(face(card, "front")).getByRole("button", { name: "Show details" }),
    );

    expect(card).toHaveAttribute("data-flipped", "true");
    expect(face(card, "front")).toHaveAttribute("inert");
    expect(face(card, "back")).not.toHaveAttribute("inert");
    expect(within(face(card, "back")).getByText("Detail Alpha")).toBeVisible();

    fireEvent.click(
      within(face(card, "back")).getByRole("button", { name: "Back to front" }),
    );

    expect(card).toHaveAttribute("data-flipped", "false");
    expect(face(card, "back")).toHaveAttribute("inert");
  });

  it("returns to the front when Back is pressed while still hovered", () => {
    const { container } = mount();
    const card = getCard(container, "1");
    fireEvent.click(within(face(card, "front")).getByRole("button", { name: "Show details" }));
    pointer(card, "pointerover", "mouse");
    fireEvent.click(within(face(card, "back")).getByRole("button", { name: "Back to front" }));
    expect(card).toHaveAttribute("data-flipped", "false");
    expect(within(face(card, "front")).getByRole("button", { name: "Show details" })).toHaveFocus();
  });

  it("flips one card without touching the others", () => {
    const { container } = mount();

    fireEvent.click(
      within(face(getCard(container, "1"), "front")).getByRole("button", {
        name: "Show details",
      }),
    );

    expect(getCard(container, "1")).toHaveAttribute("data-flipped", "true");
    expect(getCard(container, "2")).toHaveAttribute("data-flipped", "false");
  });

  it("moves focus to the control on the face that is now showing", () => {
    const { container } = mount();
    const card = getCard(container, "1");

    const front = within(face(card, "front")).getByRole("button", {
      name: "Show details",
    });

    front.focus();
    fireEvent.click(front);

    expect(
      within(face(card, "back")).getByRole("button", { name: "Back to front" }),
    ).toHaveFocus();

    fireEvent.click(document.activeElement as HTMLElement);

    expect(
      within(face(card, "front")).getByRole("button", { name: "Show details" }),
    ).toHaveFocus();
  });

  it("links the control to the back face and names the region after it", () => {
    const { container } = mount();
    const card = getCard(container, "1");

    const back = face(card, "back");
    const control = within(face(card, "front")).getByRole("button", {
      name: "Show details",
    });

    expect(back).toHaveAttribute("role", "region");
    expect(control).toHaveAttribute("aria-controls", back.id);
    expect(back).toHaveAttribute("aria-labelledby", control.id);
    expect(control).toHaveAttribute("aria-expanded", "false");
  });

  it("repeats the actions on both faces", () => {
    const { container } = mount();
    const card = getCard(container, "1");

    expect(within(face(card, "front")).getByText("Act")).toBeInTheDocument();
    expect(within(face(card, "back")).getByText("Act")).toBeInTheDocument();
  });

  it("exposes only the showing face to assistive technology", () => {
    const { container } = mount();
    const card = getCard(container, "1");

    // Front showing: one "Act" in the accessibility tree.
    expect(
      within(card).getAllByRole("button", { name: "Act" }),
    ).toHaveLength(1);

    fireEvent.click(
      within(face(card, "front")).getByRole("button", { name: "Show details" }),
    );

    // Back showing: still exactly one.
    expect(
      within(card).getAllByRole("button", { name: "Act" }),
    ).toHaveLength(1);
    expect(
      within(face(card, "back")).getAllByRole("button", { name: "Act" }),
    ).toHaveLength(1);
  });

  it("does not render the detail until the card has been flipped, then keeps it", () => {
    const renderDetail = jest.fn(({ row }) => `Detail ${row.original.name}`);

    const { container } = mount({ card: { ...FLIP_CARD, renderDetail } });
    const card = getCard(container, "1");

    expect(renderDetail).not.toHaveBeenCalled();

    fireEvent.click(
      within(face(card, "front")).getByRole("button", { name: "Show details" }),
    );
    expect(renderDetail).toHaveBeenCalled();

    fireEvent.click(
      within(face(card, "back")).getByRole("button", { name: "Back to front" }),
    );

    // Still mounted while turning back.
    expect(within(face(card, "back")).getByText("Detail Alpha")).toBeInTheDocument();
  });

  describe("hover", () => {
    it("flips while a mouse hovers and turns back when it leaves", () => {
      const { container } = mount();
      const card = getCard(container, "1");

      pointer(card, "pointerover", "mouse");
      expect(card).toHaveAttribute("data-flipped", "true");
      expect(face(card, "back")).not.toHaveAttribute("inert");
      expect(face(card, "front")).toHaveAttribute("inert");

      pointer(card, "pointerout", "mouse");
      expect(card).toHaveAttribute("data-flipped", "false");
    });

    it("never flips on touch or pen hover", () => {
      const { container } = mount();
      const card = getCard(container, "1");

      pointer(card, "pointerover", "touch");
      expect(card).toHaveAttribute("data-flipped", "false");

      pointer(card, "pointerover", "pen");
      expect(card).toHaveAttribute("data-flipped", "false");
    });

    it("can be turned off", () => {
      const { container } = mount({
        card: { ...FLIP_CARD, flip: { flipOnHover: false } },
      });
      const card = getCard(container, "1");

      pointer(card, "pointerover", "mouse");

      expect(card).toHaveAttribute("data-flipped", "false");
    });

    it("keeps the actions reachable on the back while hovering", () => {
      const { container } = mount();
      const card = getCard(container, "1");

      pointer(card, "pointerover", "mouse");

      expect(
        within(face(card, "back")).getByRole("button", { name: "Act" }),
      ).toBeInTheDocument();
    });

    it("offers no back control while the card only shows because of hover", () => {
      const { container } = mount();
      const card = getCard(container, "1");

      pointer(card, "pointerover", "mouse");

      expect(
        within(face(card, "back")).queryByRole("button", {
          name: "Back to front",
          hidden: true,
        }),
      ).toBeNull();
    });

    it("stays flipped after the mouse leaves when it was turned with the control", () => {
      const { container } = mount();
      const card = getCard(container, "1");

      fireEvent.click(
        within(face(card, "front")).getByRole("button", {
          name: "Show details",
        }),
      );

      pointer(card, "pointerover", "mouse");
      pointer(card, "pointerout", "mouse");

      expect(card).toHaveAttribute("data-flipped", "true");
      expect(
        within(face(card, "back")).getByRole("button", {
          name: "Back to front",
        }),
      ).toBeInTheDocument();
    });
  });

  describe("configuration", () => {
    it("uses the supplied labels and icon", () => {
      mount({
        card: {
          ...FLIP_CARD,
          flip: {
            labels: { showDetails: "Look closer", hideDetails: "Go back" },
            icon: <svg data-testid="flip-icon" />,
          },
        },
      });

      expect(
        screen.getAllByRole("button", { name: "Look closer" }),
      ).toHaveLength(2);
      expect(screen.getAllByTestId("flip-icon").length).toBeGreaterThan(0);
    });

    it("stays a single face when rows cannot expand", () => {
      const { container } = mount({ canExpand: false });

      expect(container.querySelector(`.${dataTableClasses.cardFlip}`)).toBeNull();
      expect(
        container.querySelectorAll(`.${dataTableClasses.cardItem}`),
      ).toHaveLength(2);
    });

    it("stays a single face without a detail renderer", () => {
      const { renderDetail: _unused, ...withoutDetail } = FLIP_CARD;
      void _unused;

      const { container } = mount({ card: withoutDetail });

      expect(container.querySelector(`.${dataTableClasses.cardFlip}`)).toBeNull();
    });

    it("leaves inline detail mode unchanged", () => {
      const { container } = mount({
        card: { ...FLIP_CARD, detailMode: "inline", enableExpansion: true },
      });

      expect(container.querySelector(`.${dataTableClasses.cardFlip}`)).toBeNull();

      fireEvent.click(screen.getAllByRole("button", { name: /expand details/i })[0]);

      expect(screen.getByText("Detail Alpha")).toBeInTheDocument();
    });

    it("uses the detail panel as the back when the card has no renderer", () => {
      const { renderDetail: _unused, ...withoutDetail } = FLIP_CARD;
      void _unused;

      function PanelFixture() {
        const table = useMuiDataTable({
          columns,
          data: [{ id: 1, name: "Alpha" }],
          getRowId: (row) => String(row.id),
          getRowCanExpand: () => true,
        });

        return (
          <DataTable
            table={table}
            toolbar={false}
            pagination={false}
            displayMode="card"
            card={withoutDetail}
            renderDetailPanel={({ row }) => `Panel ${row.original.name}`}
          />
        );
      }

      const { container } = render(
        <ThemeProvider theme={createTheme()}>
          <PanelFixture />
        </ThemeProvider>,
      );
      const card = getCard(container, "1");

      fireEvent.click(
        within(face(card, "front")).getByRole("button", {
          name: "Show details",
        }),
      );

      expect(within(face(card, "back")).getByText("Panel Alpha")).toBeVisible();
    });
  });
});
