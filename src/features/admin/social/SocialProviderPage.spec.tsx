import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocialProviderPage } from "./SocialProviderPage";
import { socialApi } from "./api";
import { useAdminAccess } from "./useAdminAccess";

jest.mock("./useAdminAccess", () => ({ useAdminAccess: jest.fn() }));
jest.mock("next/navigation", () => { const router = { push: jest.fn() }; return { useRouter: () => router }; });
jest.mock("@/components/layouts/ResourcePage", () => ({ ResourcePage: ({ children }: { children: React.ReactNode }) => children }));
const provider = { id: 1, key: "telegram", name: "Telegram", websiteUrl: "https://t.me", icon: "telegram", isEnabled: true };
beforeEach(() => {
  localStorage.clear();
  jest.mocked(useAdminAccess).mockReturnValue({ allowed: true, isLoading: false } as ReturnType<typeof useAdminAccess>);
  jest.spyOn(socialApi, "providers").mockResolvedValue([provider]);
});
afterEach(() => jest.restoreAllMocks());
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={client}><ThemeProvider theme={createTheme()}><SocialProviderPage /></ThemeProvider></QueryClientProvider>);
  return client;
}
it("edits a provider through the contract and refreshes footer data", async () => {
  const save = jest.spyOn(socialApi, "saveProvider").mockResolvedValue({ ...provider, name: "Updated" });
  const client = mount();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  fireEvent.click(await screen.findByRole("checkbox", { name: "Select row 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit for row 1" }));
  fireEvent.change(within(screen.getByRole("dialog")).getByLabelText(/Name/), { target: { value: "Updated" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ name: "Updated" }), 1));
  await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["site-footer"] }));
});
it("shows delete conflicts without removing the row", async () => {
  jest.spyOn(socialApi, "deleteProvider").mockRejectedValue(new Error("Provider is in use"));
  mount();
  fireEvent.click(await screen.findByRole("checkbox", { name: "Select row 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete for row 1" }));
  const dialog = screen.getByRole("dialog");
  fireEvent.click(within(dialog).getByRole("button", { name: "Delete provider" }));
  expect(await within(dialog).findByText("Provider is in use")).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(await screen.findByRole("button", { name: "Edit for row 1" })).toBeInTheDocument();
});
it("does not load management data for unauthorized accounts", () => {
  jest.mocked(useAdminAccess).mockReturnValue({ allowed: false, isLoading: false } as ReturnType<typeof useAdminAccess>);
  mount();
  expect(screen.getByText("Administrator access is required.")).toBeInTheDocument();
  expect(socialApi.providers).not.toHaveBeenCalled();
});

it("requires selection for mutations and exposes modal and dedicated create surfaces", async () => {
  mount();
  expect(await screen.findByRole("button", { name: "Edit for row 1" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Delete for row 1" })).toBeDisabled();
  expect(screen.queryByRole("link", { name: "Open create page" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Create provider" }));
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByLabelText(/Provider key/)).toBeInTheDocument();
  expect(within(dialog).getByRole("link", { name: "Open dedicated create page" })).toHaveAttribute("href", "/admin/social-provider/create");
});

it("filters the complete provider dataset with the shared search", async () => {
  jest.mocked(socialApi.providers).mockResolvedValue([provider, { ...provider, id: 2, key: "youtube", name: "YouTube" }]);
  mount();
  expect(await screen.findByRole("checkbox", { name: "Select row 2" })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Search table" }), { target: { value: "YouTube" } });
  await waitFor(() => expect(screen.queryByRole("checkbox", { name: "Select row 1" })).not.toBeInTheDocument());
  expect(screen.getByRole("checkbox", { name: "Select row 2" })).toBeInTheDocument();
});
