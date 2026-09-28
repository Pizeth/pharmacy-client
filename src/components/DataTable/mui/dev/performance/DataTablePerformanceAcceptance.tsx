"use client";

import {
  Profiler,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ProfilerOnRenderCallback,
  RefObject,
} from "react";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  styled,
} from "@mui/material/styles";

import {
  DataTable,
} from "../../components/DataTable";
import type {
  DataTableCardConfig,
  DataTableDisplayMode,
} from "../../presentation";
import {
  dataTableClasses,
} from "../../styles";
import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
} from "../../table";
import {
  EMPTY_DATA_TABLE_PERFORMANCE_METRICS,
  recordDataTablePerformanceCommit,
} from "./performanceMetrics";
import type {
  DataTablePerformanceMetrics,
} from "./performanceMetrics";

const COMPONENT_NAME =
  "RazethDataTablePerformance";

const Root = styled(
  "main",
  {
    name:
      COMPONENT_NAME,
    slot:
      "Root",
  },
)(({ theme }) => ({
  minHeight:
    "100vh",
  padding:
    theme.spacing(2),
  backgroundColor:
    (
      theme.vars ??
      theme
    ).palette.background.default,
  color:
    (
      theme.vars ??
      theme
    ).palette.text.primary,
}));

const ControlsRoot = styled(
  Paper,
  {
    name:
      COMPONENT_NAME,
    slot:
      "Controls",
  },
)(({ theme }) => ({
  padding:
    theme.spacing(2),
  marginBlock:
    theme.spacing(2),
}));

const MetricsRoot = styled(
  Paper,
  {
    name:
      COMPONENT_NAME,
    slot:
      "Metrics",
  },
)(({ theme }) => ({
  padding:
    theme.spacing(2),
  marginBlockEnd:
    theme.spacing(2),
}));

const TableSurfaceRoot =
  styled(
    "section",
    {
      name:
        COMPONENT_NAME,
      slot:
        "TableSurface",
    },
  )({
    minWidth:
      0,
  });

const DetailRoot = styled(
  "div",
  {
    name:
      COMPONENT_NAME,
    slot:
      "Detail",
  },
)(({ theme }) => ({
  padding:
    theme.spacing(2),
}));

const CardBodyRoot = styled(
  "div",
  {
    name:
      COMPONENT_NAME,
    slot:
      "CardBody",
  },
)(({ theme }) => ({
  display:
    "grid",
  gap:
    theme.spacing(0.5),
}));

export interface DataTablePerformanceRow {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly values: readonly string[];
}

export interface DataTablePerformanceDomCounts {
  readonly rows: number;
  readonly cells: number;
  readonly cards: number;
}

const EMPTY_DOM_COUNTS:
  DataTablePerformanceDomCounts = {
    rows: 0,
    cells: 0,
    cards: 0,
  };

const ROW_COUNT_OPTIONS =
  [
    25,
    100,
    200,
    500,
    1000,
  ] as const;

const COLUMN_COUNT_OPTIONS =
  [
    8,
    16,
    32,
  ] as const;

const columnHelper =
  createMuiDataTableColumnHelper<DataTablePerformanceRow>();

function createRows(
  rowCount: number,
  valueColumnCount: number,
): DataTablePerformanceRow[] {
  return Array.from(
    {
      length:
        rowCount,
    },
    (
      _value,
      rowIndex,
    ) => ({
      id:
        String(
          rowIndex +
            1,
        ),
      name:
        `Record ${String(
          rowIndex + 1,
        ).padStart(
          4,
          "0",
        )}`,
      status:
        rowIndex % 3 ===
        0
          ? "Pending"
          : rowIndex % 3 ===
              1
            ? "Active"
            : "Archived",
      values:
        Array.from(
          {
            length:
              valueColumnCount,
          },
          (
            _cell,
            columnIndex,
          ) =>
            `R${rowIndex + 1} C${columnIndex + 1}`,
        ),
    }),
  );
}

