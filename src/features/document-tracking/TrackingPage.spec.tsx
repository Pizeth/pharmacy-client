import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { TrackingPage } from "./TrackingPage";
import { trackingApi } from "./api";
import { trackingMetadata, trackingRecord } from "./tracking.test-fixtures";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/components/layouts/ResourcePage", () => ({
  ResourcePage: ({ children }: { children: React.ReactNode }) => children,
}));
beforeEach(() => {
  localStorage.clear();
  jest.spyOn(trackingApi, "metadata").mockResolvedValue(trackingMetadata);
  jest
    .spyOn(trackingApi, "list")
    .mockResolvedValue({ documents: [trackingRecord], total: 1 });
  jest.spyOn(trackingApi, "get").mockResolvedValue(trackingRecord);
});
afterEach(() => jest.restoreAllMocks());
function mount() {
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <ThemeProvider theme={createTheme()}>
        <TrackingPage />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}
it("uses the real table with selection-gated actions and a dedicated create link inside the modal", async () => {
  mount();
  const select = await screen.findByRole("checkbox", {
    name: `Select row ${trackingRecord.id}`,
  });
  const row = within(select.closest("tr")!);
  expect(
    row.getByRole("button", {
      name: `Update progress for row ${trackingRecord.id}`,
    }),
  ).toBeDisabled();
  fireEvent.click(select);
  expect(
    row.getByRole("button", {
      name: `Update progress for row ${trackingRecord.id}`,
    }),
  ).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Register document" }));
  const dialog = within(screen.getByRole("dialog"));
  expect(dialog.getByLabelText(/Document title/)).toBeInTheDocument();
  expect(
    dialog.getByRole("link", { name: "Open dedicated create page" }),
  ).toHaveAttribute("href", "/admin/documents/create");
});
it("sends global search to the backend and retains the active table", async () => {
  mount();
  await screen.findByRole("checkbox", {
    name: `Select row ${trackingRecord.id}`,
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Search table" }), {
    target: { value: "leave" },
  });
  await waitFor(() =>
    expect(trackingApi.list).toHaveBeenLastCalledWith(
      0,
      25,
      "leave",
      [],
      [],
      expect.any(AbortSignal),
    ),
  );
});
it("allows handlers to see their register but hides admin creation and editing", async () => {
  jest.mocked(trackingApi.metadata).mockResolvedValue({
    ...trackingMetadata,
    actor: { ...trackingMetadata.actor, isAdmin: false },
  });
  jest.mocked(trackingApi.list).mockResolvedValue({
    documents: [
      {
        ...trackingRecord,
        permissions: { canManage: false, canAttach: false, canUpdateProgress: true },
      },
    ],
    total: 1,
  });
  mount();
  const select = await screen.findByRole("checkbox", {
    name: `Select row ${trackingRecord.id}`,
  });
  fireEvent.click(select);
  expect(
    screen.queryByRole("button", { name: "Register document" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: `Edit document for row ${trackingRecord.id}`,
    }),
  ).toBeDisabled();
  expect(
    screen.getByRole("button", {
      name: `Update progress for row ${trackingRecord.id}`,
    }),
  ).toBeEnabled();
});
it("does not query the register when account metadata is denied", async () => {
  jest
    .mocked(trackingApi.metadata)
    .mockRejectedValue(
      new Error("Your account cannot access document tracking."),
    );
  mount();
  expect(
    await screen.findByText("Your account cannot access document tracking."),
  ).toBeInTheDocument();
  expect(trackingApi.list).not.toHaveBeenCalled();
});
