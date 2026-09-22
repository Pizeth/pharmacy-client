import { fireEvent, render, screen, within } from "@testing-library/react";

import { DataTable } from "@/components/DataTable";
import { DATA_TABLE_EXPANSION_COLUMN_ID } from "@/components/DataTable/mui/columns/expansion";
import { useMuiDataTable } from "@/components/DataTable/mui/table";

import { createTranslationKeyColumns } from "../columns";
import type { TranslationKey } from "../schemas";
import { TranslationKeyTranslationsPanel } from "./TranslationKeyTranslationsPanel";

const record: TranslationKey = {
  id: 31,
  key: "detail_panel_test",
  description: "Detail panel fixture",
  categoryId: 1,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: {
    id: 1,
    name: "common",
    description: null,
  },
  translations: [
    {
      id: 301,
      keyId: 31,
      locale: "en",
      value: "Detail value",
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
  ],
};

const columns = createTranslationKeyColumns({
  categoryFilterOptions: [
    {
      label: "common",
      value: 1,
    },
  ],
  localeFilterOptions: [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Khmer",
      value: "km",
    },
  ],
  enableTranslationDetails: true,
});

function Fixture() {
  const table = useMuiDataTable({
    data: [record],
    columns,
    getRowId: (row) => String(row.id),
    getRowCanExpand: () => true,
    enableColumnPinning: true,
    initialState: {
      columnPinning: {
        start: [DATA_TABLE_EXPANSION_COLUMN_ID],
        end: [],
      },
    },
  });

  return (
    <DataTable
      table={table}
      toolbar={false}
      pagination={false}
      renderDetailPanel={({ row }) => (
        <TranslationKeyTranslationsPanel
          record={row.original}
          onCreate={jest.fn()}
        />
      )}
    />
  );
}

describe("TranslationKey translation detail panel", () => {
  it("uses real TanStack expansion state to show and hide nested translations", () => {
    render(<Fixture />);

    const expand = screen.getByRole("button", {
      name: "Expand details for row 31",
    });

    /**
     * The main table already previews translation values in its
     * presentation-only Translations column, so "Detail value" is
     * expected to exist before expansion.
     *
     * What expansion owns is the semantic detail-panel region.
     */
    expect(screen.queryByRole("region")).not.toBeInTheDocument();

    fireEvent.click(expand);

    const region = screen.getByRole("region");

    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent("Translations");
    expect(region).toHaveTextContent("1 of 2 supported locales");
    expect(region).toHaveTextContent("detail_panel_test");
    expect(within(region).getByText("Detail value")).toBeInTheDocument();

    const collapse = screen.getByRole("button", {
      name: "Collapse details for row 31",
    });

    expect(collapse).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(collapse);

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("pins the translation-detail utility column to logical start", () => {
    const { container } = render(<Fixture />);

    const expansionColumn = container.querySelector<HTMLElement>(
      `col[data-column-id="${DATA_TABLE_EXPANSION_COLUMN_ID}"]`,
    );

    expect(expansionColumn).not.toBeNull();
    expect(expansionColumn).toHaveAttribute("data-pinned", "start");
  });
});
