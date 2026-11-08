import { dataTableClasses } from "../../styles";
import { assertProfilingRunActive, hasRenderedFirstRow, hasRenderedRowState, hasViewportCoverage } from "./profilingOutputChecks";

function fixture() {
  const root = document.createElement("section");
  root.innerHTML = `
    <table><tbody>
      <tr data-row-id="2" data-selected="true"><td>Record 0002</td></tr>
      <tr data-row-id="1"><td>Record 0001</td></tr>
      <tr><td data-detail-panel="2">Detail</td></tr>
    </tbody></table>
    <div class="${dataTableClasses.cardItem}" data-row-id="2" data-selected="true"><div data-detail-panel="2">Detail</div></div>
    <div class="${dataTableClasses.cardItem}" data-row-id="1"></div>
  `;
  return root;
}
it("rejects a stale rendered sort even if the model's first row changed", () => {
  const root = fixture();
  expect(hasRenderedFirstRow(root, "table", "2")).toBe(true);
  expect(hasRenderedFirstRow(root, "table", "1")).toBe(false);
  expect(hasRenderedFirstRow(root, "card", "2")).toBe(true);
  expect(hasRenderedFirstRow(root, "card", "1")).toBe(false);
});
it("checks selection and detail output separately in both renderers", () => {
  const root = fixture();
  for (const mode of ["table", "card"] as const) {
    expect(hasRenderedRowState(root, mode, "2", true, true)).toBe(true);
    expect(hasRenderedRowState(root, mode, "2", false, true)).toBe(false);
    expect(hasRenderedRowState(root, mode, "2", true, false)).toBe(false);
    expect(hasRenderedRowState(root, mode, "1", false, false)).toBe(true);
    expect(hasRenderedRowState(root, mode, "missing", false, false)).toBe(false);
  }
});
it("blocks cancellation or visibility changes even after a measured frame interval", () => {
  expect(() => assertProfilingRunActive(false, "visible")).not.toThrow();
  expect(() => assertProfilingRunActive(true, "visible")).toThrow("BLOCKED");
  expect(() => assertProfilingRunActive(false, "hidden")).toThrow("BLOCKED");
});

it("rejects interior gaps and stale order even when window endpoints cover the viewport", () => {
  const view = document.createElement("div");
  view.innerHTML = '<table><thead><tr><th>Title</th></tr></thead><tbody><tr data-row-id="1"><td>One</td></tr><tr data-row-id="2"><td>Two</td></tr><tr data-row-id="3"><td>Three</td></tr></tbody></table>';
  Object.defineProperty(view, "clientHeight", { value: 150 });
  view.getBoundingClientRect = () => new DOMRect(0, 0, 300, 150);
  const head = view.querySelector("thead");
  if (!head) throw new Error("Header missing");
  head.getBoundingClientRect = () => new DOMRect(0, 0, 300, 30);
  const rows = Array.from(view.querySelectorAll<HTMLTableRowElement>("tbody tr"));
  rows.forEach((row, index) => { row.getBoundingClientRect = () => new DOMRect(0, 30 + index * 40, 300, 40); });
  expect(hasViewportCoverage(view, 3, 50, ["1", "2", "3"])).toBe(true);
  expect(hasViewportCoverage(view, 3, 50, ["1", "3", "2"])).toBe(false);
  rows.forEach((row, index) => { row.getBoundingClientRect = () => new DOMRect(0, 35 + index * 40, 300, 40); });
  expect(hasViewportCoverage(view, 3, 50, ["1", "2", "3"])).toBe(false);
  rows.forEach((row, index) => { row.getBoundingClientRect = () => new DOMRect(0, 25 + index * 40, 300, 40); });
  expect(hasViewportCoverage(view, 3, 50, ["1", "2", "3"])).toBe(false);
  rows.forEach((row, index) => { row.getBoundingClientRect = () => new DOMRect(0, 30 + index * 40, 300, 40); });
  const middle = rows.at(1);
  if (!middle) throw new Error("Middle row missing");
  middle.getBoundingClientRect = () => new DOMRect(0, 80, 300, 30);
  expect(hasViewportCoverage(view, 3, 50, ["1", "2", "3"])).toBe(false);
});

it("rejects near-full rendering despite continuous viewport coverage", () => {
  const view = document.createElement("div");
  const ids = Array.from({ length: 200 }, (_, index) => String(index + 1));
  const table = document.createElement("table");
  const body = table.createTBody();
  for (const id of ids.slice(1)) {
    const row = body.insertRow();
    row.dataset.rowId = id;
    row.insertCell().textContent = id;
  }
  view.append(table);
  Object.defineProperty(view, "clientHeight", { value: 150 });
  view.getBoundingClientRect = () => new DOMRect(0, 0, 300, 150);
  Array.from(view.querySelectorAll("tr")).forEach((row, index) => {
    row.getBoundingClientRect = () => new DOMRect(0, (index - 195) * 40, 300, 40);
  });
  expect(hasViewportCoverage(view, 199, 200, ids)).toBe(false);
});
