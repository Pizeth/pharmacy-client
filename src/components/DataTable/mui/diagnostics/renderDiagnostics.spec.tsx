import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { DataTableDiagnosticCommit, DataTableRenderDiagnosticsContext } from "./renderDiagnostics";

it("counts committed output without adding DOM nodes", () => {
  const commit = jest.fn();
  const observer = { commit, measureRowModel: <T,>(read: () => T) => read() };
  const { container, rerender } = render(
    <DataTableRenderDiagnosticsContext.Provider value={observer}>
      <DataTableDiagnosticCommit layer="row" id="8" />
    </DataTableRenderDiagnosticsContext.Provider>,
  );
  expect(container).toBeEmptyDOMElement();
  expect(commit).toHaveBeenCalledWith("row", "8");
  rerender(<DataTableDiagnosticCommit layer="row" id="8" />);
  expect(commit).toHaveBeenCalledTimes(1);
});

it("does not count output from a suspended, uncommitted render", () => {
  const commit = jest.fn();
  const pending = new Promise<never>(() => {});
  function Pending(): never { throw pending; }
  render(
    <DataTableRenderDiagnosticsContext.Provider value={{commit, measureRowModel: <T,>(read: () => T) => read()}}>
      <Suspense fallback={<span>Waiting</span>}>
        <DataTableDiagnosticCommit layer="cell" id="8/key" />
        <Pending />
      </Suspense>
    </DataTableRenderDiagnosticsContext.Provider>,
  );
  expect(screen.getByText("Waiting")).toBeVisible();
  expect(commit).not.toHaveBeenCalled();
});
