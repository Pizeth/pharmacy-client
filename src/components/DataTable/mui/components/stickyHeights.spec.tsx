import { act, render } from "@testing-library/react";
import { DataTableStickyRowMeasurements } from "./DataTableStickyRowMeasurements";
import { getStickyRowOffsets } from "../row-pinning/stickyHeights";

it("stacks independent bands with fractional heights in final displayed order", () => {
  expect(Array.from(getStickyRowOffsets([
    { id: "a", edge: "top", height: 50.8125 },
    { id: "b", edge: "bottom", height: 61.25 },
    { id: "c", edge: "top", height: 73.125 },
    { id: "d", edge: "bottom", height: 42.5 },
    { id: "e", edge: "top", height: 37 },
  ], 36, true))).toEqual([
    ["a", { offset: 36, bottom: 110.125 }],
    ["c", { offset: 86.8125, bottom: 37 }],
    ["e", { offset: 159.9375, bottom: 0 }],
    ["d", { offset: 0 }], ["b", { offset: 42.5 }],
  ]);
});

describe.each(["ltr", "rtl"] as const)("mounted measurements in %s", (direction) => {
  let notify: () => void;
  let observed: Element[];
  let disconnect: jest.Mock;
  let height: Record<string, number>;
  const originalObserver = globalThis.ResizeObserver;
  beforeEach(() => {
    observed = [];
    disconnect = jest.fn();
    height = { a: 50.8125, b: 73.125, c: 42.5 };
    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        notify = () => callback(observed.map(target => {
          const blockSize = height[target.getAttribute("data-row-id") ?? ""] ?? 0;
          return { target, borderBoxSize: [{ blockSize, inlineSize: 100 }],
            contentBoxSize: [], devicePixelContentBoxSize: [],
            contentRect: new DOMRect(0, 0, 100, blockSize) };
        }), this);
      }
      observe(target: Element) { observed.push(target); }
      unobserve() {}
      disconnect = disconnect;
    };
    jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return { x: 0, y: 0, top: 0, left: 0, right: 100, bottom: height[this.dataset.rowId ?? ""] ?? 0,
        width: 100, height: height[this.dataset.rowId ?? ""] ?? 0, toJSON() {} };
    });
  });
  afterEach(() => {
    globalThis.ResizeObserver = originalObserver;
    jest.restoreAllMocks();
  });
  function Fixture({ ids = ["a", "b", "c"], dual = true, top = 36 }: {
    ids?: string[]; dual?: boolean; top?: number;
  }) {
    return <table dir={direction}><DataTableStickyRowMeasurements top={top} fallbackHeight={37} dualEdge={dual}>
      {ids.map(id => <tr key={id} data-row-id={id} data-row-pinned={dual || id !== "c" ? "top" : "bottom"}
        data-row-pinning-sticky="true"><td>{id}</td></tr>)}
      <tr data-detail-panel="true"><td>Separate expanded content</td></tr>
    </DataTableStickyRowMeasurements></table>;
  }
  it("updates resize/content heights, reorders, removes rows, and disconnects on unmount", () => {
    const { container, rerender, unmount } = render(<Fixture />);
    const row = (id: string) => container.querySelector(`tr[data-row-id="${id}"]`);
    expect(observed).toHaveLength(3);
    expect(row("b")).toHaveStyle({ "--DataTable-row-pinned-offset": "86.8125px" });
    jest.mocked(HTMLElement.prototype.getBoundingClientRect).mockClear();
    rerender(<Fixture top={48} />);
    expect(HTMLElement.prototype.getBoundingClientRect).not.toHaveBeenCalled();
    expect(row("b")).toHaveStyle({ "--DataTable-row-pinned-offset": "98.8125px" });
    height.a = 80.25;
    act(() => notify());
    expect(HTMLElement.prototype.getBoundingClientRect).not.toHaveBeenCalled();
    expect(row("b")).toHaveStyle({ "--DataTable-row-pinned-offset": "128.25px" });
    rerender(<Fixture ids={["c", "b", "a"]} />);
    expect(row("c")).toHaveStyle({ "--DataTable-row-pinned-offset": "36px", "--DataTable-row-pinned-bottom-offset": "153.375px" });
    rerender(<Fixture ids={["b", "a"]} top={48} />);
    expect(row("b")).toHaveStyle({ "--DataTable-row-pinned-offset": "48px" });
    expect(row("a")).toHaveStyle({ "--DataTable-row-pinned-offset": "121.125px" });
    const calls = disconnect.mock.calls.length;
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(calls + 1);
  });
  it("excludes bottom rows from the top band and falls back for zero height", () => {
    height.a = 0;
    const { container } = render(<Fixture dual={false} />);
    expect(container.querySelector('[data-row-id="b"]')).toHaveStyle({ "--DataTable-row-pinned-offset": "73px" });
    expect(container.querySelector('[data-row-id="c"]')).toHaveStyle({ "--DataTable-row-pinned-offset": "0px" });
  });
});
