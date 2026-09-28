import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  DataTable,
} from "../../components/DataTable";
import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "../../table";
import {
  DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
} from "../types";
import {
  createDataTablePersistedVisualStateStorageKey,
} from "../storage";
import type {
  DataTablePersistenceStorage,
} from "../storage";

interface Row {
  readonly id:
    number;
  readonly name:
    string;
  readonly role:
    string;
}

const helper =
  createMuiDataTableColumnHelper<Row>();

const columns =
  helper.columns([
    helper.accessor(
      "id",
      {
        header:
          "ID",
      },
    ),
    helper.accessor(
      "name",
      {
        header:
          "Name",
      },
    ),
    helper.accessor(
      "role",
      {
        header:
          "Role",
      },
    ),
  ]);

const data:
  Row[] =
    [
      {
        id:
          1,
        name:
          "Alpha",
        role:
          "Admin",
      },
    ];

function createMemoryStorage():
  DataTablePersistenceStorage & {
    readonly values:
      Map<string, string>;
  } {
  const values =
    new Map<
      string,
      string
    >();

  return {
    values,

    getItem(
      key,
    ) {
      return (
        values.get(key) ??
        null
      );
    },

    setItem(
      key,
      value,
    ) {
      values.set(
        key,
        value,
      );
    },

    removeItem(
      key,
    ) {
      values.delete(
        key,
      );
    },
  };
}

describe(
  "DataTable persisted visual-state controller",
  () => {
    it(
      "hydrates only uncontrolled visual state and writes later changes",
      async () => {
        const storage =
          createMemoryStorage();

        const storageId =
          "controller-fixture";

        const key =
          createDataTablePersistedVisualStateStorageKey(
            storageId,
          );

        storage.setItem(
          key,
          JSON.stringify({
            version:
              DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
            density:
              "spacious",
            columnVisibility: {
              role:
                false,
            },
            columnOrder: [
              "name",
              "id",
              "role",
            ],
            columnSizing: {
              name:
                240,
            },
            columnPinning: {
              start: [
                "id",
              ],
              end: [],
            },
          }),
        );

        let table:
          ReturnType<
            typeof useMuiDataTable<Row>
          >;

        function Fixture() {
          table =
            useMuiDataTable({
              columns,
              data,
            });

          return (
            <DataTable
              table={
                table
              }
              pagination={
                false
              }
              persistence={{
                storage,
                storageId,
              }}
            />
          );
        }

        render(
          <Fixture />,
        );

        await waitFor(
          () => {
            expect(
              screen.queryByRole(
                "columnheader",
                {
                  name:
                    "Role",
                },
              ),
            ).toBeNull();
          },
        );

        expect(
          screen
            .getAllByRole(
              "columnheader",
            )
            .map(
              (
                node,
              ) =>
                node.textContent,
            ),
        ).toEqual([
          "Name",
          "ID",
        ]);

        expect(
          table!
            .getColumn(
              "name",
            )
            ?.getSize(),
        ).toBe(
          240,
        );

        expect(
          table!
            .getColumn(
              "id",
            )
            ?.getIsPinned(),
        ).toBe(
          "start",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Change table density",
            },
          ),
        );

        const spacious =
          await screen.findByRole(
            "menuitem",
            {
              name:
                "Spacious",
            },
          );

        expect(
          spacious,
        ).toHaveClass(
          "Mui-selected",
        );

        act(
          () => {
            table!.setColumnVisibility(
              {
                role:
                  true,
              },
            );

            table!.setColumnSizing(
              {
                name:
                  300,
              },
            );
          },
        );

        await waitFor(
          () => {
            const persisted =
              JSON.parse(
                storage.values.get(
                  key,
                ) ??
                  "{}",
              );

            expect(
              persisted.columnVisibility,
            ).toEqual({
              role:
                true,
            });

            expect(
              persisted.columnSizing,
            ).toEqual({
              name:
                300,
            });

            expect(
              persisted.density,
            ).toBe(
              "spacious",
            );
          },
        );
      },
    );

    it(
      "never hydrates over explicitly controlled TanStack or density state",
      async () => {
        const storage =
          createMemoryStorage();

        const storageId =
          "controlled-fixture";

        const key =
          createDataTablePersistedVisualStateStorageKey(
            storageId,
          );

        storage.setItem(
          key,
          JSON.stringify({
            version:
              DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
            density:
              "spacious",
            columnVisibility: {
              role:
                false,
            },
          }),
        );

        const onDensityChange =
          jest.fn();

        function Fixture() {
          const table =
            useMuiDataTable({
              columns,
              data,
              state: {
                columnVisibility: {
                  role:
                    true,
                },
              },
              onColumnVisibilityChange:
                jest.fn(),
            });

          return (
            <DataTable
              table={
                table
              }
              density="compact"
              onDensityChange={
                onDensityChange
              }
              pagination={
                false
              }
              persistence={{
                storage,
                storageId,
              }}
            />
          );
        }

        render(
          <Fixture />,
        );

        await waitFor(
          () => {
            expect(
              screen.getByRole(
                "columnheader",
                {
                  name:
                    "Role",
                },
              ),
            ).toBeInTheDocument();
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Change table density",
            },
          ),
        );

        const compact =
          await screen.findByRole(
            "menuitem",
            {
              name:
                "Compact",
            },
          );

        expect(
          compact,
        ).toHaveClass(
          "Mui-selected",
        );

        const persisted =
          JSON.parse(
            storage.values.get(
              key,
            ) ??
              "{}",
          );

        expect(
          persisted,
        ).not.toHaveProperty(
          "density",
        );

        expect(
          persisted,
        ).not.toHaveProperty(
          "columnVisibility",
        );
      },
    );

    it(
      "ignores persisted card presentation when the current table has no card renderer",
      async () => {
        const storage =
          createMemoryStorage();

        const storageId =
          "table-only-fixture";

        storage.setItem(
          createDataTablePersistedVisualStateStorageKey(
            storageId,
          ),
          JSON.stringify({
            version:
              DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
            displayMode:
              "card",
          }),
        );

        function Fixture() {
          const table =
            useMuiDataTable({
              columns,
              data,
            });

          return (
            <DataTable
              table={
                table
              }
              toolbar={
                false
              }
              pagination={
                false
              }
              persistence={{
                storage,
                storageId,
              }}
            />
          );
        }

        render(
          <Fixture />,
        );

        await waitFor(
          () => {
            expect(
              screen.getByRole(
                "table",
              ),
            ).toBeInTheDocument();
          },
        );
      },
    );
  },
);
