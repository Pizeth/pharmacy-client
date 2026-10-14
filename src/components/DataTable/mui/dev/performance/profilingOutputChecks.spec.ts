import { dataTableClasses } from "../../styles";
import { assertProfilingRunActive, hasRenderedFirstRow, hasRenderedRowState } from "./profilingOutputChecks";

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