function createColumns(
  columnCount: number,
) {
  const valueColumnCount =
    Math.max(
      0,
      columnCount -
        2,
    );

  return columnHelper.columns([
    columnHelper.accessor(
      "name",
      {
        header:
          "Name",
        size:
          180,
      },
    ),

    ...Array.from(
      {
        length:
          valueColumnCount,
      },
      (
        _value,
        index,
      ) =>
        columnHelper.accessor(
          (
            row,
          ) =>
            row.values[
              index
            ] ??
            "",
          {
            id:
              `value-${index + 1}`,
            header:
              `Value ${index + 1}`,
            size:
              140,
          },
        ),
    ),

    columnHelper.accessor(
      "status",
      {
        header:
          "Status",
        size:
          140,
      },
    ),
  ]);
}

const cardConfig:
  DataTableCardConfig<DataTablePerformanceRow> =
  {
    enableSelection:
      true,
    enableExpansion:
      true,

    renderHeader: ({
      row,
    }) => (
      <Typography
        component="strong"
        variant="subtitle2"
      >
        {
          row.original
            .name
        }
      </Typography>
    ),

    renderBody: ({
      row,
    }) => (
      <CardBodyRoot>
        <Typography variant="body2">
          {
            row.original
              .values[0]
          }
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {
            row.original
              .status
          }
        </Typography>
      </CardBodyRoot>
    ),
  };

export interface PerformanceTableProps {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly displayMode: DataTableDisplayMode;
  readonly onProfile: ProfilerOnRenderCallback;
  readonly surfaceRef:
    RefObject<HTMLElement | null>;
}

const PerformanceTable =
  memo(
    function PerformanceTable(
      props:
        PerformanceTableProps,
    ) {
      const {
        rowCount,
        columnCount,
        displayMode,
        onProfile,
        surfaceRef,
      } = props;

      const columns =
        useMemo(
          () =>
            createColumns(
              columnCount,
            ),
          [
            columnCount,
          ],
        );

      const data =
        useMemo(
          () =>
            createRows(
              rowCount,
              Math.max(
                0,
                columnCount -
                  2,
              ),
            ),
          [
            columnCount,
            rowCount,
          ],
        );

      const table =
        useMuiDataTable({
          columns,
          data,

          getRowId: (
            row,
          ) =>
            row.id,

          enableSorting:
            true,
          enableMultiSort:
            true,
          enableRowSelection:
            true,
          enableRowPinning:
            true,
          keepPinnedRows:
            false,
          enableColumnPinning:
            true,

          getRowCanExpand:
            () =>
              true,

          initialState: {
            pagination: {
              pageIndex:
                0,
              pageSize:
                rowCount,
            },

            columnPinning: {
              start: [
                "name",
              ],
              end: [
                "status",
              ],
            },
          },
        });

      const toggleFirstSelection =
        (): void => {
          const first =
            table.getRow(
              "1",
            );

          first.toggleSelected(
            !first.getIsSelected(),
          );
        };

      const toggleFirstExpansion =
        (): void => {
          const first =
            table.getRow(
              "1",
            );

          first.toggleExpanded(
            !first.getIsExpanded(),
          );
        };

      const toggleSort =
        (): void => {
          table.setSorting(
            (
              current,
            ) => [
              {
                id:
                  "name",
                desc:
                  current[0]
                    ?.id ===
                  "name"
                    ? !current[0]
                        .desc
                    : false,
              },
            ],
          );
        };

      return (
        <>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Button
              type="button"
              variant="outlined"
              onClick={
                toggleFirstSelection
              }
            >
              Toggle first-row selection
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={
                toggleFirstExpansion
              }
            >
              Toggle first-row expansion
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={
                toggleSort
              }
            >
              Toggle name sort
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                table.resetSorting();
                table.resetRowSelection();
                table.resetExpanded();
              }}
            >
              Reset interactions
            </Button>
          </Stack>

          <TableSurfaceRoot
            ref={
              surfaceRef
            }
          >
            <Profiler
              id="DataTablePerformance"
              onRender={
                onProfile
              }
            >
              <DataTable
                table={
                  table
                }
                card={
                  cardConfig
                }
                displayMode={
                  displayMode
                }
                toolbar={
                  false
                }
                pagination={
                  false
                }
                selectionBar={{}}
                renderDetailPanel={({
                  row,
                }) => (
                  <DetailRoot>
                    <Typography variant="body2">
                      Detail panel for{" "}
                      {
                        row
                          .original
                          .name
                      }
                    </Typography>
                  </DetailRoot>
                )}
                containerProps={{
                  style: {
                    maxHeight:
                      "65vh",
                  },
                  tabIndex:
                    0,
                  "aria-label":
                    "Performance table scroll viewport",
                }}
              />
            </Profiler>
          </TableSurfaceRoot>
        </>
      );
    },
  );

