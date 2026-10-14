"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProfilerOnRenderCallback } from "react";
import { Button, Stack, Typography, styled } from "@mui/material";
import { PerformanceTable, type DataTablePerformanceRow } from "./DataTablePerformanceAcceptance";
import { createRenderDiagnosticCollector } from "./renderDiagnosticCollector";
import { DataTableRenderDiagnosticsContext } from "../../diagnostics/renderDiagnostics";
import type { MuiDataTableInstance } from "../../table";
import { dataTableClasses } from "../../styles";
import { afterTwoFrames, summarizeSamples } from "./browserMeasurements";
import { assertProfilingRunActive, hasRenderedFirstRow, hasRenderedRowState } from "./profilingOutputChecks";

const Root = styled("main", { name: "RazethDataTablePerformance", slot: "Root" })(({ theme }) => ({
  padding: theme.spacing(2), color: (theme.vars ?? theme).palette.text.primary,
  background: (theme.vars ?? theme).palette.background.default,
}));
const Report = styled("pre", { name: "RazethDataTablePerformance", slot: "Report" })({
  whiteSpace: "pre-wrap", overflowWrap: "anywhere",
});

type Mode = "table" | "card";
type Probe = "off" | "default" | "owner" | "row";
interface Case { rows: number; columns: number; mode: Mode; probe: Probe; serial: number }
interface Sample {
  action: string;
  repeat: number;
  elapsedMs: number;
  reactMs: number | null;
  reactCommits: number | null;
  rowsCommitted: number | null;
  cellsCommitted: number | null;
  ownerCommits: number | null;
  bodyCommits: number | null;
  modelMs: number | null;
  dispatchMs: number | null;
  elements: number;
  rows: number;
  cells: number;
  cards: number;
  longTasks: number | null;
  longTaskMaxMs: number | null;
  scrollTop: number | null;
  scrollLeft: number | null;
}
interface Result { label: string; status: string; samples: Sample[] }
const NORMAL: ReadonlyArray<readonly [number, number, Mode]> = [
  [25, 8, "table"], [25, 8, "card"], [100, 8, "table"], [100, 16, "table"],
  [100, 16, "card"], [200, 8, "table"], [200, 16, "table"], [200, 16, "card"],
];

