import {
  createDataTablePersistedVisualState,
} from "./createDataTablePersistedVisualState";
import {
  normalizeDataTablePersistedVisualState,
} from "./normalizeDataTablePersistedVisualState";
import {
  DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
} from "./types";

const columnIds = [
  "select",
  "name",
  "status",
  "actions",
] as const;

describe(
  "DataTable persisted visual-state schema",
  () => {
    it(
      "round-trips the safe visual-state families",
      () => {
        const state =
          createDataTablePersistedVisualState({
            columnIds,
            density:
              "comfortable",
            displayMode:
              "card",
            columnVisibility: {
              name:
                true,
              status:
                false,
            },
            columnOrder: [
              "status",
              "name",
              "select",
              "actions",
            ],
            columnSizing: {
              name:
                240,
              status:
                160,
            },
            columnPinning: {
              start: [
                "select",
              ],
              end: [
                "actions",
              ],
            },
          });

        expect(state).toEqual({
          version:
            DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
          density:
            "comfortable",
          displayMode:
            "card",
          columnVisibility: {
            name:
              true,
            status:
              false,
          },
          columnOrder: [
            "status",
            "name",
            "select",
            "actions",
          ],
          columnSizing: {
            name:
              240,
            status:
              160,
          },
          columnPinning: {
            start: [
              "select",
            ],
            end: [
              "actions",
            ],
          },
        });
      },
    );

    it(
      "drops removed columns and appends newly introduced columns in current order",
      () => {
        expect(
          normalizeDataTablePersistedVisualState(
            {
              version:
                1,
              columnVisibility: {
                removed:
                  false,
                name:
                  false,
              },
              columnOrder: [
                "removed",
                "status",
                "status",
                "name",
              ],
              columnSizing: {
                removed:
                  999,
                name:
                  220,
              },
              columnPinning: {
                start: [
                  "removed",
                  "select",
                ],
                end: [
                  "actions",
                  "select",
                ],
              },
            },
            {
              columnIds,
            },
          ),
        ).toEqual({
          version:
            1,
          columnVisibility: {
            name:
              false,
          },
          columnOrder: [
            "status",
            "name",
            "select",
            "actions",
          ],
          columnSizing: {
            name:
              220,
          },
          columnPinning: {
            start: [
              "select",
            ],
            end: [
              "actions",
            ],
          },
        });
      },
    );

    it(
      "ignores malformed optional fields without losing other valid preferences",
      () => {
        expect(
          normalizeDataTablePersistedVisualState(
            {
              version:
                1,
              density:
                "tiny",
              displayMode:
                "gallery",
              columnVisibility: {
                name:
                  "yes",
                status:
                  false,
              },
              columnOrder:
                "status,name",
              columnSizing: {
                name:
                  -1,
                status:
                  Number.NaN,
                actions:
                  88,
              },
              columnPinning: {
                start:
                  "select",
                end: [
                  "actions",
                ],
              },
            },
            {
              columnIds,
            },
          ),
        ).toEqual({
          version:
            1,
          columnVisibility: {
            status:
              false,
          },
          columnSizing: {
            actions:
              88,
          },
          columnPinning: {
            start: [],
            end: [
              "actions",
            ],
          },
        });
      },
    );

    it.each([
      null,
      [],
      "invalid",
      {
        version:
          2,
      },
      {
        version:
          "1",
      },
    ])(
      "rejects unsupported persistence envelopes: %p",
      (
        input,
      ) => {
        expect(
          normalizeDataTablePersistedVisualState(
            input,
            {
              columnIds,
            },
          ),
        ).toBeUndefined();
      },
    );

    it(
      "does not admit semantic query or transient row state into the persisted contract",
      () => {
        const state =
          normalizeDataTablePersistedVisualState(
            {
              version:
                1,
              density:
                "compact",

              pagination: {
                pageIndex:
                  7,
              },
              sorting: [
                {
                  id:
                    "name",
                  desc:
                    true,
                },
              ],
              columnFilters: [
                {
                  id:
                    "status",
                  value:
                    "active",
                },
              ],
              globalFilter:
                "secret",
              rowSelection: {
                "42":
                  true,
              },
              rowPinning: {
                top: [
                  "42",
                ],
              },
              expanded: {
                "42":
                  true,
              },
              fullscreen:
                true,
            },
            {
              columnIds,
            },
          );

        expect(state).toEqual({
          version:
            1,
          density:
            "compact",
        });

        expect(
          Object.keys(
            state ?? {},
          ),
        ).toEqual([
          "version",
          "density",
        ]);
      },
    );
  },
);