function formatDuration(
  duration: number,
): string {
  return `${duration.toFixed(
    2,
  )} ms`;
}

/**
 * Synthetic development-only performance baseline surface.
 *
 * This fixture intentionally measures the current non-virtualized renderer
 * before any virtualization dependency or production behavior is introduced.
 */
export function DataTablePerformanceAcceptance() {
  const [
    rowCount,
    setRowCount,
  ] =
    useState<number>(
      200,
    );

  const [
    columnCount,
    setColumnCount,
  ] =
    useState<number>(
      16,
    );

  const [
    displayMode,
    setDisplayMode,
  ] =
    useState<DataTableDisplayMode>(
      "table",
    );

  const [
    fixtureVersion,
    setFixtureVersion,
  ] =
    useState(0);

  const [
    metrics,
    setMetrics,
  ] =
    useState<DataTablePerformanceMetrics>(
      EMPTY_DATA_TABLE_PERFORMANCE_METRICS,
    );

  const [
    domCounts,
    setDomCounts,
  ] =
    useState<DataTablePerformanceDomCounts>(
      EMPTY_DOM_COUNTS,
    );

  const surfaceRef =
    useRef<HTMLElement>(
      null,
    );

  const readDomCounts =
    useCallback(
      (): void => {
        const root =
          surfaceRef.current;

        if (!root) {
          return;
        }

        setDomCounts({
          rows:
            root.querySelectorAll(
              "tbody tr",
            ).length,
          cells:
            root.querySelectorAll(
              "tbody td",
            ).length,
          cards:
            root.querySelectorAll(
              `.${dataTableClasses.cardItem}`,
            ).length,
        });
      },
      [],
    );

  const handleProfile =
    useCallback<ProfilerOnRenderCallback>(
      (
        _id,
        phase,
        actualDuration,
        baseDuration,
      ) => {
        setMetrics(
          (
            previous,
          ) =>
            recordDataTablePerformanceCommit(
              previous,
              phase,
              actualDuration,
              baseDuration,
            ),
        );

        if (
          typeof window !==
          "undefined"
        ) {
          window.requestAnimationFrame(
            readDomCounts,
          );
        }
      },
      [
        readDomCounts,
      ],
    );

  const resetMeasurements =
    (): void => {
      setMetrics(
        EMPTY_DATA_TABLE_PERFORMANCE_METRICS,
      );

      setDomCounts(
        EMPTY_DOM_COUNTS,
      );

      /**
       * Remount the fixture so the next profiler sample includes a clean mount.
       */
      setFixtureVersion(
        (
          previous,
        ) =>
          previous +
          1,
      );
    };

  return (
    <Root>
      <Typography
        component="h1"
        variant="h4"
      >
        DataTable performance baseline
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Development-only, non-virtualized baseline. Compare measurements only
        in the same browser, build mode, viewport and hardware. These numbers
        are evidence, not CI pass/fail thresholds.
      </Typography>

      <ControlsRoot variant="outlined">
        <Stack
          direction={{
            xs:
              "column",
            md:
              "row",
          }}
          spacing={2}
          alignItems={{
            xs:
              "stretch",
            md:
              "center",
          }}
        >
          <FormControl
            size="small"
            fullWidth
          >
            <InputLabel id="performance-row-count-label">
              Rows
            </InputLabel>

            <Select
              labelId="performance-row-count-label"
              label="Rows"
              value={
                rowCount
              }
              onChange={(
                event,
              ) => {
                setRowCount(
                  Number(
                    event
                      .target
                      .value,
                  ),
                );
              }}
            >
              {ROW_COUNT_OPTIONS.map(
                (
                  option,
                ) => (
                  <MenuItem
                    key={
                      option
                    }
                    value={
                      option
                    }
                  >
                    {
                      option
                    }
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            fullWidth
          >
            <InputLabel id="performance-column-count-label">
              Columns
            </InputLabel>

            <Select
              labelId="performance-column-count-label"
              label="Columns"
              value={
                columnCount
              }
              onChange={(
                event,
              ) => {
                setColumnCount(
                  Number(
                    event
                      .target
                      .value,
                  ),
                );
              }}
            >
              {COLUMN_COUNT_OPTIONS.map(
                (
                  option,
                ) => (
                  <MenuItem
                    key={
                      option
                    }
                    value={
                      option
                    }
                  >
                    {
                      option
                    }
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            fullWidth
          >
            <InputLabel id="performance-display-mode-label">
              Presentation
            </InputLabel>

            <Select
              labelId="performance-display-mode-label"
              label="Presentation"
              value={
                displayMode
              }
              onChange={(
                event,
              ) => {
                setDisplayMode(
                  event
                    .target
                    .value as DataTableDisplayMode,
                );
              }}
            >
              <MenuItem value="table">
                Table
              </MenuItem>

              <MenuItem value="card">
                Card
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            type="button"
            variant="contained"
            onClick={
              resetMeasurements
            }
          >
            Reset measurement
          </Button>
        </Stack>
      </ControlsRoot>

      <MetricsRoot variant="outlined">
        <Stack
          direction={{
            xs:
              "column",
            md:
              "row",
          }}
          spacing={3}
          flexWrap="wrap"
          useFlexGap
        >
          <Typography variant="body2">
            Commits:{" "}
            {
              metrics.commitCount
            }
          </Typography>

          <Typography variant="body2">
            Last:{" "}
            {
              formatDuration(
                metrics.lastActualDurationMs,
              )
            }
          </Typography>

          <Typography variant="body2">
            Average:{" "}
            {
              formatDuration(
                metrics.averageActualDurationMs,
              )
            }
          </Typography>

          <Typography variant="body2">
            Max:{" "}
            {
              formatDuration(
                metrics.maxActualDurationMs,
              )
            }
          </Typography>

          <Typography variant="body2">
            Base:{" "}
            {
              formatDuration(
                metrics.lastBaseDurationMs,
              )
            }
          </Typography>

          <Typography variant="body2">
            DOM rows:{" "}
            {
              domCounts.rows
            }
          </Typography>

          <Typography variant="body2">
            DOM cells:{" "}
            {
              domCounts.cells
            }
          </Typography>

          <Typography variant="body2">
            Card row nodes:{" "}
            {
              domCounts.cards
            }
          </Typography>
        </Stack>
      </MetricsRoot>

      <PerformanceTable
        key={
          `${fixtureVersion}:${rowCount}:${columnCount}:${displayMode}`
        }
        rowCount={
          rowCount
        }
        columnCount={
          columnCount
        }
        displayMode={
          displayMode
        }
        onProfile={
          handleProfile
        }
        surfaceRef={
          surfaceRef
        }
      />
    </Root>
  );
}
