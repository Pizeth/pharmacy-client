import { Refine, type DataProvider, type LiveEvent, type LiveProvider } from "@refinedev/core";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useLayoutEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { useTranslationKeyDataTable } from "../table/useTranslationKeyDataTable";
import { queryTranslationKeys } from "../api";
import type { TranslationKey } from "../schemas";
import { translationKeyRefineDataProvider } from "./translationKeyRefineDataProvider";
import { TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME } from "./translationKeyRefineDataTableAdapter";

jest.mock("../api", () => ({ queryTranslationKeys: jest.fn() }));
jest.mock("@/lib/realtime/productionLiveProvider", () => ({ productionRealtimeEnabled: true }));
jest.mock("../table/useTranslationKeyFilterOptions", () => ({ useTranslationKeyFilterOptions: () => ({
  categoryOptions: [], localeOptions: [], loading: false, fetching: false, error: undefined, refresh: jest.fn(),
}) }));
const query = jest.mocked(queryTranslationKeys);
const row = (id: number, key: string): TranslationKey => ({ id, key, description: null, categoryId: 1,
  createdAt: "2026-11-01T00:00:00Z", updatedAt: "2026-11-01T00:00:00Z",
  translationCategory: { id: 1, name: "common", description: null }, translations: [] });
let rows: TranslationKey[];
let notify: ((event: LiveEvent) => void) | undefined;
const unsubscribe = jest.fn();
const provider: LiveProvider = { subscribe(options) { notify = options.callback; return options; }, unsubscribe };
const unsupported = async (): Promise<never> => { throw new Error("wrong provider"); };
const fallback = { getList: unsupported, getOne: unsupported, create: unsupported,
  update: unsupported, deleteOne: unsupported, getApiUrl: () => "" } as DataProvider;
let current: ReturnType<typeof useTranslationKeyDataTable>;
function Fixture() {
  const controller = useTranslationKeyDataTable({ enableRowSelection: true, enableTranslationDetails: true });
  useLayoutEffect(() => { current = controller; });
  const [mode, setMode] = useState<"table" | "card">("table");
  return <><button onClick={() => setMode(value => value === "table" ? "card" : "table")}>Presentation</button>
    <DataTable table={controller.table} toolbar={false} displayMode={mode} pagination={false}
      card={{ renderBody: ({ row }) => row.original.key }} />
    <output data-testid="selection">{JSON.stringify(controller.table.state.rowSelection)}</output></>;
}
function mount() {
  return render(<Refine liveProvider={provider} dataProvider={{ default: fallback,
    [TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME]: translationKeyRefineDataProvider }}
    options={{ disableTelemetry: true, liveMode: "off" }}><Fixture /></Refine>);
}
const event = (id: string, type = "updated", recordId = "1"): LiveEvent => ({ channel: "resources/translations",
  type, date: new Date(), payload: { eventId: id, id: recordId } });
beforeEach(() => {
  jest.clearAllMocks(); rows = [row(1, "Original")]; notify = undefined;
  query.mockImplementation(async () => ({ requestStatus: "SUCCESS", statusCode: 200, statusText: "OK",
    data: { data: [...rows], metadata: { currentPage: 1, pageSize: 25, totalItems: rows.length,
      totalPages: 1, hasNextPage: false, hasPreviousPage: false } } }));
});

it("updates actual table/card output via the generic refetch policy, deduplicates bursts and cleans up", async () => {
  const view = mount();
  await screen.findByText("Original");
  await waitFor(() => expect(notify).toBeDefined());
  act(() => current.table.setRowSelection({ "1": true, offpage: true }));
  rows = [row(1, "External change")];
  const before = query.mock.calls.length;
  act(() => { notify!(event("change1")); notify!(event("change1")); notify!(event("change2")); });
  await screen.findByText("External change");
  expect(query.mock.calls.length).toBe(before + 1);
  expect(current.table.state.rowSelection).toEqual({ "1": true, offpage: true });
  fireEvent.click(screen.getByText("Presentation"));
  expect(screen.getByText("External change")).toBeInTheDocument();
  rows = [row(1, "Recovered")];
  act(() => notify!(event("reconnect", "invalidate")));
  await screen.findByText("Recovered");
  rows = [];
  act(() => notify!(event("deleted", "deleted")));
  expect(current.table.state.rowSelection).toEqual({ offpage: true });
  await waitFor(() => expect(screen.queryByText("Recovered")).not.toBeInTheDocument());
  view.unmount(); expect(unsubscribe).toHaveBeenCalled();
});

it("keeps active sorting/filter/page query state authoritative after notifications", async () => {
  const view = mount(); await screen.findByText("Original");
  act(() => {
    current.table.setSorting([{ id: "key", desc: true }]);
    current.table.setGlobalFilter("Original");
  });
  await waitFor(() => expect(current.server.isFetching).toBe(false));
  const state = current.query.state;
  act(() => notify!(event("query-change", "invalidate")));
  await waitFor(() => expect(query.mock.calls.length).toBeGreaterThanOrEqual(3));
  expect(current.query.state).toEqual(state);
  view.unmount();
});

it("performs a trailing canonical refresh when an event arrives during a stale in-flight request", async () => {
  const view = mount(); await screen.findByText("Original");
  let finish!: (result: Awaited<ReturnType<typeof queryTranslationKeys>>) => void;
  query.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  act(() => current.refresh());
  await waitFor(() => expect(current.server.isFetching).toBe(true));
  rows = [row(1, "After in-flight mutation")];
  act(() => notify!(event("during-request", "invalidate")));
  // Let the burst window expire while the original request is still pending.
  await new Promise(resolve => setTimeout(resolve, 300));
  await act(async () => finish({ requestStatus: "SUCCESS", statusCode: 200, statusText: "OK",
    data: { data: [row(1, "Stale response")], metadata: { currentPage: 1, pageSize: 25,
      totalItems: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false } } }));
  await screen.findByText("After in-flight mutation");
  view.unmount();
});
