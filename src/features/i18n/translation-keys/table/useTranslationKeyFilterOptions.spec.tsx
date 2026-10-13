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
beforeEach(() => {
  jest.mocked(getTranslationCategories).mockReset();
});

it("recovers category choices after a controlled request failure and Retry", async () => {
  const request = jest.mocked(getTranslationCategories);
  const categoryError = new Error("Category lookup unavailable");
  const recovery = {
    requestStatus: "SUCCESS" as const,
    statusCode: 200,
    statusText: "OK",
    data: [
      { id: 1, name: "common", description: null },
      { id: 2, name: "auth", description: null },
    ],
  };

  request.mockRejectedValueOnce(categoryError).mockResolvedValueOnce(recovery);

  const { result } = renderHook(useTranslationKeyFilterOptions);

  await waitFor(() => expect(result.current.error).toBe(categoryError));
  expect(result.current.fetching).toBe(false);
  expect(result.current.categoryOptions).toEqual([]);
  // Locale options do not depend on a successful category lookup.
  expect(result.current.localeOptions).toEqual([
    { label: "English", value: "en" },
    { label: "Khmer", value: "km" },
  ]);

  act(() => result.current.refresh());

  await waitFor(() =>
    expect(result.current.categoryOptions).toEqual([
      { label: "auth", value: 2 },
      { label: "common", value: 1 },
    ]),
  );

  expect(request).toHaveBeenCalledTimes(2);
  expect(result.current.error).toBeUndefined();
  expect(result.current.loading).toBe(false);
  expect(result.current.fetching).toBe(false);
  expect(result.current.localeOptions).toEqual([
    { label: "English", value: "en" },
    { label: "Khmer", value: "km" },
  ]);
});

it("ignores an obsolete category response even if transport ignores abort", async () => {
  const request = jest.mocked(getTranslationCategories);
  type CategoriesResponse = Awaited<ReturnType<typeof getTranslationCategories>>;
  let resolveObsolete!: (response: CategoriesResponse) => void;

  request
    .mockImplementationOnce(
      () => new Promise<CategoriesResponse>((resolve) => {
        resolveObsolete = resolve;
      }),
    )
    .mockResolvedValueOnce({
      requestStatus: "SUCCESS",
      statusCode: 200,
      statusText: "OK",
      data: [{ id: 2, name: "auth", description: null }],
    });

  const { result } = renderHook(useTranslationKeyFilterOptions);
  expect(request).toHaveBeenCalledTimes(1);

  act(() => result.current.refresh());
  await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  expect(request.mock.calls[0]?.[0]?.aborted).toBe(true);

  await waitFor(() =>
    expect(result.current.categoryOptions).toEqual([
      { label: "auth", value: 2 },
    ]),
  );

  await act(async () => {
    resolveObsolete({
      requestStatus: "SUCCESS",
      statusCode: 200,
      statusText: "OK",
      data: [{ id: 1, name: "stale", description: null }],
    });
    await Promise.resolve();
  });

  expect(result.current.categoryOptions).toEqual([
    { label: "auth", value: 2 },
  ]);
  expect(result.current.error).toBeUndefined();
  expect(result.current.fetching).toBe(false);
});
