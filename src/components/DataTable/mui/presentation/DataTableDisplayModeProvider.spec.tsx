import {
  act,
  renderHook,
} from "@testing-library/react";
import type { ReactNode } from "react";

import {
  DataTableDisplayModeProvider,
  useDataTableDisplayMode,
} from "./DataTableDisplayModeProvider";

describe("DataTableDisplayModeProvider", () => {
  it("defaults to table presentation", () => {
    const { result } = renderHook(
      () => useDataTableDisplayMode(),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <DataTableDisplayModeProvider>
            {children}
          </DataTableDisplayModeProvider>
        ),
      },
    );

    expect(result.current.displayMode).toBe("table");
  });

  it("owns uncontrolled presentation state and reports changes", () => {
    const onDisplayModeChange = jest.fn();

    const { result } = renderHook(
      () => useDataTableDisplayMode(),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <DataTableDisplayModeProvider
            defaultDisplayMode="table"
            onDisplayModeChange={onDisplayModeChange}
          >
            {children}
          </DataTableDisplayModeProvider>
        ),
      },
    );

    act(() => {
      result.current.setDisplayMode("card");
    });

    expect(result.current.displayMode).toBe("card");
    expect(onDisplayModeChange).toHaveBeenCalledWith("card");
  });

  it("does not mutate a controlled mode while still reporting requests", () => {
    const onDisplayModeChange = jest.fn();

    const { result } = renderHook(
      () => useDataTableDisplayMode(),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <DataTableDisplayModeProvider
            displayMode="table"
            onDisplayModeChange={onDisplayModeChange}
          >
            {children}
          </DataTableDisplayModeProvider>
        ),
      },
    );

    act(() => {
      result.current.setDisplayMode("card");
    });

    expect(result.current.displayMode).toBe("table");
    expect(onDisplayModeChange).toHaveBeenCalledWith("card");
  });

  it("preserves auto as a requested mode without resolving viewport policy", () => {
    const { result } = renderHook(
      () => useDataTableDisplayMode(),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <DataTableDisplayModeProvider defaultDisplayMode="auto">
            {children}
          </DataTableDisplayModeProvider>
        ),
      },
    );

    expect(result.current.displayMode).toBe("auto");
  });
});
