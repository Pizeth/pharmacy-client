import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsersPage } from "./UsersPage";
import { usersApi } from "./api";
import { useAdminAccess } from "../social/useAdminAccess";
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: {} } }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("../social/useAdminAccess", () => ({ useAdminAccess: jest.fn() }));
jest.mock("@/components/layouts/ResourcePage", () => ({ ResourcePage: ({ children }: { children: React.ReactNode }) => children }));
const record = { id: "12", name: "Jane", email: "jane@example.com", role: "user" };
beforeEach(() => { localStorage.clear(); jest.spyOn(usersApi, "roles").mockResolvedValue([]); });
afterEach(() => jest.restoreAllMocks());
function mount() {
  jest.mocked(useAdminAccess).mockReturnValue({ allowed: true, isLoading: false, data: { id: "1" } } as ReturnType<typeof useAdminAccess>);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={client}><UsersPage /></QueryClientProvider>);
}
it("loads live users and requires selection before editing", async () => {
  const list = jest.spyOn(usersApi, "list").mockResolvedValue({ users: [record], total: 1 }); mount();
  expect(await screen.findByText("jane@example.com")).toBeInTheDocument();
  expect(list).toHaveBeenCalledWith(0, 25, "", [], [], expect.any(AbortSignal));
  const edit = screen.getByRole("button", { name: "Edit user for row 12" }); expect(edit).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox", { name: "Select row 12" }));
  const selectedEdit = screen.getByRole("button", { name: "Edit user for row 12" }); expect(selectedEdit).toBeEnabled(); fireEvent.click(selectedEdit);
  expect(within(screen.getByRole("dialog")).getByRole("textbox", { name: /Name/ })).toHaveValue("Jane");
});
it("shows API failures with a retry control", async () => {
  const list = jest.spyOn(usersApi, "list").mockRejectedValueOnce(new Error("Permission denied")).mockResolvedValue({ users: [], total: 0 }); mount();
  expect(await screen.findByText("Permission denied")).toBeInTheDocument(); fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() => expect(list).toHaveBeenCalledTimes(2)); expect(await screen.findByText("No users found.")).toBeInTheDocument();
});

it("requests the next page from the server instead of paginating a partial dataset locally", async () => {
  const list = jest.spyOn(usersApi, "list").mockResolvedValueOnce({ users: [record], total: 26 }).mockResolvedValue({ users: [{ ...record, id: "13", name: "Next user" }], total: 26 }); mount();
  await screen.findByText("Jane"); fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  await waitFor(() => expect(list).toHaveBeenCalledWith(1, 25, "", [], [], expect.any(AbortSignal))); expect(await screen.findByText("Next user")).toBeInTheDocument();
});

it("loads role, account and profile details only after expanding the row", async () => {
  jest.spyOn(usersApi, "list").mockResolvedValue({ users: [record], total: 1 });
  const detail = jest.spyOn(usersApi, "detail").mockResolvedValue({ ...record, userRole: { id: 2, name: "Administrator", icon: "shield", color: "#3578ab" }, accounts: [{ id: "1", providerId: "google" }], profile: { firstName: "Jane", lastName: "Doe", phone: "012345678" } });
  mount(); await screen.findByText("Jane"); expect(detail).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Expand details for row 12" }));
  expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
  expect(screen.getByText("google")).toBeInTheDocument(); expect(screen.getByText("Administrator")).toBeInTheDocument();
});

it("restores Details and Selection to the left even with an older saved layout", async () => {
  localStorage.setItem("razeth:data-table:visual-state:v1:admin%2Fusers", JSON.stringify({ version: 1, columnPinning: { start: [], end: ["__dataTableExpansion"] } }));
  jest.spyOn(usersApi, "list").mockResolvedValue({ users: [record], total: 1 }); mount();
  const expand = await screen.findByRole("button", { name: "Expand details for row 12" });
  const row = expand.closest("tr")!;
  await waitFor(() => expect(row.children[0]).toContainElement(expand));
  expect(row.children[1]).toContainElement(screen.getByRole("checkbox", { name: "Select row 12" }));
  expect(screen.queryByRole("link", { name: "Open create page" })).not.toBeInTheDocument();
});

it("combines text and status filters using the shared i18n filter controls", async () => {
 const list = jest.spyOn(usersApi, "list").mockResolvedValue({ users: [record], total: 1 }); mount();
 await screen.findByText("Jane");
 fireEvent.click(screen.getByRole("button", { name: "Show column filters" }));
 fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: "Jane" } });
 fireEvent.mouseDown(screen.getByRole("combobox", { name: "Status" }));
 fireEvent.click(screen.getByRole("option", { name: "Active" }));
 await waitFor(() => expect(list).toHaveBeenLastCalledWith(0, 25, "", expect.arrayContaining([{ id: "name", value: "Jane" }, { id: "banned", value: "false" }]), [], expect.any(AbortSignal)));
 expect(screen.getByRole("button", { name: "Hide column filters" })).toBeInTheDocument();
});
