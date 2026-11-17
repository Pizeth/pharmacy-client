import { act, renderHook } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDocumentTrackingRealtime } from "./useDocumentTrackingRealtime";

const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();
jest.mock("@/lib/realtime/productionLiveProvider", () => ({
  createProductionLiveProvider: () => ({
    subscribe: (...args: unknown[]) => mockSubscribe(...args),
    unsubscribe: (...args: unknown[]) => mockUnsubscribe(...args),
  }),
}));
jest.mock("@tanstack/react-query", () => ({ useQueryClient: jest.fn() }));

it("refreshes lists and details while preserving editor queries and unsubscribes on exit", () => {
  const invalidateQueries = jest.fn().mockResolvedValue(undefined);
  jest.mocked(useQueryClient).mockReturnValue({ invalidateQueries } as unknown as ReturnType<typeof useQueryClient>);
  const handle = {};
  mockSubscribe.mockReturnValue(handle);
  const { rerender, unmount } = renderHook(useDocumentTrackingRealtime, { initialProps: false });
  expect(mockSubscribe).not.toHaveBeenCalled();

  rerender(true);
  expect(mockSubscribe).toHaveBeenCalledTimes(1);
  const [{ callback }] = mockSubscribe.mock.calls[0];
  act(() => { callback(); });
  const [{ queryKey, predicate }] = invalidateQueries.mock.calls[0];
  expect(queryKey).toEqual(["document-tracking"]);
  expect(predicate({ queryKey: ["document-tracking", "list"] })).toBe(true);
  expect(predicate({ queryKey: ["document-tracking", "detail"] })).toBe(true);
  expect(predicate({ queryKey: ["document-tracking", "page-editor"] })).toBe(false);

  unmount();
  expect(mockUnsubscribe).toHaveBeenCalledWith(handle);
});
