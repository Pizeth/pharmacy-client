import { createRenderDiagnosticCollector } from "./renderDiagnosticCollector";

it("separates repeated commits from unique affected identities and resets action windows", () => {
  const collector = createRenderDiagnosticCollector();
  collector.begin("selection");
  collector.observer.commit("row", "1");
  collector.observer.commit("row", "1");
  collector.observer.commit("cell", "1/name");
  collector.observer.commit("cell", "1/status");
  collector.observer.commit("cell", "2/name");
  collector.recordReactCommit(12);
  collector.recordReactCommit(3);
  expect(collector.snapshot()).toMatchObject({
    operation: "selection", uniqueRows: 1, uniqueCells: 3,
    rowCommits: { "1": 2 }, cellCommitsByRow: { "1": 2, "2": 1 },
    reactCommits: 2, reactActualMs: 15, reactMaxMs: 12,
  });
  collector.begin("sorting");
  expect(collector.snapshot()).toMatchObject({
    operation: "sorting", uniqueRows: 0, uniqueCells: 0,
    rowCommits: {}, cellCommitsByRow: {}, reactCommits: 0,
    reactActualMs: 0, modelReadCalls: 0, stateDispatchMs: 0,
  });
});

it("keeps timed reads and dispatch separate without changing returns or errors", () => {
  const times = [10, 12, 20, 25];
  const collector = createRenderDiagnosticCollector(() => times.shift()!);
  const result = { rows: [] };
  expect(collector.observer.measureRowModel(() => result)).toBe(result);
  const error = new Error("original failure");
  expect(() => collector.measureDispatch(() => { throw error; })).toThrow(error);
  expect(collector.snapshot()).toMatchObject({modelReadCalls: 1, modelReadMs: 2, stateDispatchMs: 5});
});
