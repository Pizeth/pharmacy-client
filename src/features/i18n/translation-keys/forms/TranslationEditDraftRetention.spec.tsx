import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { readTranslationKey } from "../api";
import type { TranslationKey, TranslationValue } from "../schemas";
import { TranslationKeyEditDialog } from "./TranslationKeyEditDialog";
import { TranslationValueEditDialog } from "./TranslationValueEditDialog";

jest.mock("../api", () => ({ readTranslationKey: jest.fn() }));
// Stateful inputs isolate the dialog's mounting policy from field validation/networking.
jest.mock("./TranslationKeyEditForm", () => ({ TranslationKeyEditForm: ({ record }: { record: TranslationKey }) => <input aria-label="Draft" defaultValue={record.key} /> }));
jest.mock("./TranslationValueEditForm", () => ({ TranslationValueEditForm: ({ translation }: { translation: TranslationValue }) => <input aria-label="Draft" defaultValue={translation.value} /> }));
const timestamp = "2026-10-26T00:00:00Z";
const translation: TranslationValue = { id: 2, locale: "en", value: "Original", createdAt: timestamp, updatedAt: timestamp };
const record: TranslationKey = { id: 1, key: "original_key", description: null, categoryId: 1,
  createdAt: timestamp, updatedAt: timestamp, translationCategory: { id: 1, name: "General", description: null }, translations: [translation] };
afterEach(() => jest.resetAllMocks());
it.each(["key", "value"])("retains the %s draft and shows background-refetch errors", async kind => {
  jest.mocked(readTranslationKey).mockResolvedValueOnce(record).mockRejectedValue(new Error("Connection lost"));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={client}>{kind === "key"
    ? <TranslationKeyEditDialog record={record} onClose={jest.fn()} onUpdated={jest.fn()} />
    : <TranslationValueEditDialog record={record} translation={translation} onClose={jest.fn()} onUpdated={jest.fn()} />}</QueryClientProvider>);
  const input = await screen.findByRole("textbox", { name: "Draft" });
  fireEvent.change(input, { target: { value: "Unsaved changes" } });
  await act(async () => { await client.refetchQueries({ queryKey: ["translation-keys"] }); });
  expect(await screen.findByText("Connection lost")).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Draft" })).toBe(input);
  expect(input).toHaveValue("Unsaved changes");
  client.clear();
});
