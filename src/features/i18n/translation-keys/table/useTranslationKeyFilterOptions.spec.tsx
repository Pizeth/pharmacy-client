import { act, renderHook, waitFor } from "@testing-library/react";
import { getTranslationCategories } from "../api";
import { useTranslationKeyFilterOptions } from "./useTranslationKeyFilterOptions";

jest.mock("../api", () => ({ getTranslationCategories: jest.fn() }));

it("starts busy on the first render and clears a failed option request when retrying", async () => {
  const error = new Error("Category request failed");
  const request = jest.mocked(getTranslationCategories);
  request.mockRejectedValueOnce(error);
  request.mockImplementation(() => new Promise(() => {}));
  const renders: boolean[] = [];
  const { result, unmount } = renderHook(() => {
    const state = useTranslationKeyFilterOptions();
    renders.push(state.fetching);
    return state;
  });
  expect(renders[0]).toBe(true);
  await waitFor(() => expect(result.current.error).toBe(error));
  expect(result.current.fetching).toBe(false);
  act(() => result.current.refresh());
  await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  expect(result.current.fetching).toBe(true);
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBeUndefined();
  const signal = request.mock.calls[1][0];
  unmount();
  expect(signal?.aborted).toBe(true);
});