export function ProductionProfiling({ buildMode }: { readonly buildMode: "browser" | "react" }) {
  const [fixture, setFixture] = useState<Case | null>(null);
  const [status, setStatus] = useState("Ready");
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);
  const [environment, setEnvironment] = useState("");
  const [stressAllowed, setStressAllowed] = useState(false);
  const surfaceRef = useRef<HTMLElement>(null);
  const tableRef = useRef<MuiDataTableInstance<DataTablePerformanceRow> | null>(null);
  const serial = useRef(0);
  const cancelled = useRef(false);
  const collector = useMemo(() => createRenderDiagnosticCollector(), []);
  const observer = useMemo(() => ({ ...collector.observer, narrowRowSelection: fixture?.probe === "row" }), [collector, fixture?.probe]);
  const onTable = useCallback((table: MuiDataTableInstance<DataTablePerformanceRow>) => { tableRef.current = table; }, []);
  const onProfile = useCallback<ProfilerOnRenderCallback>((_id, _phase, duration) => {
    collector.recordReactCommit(duration);
  }, [collector]);
  useEffect(() => {
    setEnvironment(JSON.stringify({ userAgent: navigator.userAgent, viewport: [innerWidth, innerHeight],
      devicePixelRatio, logicalCpus: navigator.hardwareConcurrency, buildMode }));
    return () => { cancelled.current = true; };
  }, [buildMode]);

  const run = async (track: "normal" | "compare" | "500" | "1000") => {
    if (running) return;
    setRunning(true);
    cancelled.current = false;
    const cases: Array<readonly [number, number, Mode, Probe]> = track === "normal"
      ? NORMAL.map(([rows, columns, mode]) => [rows, columns, mode, "off"])
      : track === "compare"
        ? (["default", "owner", "row"] as const).flatMap((probe) =>
          ([[100, 8], [200, 16]] as const).map(([rows, columns]) => [rows, columns, "table", probe] as const))
        : [[track === "500" ? 500 : 1000, track === "500" ? 16 : 32, "table", "off"]];
    try {
      for (const [rows, columns, initialMode, probe] of cases) {
        const result: Result = { label: `${rows}x${columns} ${initialMode} ${probe}`, status: "RUNNING", samples: [] };
        const tasks: PerformanceEntry[] = [];
        const supportsTasks = typeof PerformanceObserver !== "undefined" && PerformanceObserver.supportedEntryTypes.includes("longtask");
        const taskObserver = supportsTasks ? new PerformanceObserver((list) => tasks.push(...list.getEntries())) : null;
        taskObserver?.observe({ type: "longtask" });
        let mode = initialMode;
        const table = () => {
          if (!tableRef.current) throw new Error("Table did not mount");
          return tableRef.current;
        };
        const viewport = () => surfaceRef.current?.querySelector<HTMLElement>(
          mode === "table" ? '[aria-label="Performance table scroll viewport"]' : `.${dataTableClasses.cardContainer}`,
        );
        const measure = async (action: string, repeat: number, update: () => void, verify: () => boolean) => {
          assertProfilingRunActive(cancelled.current, document.visibilityState);
          collector.begin(action);
          const start = performance.now();
          if (probe === "off") update(); else collector.measureDispatch(update);
          await afterTwoFrames();
          assertProfilingRunActive(cancelled.current, document.visibilityState);
          const end = performance.now();
          if (end - start > 15_000) throw new Error(`BLOCKED: ${action} exceeded 15 seconds`);
          if (!verify()) throw new Error(`BLOCKED: ${action} output mismatch`);
          const snapshot = collector.snapshot();
          const root = surfaceRef.current;
          // Reads/reporting occur after the measured frame interval.
          tasks.push(...(taskObserver?.takeRecords() ?? []));
          const relevant = tasks.filter((entry) => entry.startTime < end && entry.startTime + entry.duration > start);
          if (repeat > 0) result.samples.push({
            action, repeat, elapsedMs: +(end - start).toFixed(2),
            reactMs: snapshot.reactCommits ? snapshot.reactActualMs : null,
            reactCommits: snapshot.reactCommits || null,
            rowsCommitted: probe === "off" || mode === "card" ? null : snapshot.uniqueRows,
            cellsCommitted: probe === "off" || mode === "card" ? null : snapshot.uniqueCells,
            ownerCommits: probe === "off" ? null : snapshot.ownerCommits,
            bodyCommits: probe === "off" ? null : snapshot.bodyCommits,
            modelMs: probe === "off" ? null : snapshot.modelReadMs,
            dispatchMs: probe === "off" ? null : snapshot.stateDispatchMs,
            elements: root?.querySelectorAll("*").length ?? 0,
            rows: root?.querySelectorAll("tbody tr[data-row-id]").length ?? 0,
            cells: root?.querySelectorAll("tbody td").length ?? 0,
            cards: root?.querySelectorAll(`.${dataTableClasses.cardItem}`).length ?? 0,
            longTasks: supportsTasks ? relevant.length : null,
            longTaskMaxMs: supportsTasks ? Math.max(0, ...relevant.map((entry) => entry.duration)) : null,
            scrollTop: viewport()?.scrollTop ?? null, scrollLeft: viewport()?.scrollLeft ?? null,
          });
        };
        const count = () => surfaceRef.current?.querySelectorAll(mode === "table" ? "tbody tr[data-row-id]" : `.${dataTableClasses.cardItem}`).length;
        try {
          for (let repeat = 0; repeat <= 3; repeat++) {
            setStatus(`${result.label}: ${repeat === 0 ? "warm-up" : `repeat ${repeat}`}`);
            // Allow the progress UI to settle outside the sample.
            await afterTwoFrames();
            mode = initialMode;
            await measure("mount", repeat, () => {
              tableRef.current = null;
              setFixture({ rows, columns, mode, probe, serial: ++serial.current });
            }, () => count() === rows);
            for (const selected of [true, false]) await measure(selected ? "select" : "deselect", repeat,
              () => table().getRow("1").toggleSelected(selected),
              () => table().getRow("1").getIsSelected() === selected &&
                hasRenderedRowState(surfaceRef.current, mode, "1", selected, false));
            for (const expanded of [true, false]) await measure(expanded ? "expand" : "collapse", repeat,
              () => table().getRow("1").toggleExpanded(expanded),
              () => table().getRow("1").getIsExpanded() === expanded &&
                hasRenderedRowState(surfaceRef.current, mode, "1", false, expanded));
            for (const desc of [true, false]) await measure(desc ? "sort-desc" : "sort-asc", repeat,
              () => table().setSorting([{ id: "name", desc }]),
              () => table().getRowModel().rows[0]?.id === (desc ? String(rows) : "1") &&
                hasRenderedFirstRow(surfaceRef.current, mode, desc ? String(rows) : "1"));
            for (const filter of ["Record 0001", ""]) await measure(filter ? "filter" : "clear-filter", repeat,
              () => table().setGlobalFilter(filter), () => count() === (filter ? 1 : rows));
            await measure("scroll-vertical", repeat, () => {
              const view = viewport(); if (view) view.scrollTop = view.scrollHeight;
            }, () => { const view = viewport(); return !!view && (view.scrollHeight <= view.clientHeight || view.scrollTop > 0); });
            await measure("scroll-horizontal", repeat, () => {
              const view = viewport(); if (view) view.scrollLeft = view.scrollWidth;
            }, () => { const view = viewport(); return !!view && (view.scrollWidth <= view.clientWidth || view.scrollLeft > 0); });
            if (track === "normal") {
              // Seed shared state outside switching samples and verify both views retain it.
              table().getRow("1").toggleSelected(true);
              table().getRow("1").toggleExpanded(true);
              await afterTwoFrames();
              assertProfilingRunActive(cancelled.current, document.visibilityState);
              for (const target of [initialMode === "table" ? "card" : "table", initialMode] as const) {
                const store = table().store;
                await measure(`switch-${target}`, repeat, () => {
                  mode = target;
                  setFixture((current) => current ? { ...current, mode: target } : current);
                }, () => table().store === store && count() === rows && table().getRow("1").getIsSelected() &&
                  table().getRow("1").getIsExpanded() &&
                  hasRenderedRowState(surfaceRef.current, target, "1", true, true));
              }
            }
          }
          assertProfilingRunActive(cancelled.current, document.visibilityState);
          result.status = "PASS";
        } catch (error) {
          result.status = error instanceof Error ? error.message : "BLOCKED: unknown error";
        } finally {
          taskObserver?.disconnect();
          setResults((previous) => [...previous, result]);
        }
        if (track === "500") setStressAllowed(result.status === "PASS" && result.samples.every((sample) => sample.elapsedMs < 5000));
        if (result.status !== "PASS") throw new Error(result.status);
      }
      assertProfilingRunActive(cancelled.current, document.visibilityState);
      setStatus("Complete");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "BLOCKED");
    } finally {
      setRunning(false);
      setFixture({ rows: 25, columns: 8, mode: "table", probe: "off", serial: ++serial.current });
    }
  };

  const summary = results.map((result) => ({ label: result.label, status: result.status,
    actions: [...new Set(result.samples.map((sample) => sample.action))].map((action) => {
      const samples = result.samples.filter((sample) => sample.action === action);
      return { action, ms: summarizeSamples(samples.map((sample) => sample.elapsedMs)),
        reactMs: summarizeSamples(samples.flatMap((sample) => sample.reactMs === null ? [] : [sample.reactMs])),
        affected: samples.map((sample) => [sample.ownerCommits, sample.bodyCommits, sample.rowsCommitted, sample.cellsCommitted]),
        elements: samples.map((sample) => sample.elements),
        longTasks: samples.map((sample) => sample.longTasks) };
    }),
  }));
  return <Root>
    <Typography component="h1" variant="h4">Local production profiling</Typography>
    <Typography>{buildMode} build. Dispatch-to-two-frame intervals are responsiveness proxies, not INP or exact paint durations. One warm-up and three samples. Diagnostics only in comparison track.</Typography>
    <Typography>Environment: {environment}</Typography>
    <Stack direction="row" spacing={1}>
      <Button disabled={running} onClick={() => void run("normal")}>Run normal matrix</Button>
      <Button disabled={running} onClick={() => void run("compare")}>Compare subscriptions</Button>
      <Button disabled={running} onClick={() => void run("500")}>Run 500 stress</Button>
      <Button disabled={running || !stressAllowed} onClick={() => void run("1000")}>Run 1000 stress</Button>
      <Button disabled={!running} onClick={() => { cancelled.current = true; }}>Stop</Button>
    </Stack>
    <Typography role="status">{status}</Typography>
    <details><summary>Measurement summary</summary><Report>{JSON.stringify(summary)}</Report></details>
    <details><summary>Raw samples</summary><Report>{JSON.stringify(results)}</Report></details>
    <Button disabled={!results.length} onClick={() => {
      const url = URL.createObjectURL(new Blob([JSON.stringify({ environment, buildMode, results }, null, 2)], { type: "application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = `datatable-${buildMode}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }}>Download raw samples</Button>
    {fixture && <DataTableRenderDiagnosticsContext.Provider value={fixture.probe === "off" ? null : observer}>
      <PerformanceTable key={fixture.serial} rowCount={fixture.rows} columnCount={fixture.columns}
        displayMode={fixture.mode} narrowOwner={fixture.probe === "owner" || fixture.probe === "row"}
        diagnostics={fixture.probe === "off" ? null : collector} onProfile={onProfile}
        surfaceRef={surfaceRef} onTable={onTable} />
    </DataTableRenderDiagnosticsContext.Provider>}
  </Root>;
}
