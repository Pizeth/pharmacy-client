import type { DataTableDiagnosticLayer, DataTableRenderDiagnostics } from "../../diagnostics/renderDiagnostics";

export function createRenderDiagnosticCollector(now = () => performance.now()) {
  let operation = "mount";
  let commits: Record<DataTableDiagnosticLayer, Map<string, number>> = {
    owner: new Map(), body: new Map(), row: new Map(), cell: new Map(),
  };
  let modelCalls = 0;
  let modelMs = 0;
  let dispatchMs = 0;
  let reactCommits = 0;
  let reactActualMs = 0;
  let reactMaxMs = 0;
  const observer: DataTableRenderDiagnostics = {
    commit(layer, id) {
      commits[layer].set(id, (commits[layer].get(id) ?? 0) + 1);
    },
    measureRowModel(read) {
      const start = now();
      try { return read(); }
      finally { modelCalls++; modelMs += now() - start; }
    },
  };
  return {
    observer,
    recordReactCommit(actualMs: number) {
      reactCommits++;
      reactActualMs += actualMs;
      reactMaxMs = Math.max(reactMaxMs, actualMs);
    },
    measureDispatch<T>(update: () => T): T {
      const start = now();
      try { return update(); }
      finally { dispatchMs += now() - start; }
    },
    begin(nextOperation: string) {
      operation = nextOperation;
      commits = { owner: new Map(), body: new Map(), row: new Map(), cell: new Map() };
      modelCalls = 0;
      modelMs = 0;
      dispatchMs = 0;
      reactCommits = 0;
      reactActualMs = 0;
      reactMaxMs = 0;
    },
    snapshot() {
      const cellsByRow: Record<string, number> = {};
      for (const [id, count] of commits.cell) {
        const rowId = id.slice(0, id.indexOf("/"));
        cellsByRow[rowId] = (cellsByRow[rowId] ?? 0) + count;
      }
      return {
        operation,
        ownerCommits: [...commits.owner.values()].reduce((a, b) => a + b, 0),
        bodyCommits: [...commits.body.values()].reduce((a, b) => a + b, 0),
        uniqueRows: commits.row.size,
        uniqueCells: commits.cell.size,
        rowCommits: Object.fromEntries(commits.row),
        cellCommitsByRow: cellsByRow,
        modelReadCalls: modelCalls,
        modelReadMs: Number(modelMs.toFixed(3)),
        stateDispatchMs: Number(dispatchMs.toFixed(3)),
        reactCommits,
        reactActualMs: Number(reactActualMs.toFixed(3)),
        reactMaxMs: Number(reactMaxMs.toFixed(3)),
      };
    },
  };
}

export type RenderDiagnosticCollector = ReturnType<typeof createRenderDiagnosticCollector>;
