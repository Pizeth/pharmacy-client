import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  DataTable,
} from "@/components/DataTable";
import type {
  DataTableRowAction,
} from "@/components/DataTable";
import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "@/components/DataTable/mui/table";

import type {
  TranslationKey,
} from "../schemas";
import {
  createTranslationKeyCardConfig,
} from "./translationKeyCardConfig";

const record: TranslationKey = {
  id:
    31,
  key:
    "auth.login.title",
  description:
    "Login heading",
  categoryId:
    1,
  createdAt:
    "2026-09-01T00:00:00.000Z",
  updatedAt:
    "2026-09-02T00:00:00.000Z",
  translationCategory: {
    id:
      1,
    name:
      "auth",
    description:
      null,
  },
  translations: [
    {
      id:
        301,
      keyId:
        31,
      locale:
        "en",
      value:
        "Sign in",
      createdAt:
        "2026-09-01T00:00:00.000Z",
      updatedAt:
        "2026-09-02T00:00:00.000Z",
    },
    {
      id:
        302,
      keyId:
        31,
      locale:
        "km",
      value:
        "ចូល",
      createdAt:
        "2026-09-01T00:00:00.000Z",
      updatedAt:
        "2026-09-02T00:00:00.000Z",
    },
  ],
};

const helper =
  createMuiDataTableColumnHelper<TranslationKey>();

const columns =
  helper.columns([
    helper.accessor(
      "key",
      {
        header:
          "Key",
      },
    ),
  ]);

const onEdit =
  jest.fn();

const rowActions:
  readonly DataTableRowAction<TranslationKey>[] =
  [
    {
      id:
        "edit",
      label:
        "Edit",
      inline:
        true,
      isDisabled:
        ({
          row,
        }) =>
          !row.getIsSelected(),
      onClick:
        ({
          row,
        }) => {
          onEdit(
            row.original,
          );
        },
    },
  ];

const card =
  createTranslationKeyCardConfig({
    rowActions,
  });

function Fixture() {
  const table =
    useMuiDataTable({
      data: [
        record,
      ],
      columns,
      getRowId:
        (
          row,
        ) =>
          String(
            row.id,
          ),
      enableRowSelection:
        true,
      enableRowPinning:
        true,
      keepPinnedRows:
        false,
      getRowCanExpand:
        () =>
          true,
    });

  return (
    <DataTable
      table={
        table
      }
      card={
        card
      }
      defaultDisplayMode="card"
      toolbar={
        false
      }
      pagination={
        false
      }
      rowPinning={{
        displayMode:
          "select-sticky",
      }}
      renderDetailPanel={({
        row,
      }) => (
        <div>
          Details for{" "}
          {
            row.original
              .key
          }
        </div>
      )}
    />
  );
}

describe(
  "TranslationKey card presentation",
  () => {
    beforeEach(() => {
      onEdit.mockClear();
    });

    it("shares row selection between the front and detail faces", () => {
      render(<Fixture />);
      fireEvent.click(screen.getByRole("button", { name: "Show translations" }));
      const selection = screen.getByRole("checkbox", { name: "Select row 31" });
      expect(selection.closest('[data-face="back"]')).not.toBeNull();
      expect(selection.closest(".MuiCheckbox-root")).toBeVisible();
      fireEvent.click(selection);
      expect(selection).toBeChecked();
      fireEvent.click(screen.getByRole("button", { name: "Back to key" }));
      expect(screen.getByRole("checkbox", { name: "Select row 31" })).toBeChecked();
      expect(screen.getByRole("button", { name: "Edit for row 31" })).toBeEnabled();
    });

    it("keeps key actions on the front when the mouse enters the card", () => {
      render(<Fixture />);
      const edit = screen.getByRole("button", { name: "Edit for row 31" });
      const card = edit.closest('[data-flipped]')!;
      const event = new MouseEvent("pointerover", { bubbles: true });
      Object.defineProperty(event, "pointerType", { value: "mouse" });
      fireEvent(card, event);
      expect(card).toHaveAttribute("data-flipped", "false");
      expect(edit.closest('[data-face="front"]')).not.toBeNull();
      expect(edit).toBeVisible();
    });

    it(
      "renders resource content and shares selection/action state",
      () => {
        render(
          <Fixture />,
        );

        expect(
          screen.getAllByText(
            "auth.login.title",
          )[0],
        ).toBeVisible();

        expect(
          screen.getByText(
            "Login heading",
          ),
        ).toBeVisible();

        expect(
          screen.getByText(
            "Sign in",
          ),
        ).toBeVisible();

        expect(
          screen.getByText(
            "ចូល",
          ),
        ).toBeVisible();

        const edit =
          screen.getByRole(
            "button",
            {
              name:
                "Edit for row 31",
            },
          );

        expect(
          edit,
        ).toBeDisabled();

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Select row 31",
            },
          ),
        );

        expect(
          edit,
        ).not.toBeDisabled();

        fireEvent.click(
          edit,
        );

        expect(
          onEdit,
        ).toHaveBeenCalledWith(
          record,
        );
      },
    );

    it(
      "shares expansion/detail state with the generic card controls",
      () => {
        render(
          <Fixture />,
        );

        expect(
          screen.queryByRole(
            "region",
          ),
        ).toBeNull();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Show translations",
            },
          ),
        );

        expect(
          screen.getByRole(
            "region",
          ),
        ).toHaveTextContent(
          "Details for auth.login.title",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Back to key",
            },
          ),
        );

        expect(
          screen.queryByRole(
            "region",
          ),
        ).toBeNull();
      },
    );
  },
);
