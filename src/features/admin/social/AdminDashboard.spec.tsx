import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminDashboard } from "./AdminDashboard";
import { socialApi } from "./api";
import { useAdminAccess } from "./useAdminAccess";
jest.mock("./useAdminAccess", () => ({ useAdminAccess: jest.fn() }));
jest.mock("@/components/layouts/ResourcePage", () => ({ ResourcePage: ({ children }: { children: React.ReactNode }) => children }));
const provider = { id: 1, key: "telegram", name: "Telegram", websiteUrl: "https://t.me", icon: "telegram", isEnabled: true };
const profile = { id: 5, providerId: 1, handle: "admin", url: "https://t.me/admin", provider };
beforeEach(() => {
  jest.mocked(useAdminAccess).mockReturnValue({ allowed: true, isLoading: false, data: { id: 12, name: "Admin" } } as ReturnType<typeof useAdminAccess>);
  jest.spyOn(socialApi, "providers").mockResolvedValue([provider]);
  jest.spyOn(socialApi, "profiles").mockResolvedValue([profile]);
});
afterEach(() => jest.restoreAllMocks());
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={client}><ThemeProvider theme={createTheme()}><AdminDashboard /></ThemeProvider></QueryClientProvider>);
  return client;
}
it("edits a user profile and refreshes the shared footer query", async () => {
  const save = jest.spyOn(socialApi, "saveProfile").mockResolvedValue(profile);
  const client = mount();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  fireEvent.click(screen.getByText("Profile settings"));
  fireEvent.click(await screen.findByRole("button", { name: "Edit Telegram profile" }));
  fireEvent.change(screen.getByLabelText("Profile URL"), { target: { value: "https://t.me/updated" } });
  fireEvent.click(screen.getByRole("button", { name: "Save profile" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(12, expect.objectContaining({ url: "https://t.me/updated" }), 5));
  await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["site-footer"] }));
});
it("clears the previous edit when switching users", async () => {
  mount();
  fireEvent.click(await screen.findByRole("button", { name: "Edit Telegram profile" }));
  fireEvent.change(screen.getByLabelText("User ID"), { target: { value: "21" } });
  expect(screen.getByLabelText(/Handle/)).toHaveValue("");
  expect(screen.queryByRole("button", { name: "Save profile" })).not.toBeInTheDocument();
  await waitFor(() => expect(socialApi.profiles).toHaveBeenCalledWith(21, expect.any(AbortSignal)));
});
