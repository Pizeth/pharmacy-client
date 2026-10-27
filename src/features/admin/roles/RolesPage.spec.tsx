import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RolesPage } from "./RolesPage";
import { RoleFormPage } from "./RoleFormPage";
import { rolesApi } from "./api";
import { applicationRole, roleMetadata } from "./role.test-fixtures";
jest.mock("next/navigation", () => {
  const router = { push: jest.fn() };
  return { useRouter: () => router };
});
jest.mock("@/components/layouts/ResourcePage", () => ({
  ResourcePage: ({ children }: { children: React.ReactNode }) => children,
}));
beforeEach(() => {
  localStorage.clear();
  jest.spyOn(rolesApi, "metadata").mockResolvedValue(roleMetadata);
  jest.spyOn(rolesApi, "list").mockResolvedValue([applicationRole]);
  jest.spyOn(rolesApi, "get").mockResolvedValue(applicationRole);
});
afterEach(() => jest.restoreAllMocks());
function mount(content: React.ReactNode = <RolesPage />) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <ThemeProvider theme={createTheme()}>{content}</ThemeProvider>
    </QueryClientProvider>,
  );
  return client;
}
it("requires selection and edits through the shared modal and current version", async () => {
  const save = jest.spyOn(rolesApi, "save").mockResolvedValue(applicationRole);
  const client = mount();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  const select = await screen.findByRole("checkbox", { name: "Select row 5" });
  expect(
    screen.getByRole("button", { name: "Edit role for row 5" }),
  ).toBeDisabled();
  fireEvent.click(select);
  fireEvent.click(screen.getByRole("button", { name: "Edit role for row 5" }));
  const dialog = within(await screen.findByRole("dialog"));
  const input = await dialog.findByLabelText("Description");
  expect(
    dialog.getByRole("link", { name: "Open dedicated edit page" }),
  ).toHaveAttribute("href", "/admin/roles/edit/5");
  fireEvent.change(input, { target: { value: "Changed description" } });
  fireEvent.click(dialog.getByRole("button", { name: "Save changes" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ description: "Changed description" }),
      expect.objectContaining({ id: 5, objectVersionId: 2 }),
    ),
  );
  await waitFor(() =>
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["admin-users"] }),
  );
});
it("filters the complete role catalogue with the shared search", async () => {
  jest
    .mocked(rolesApi.list)
    .mockResolvedValue([
      applicationRole,
      { ...applicationRole, id: 6, name: "AUDITOR" },
    ]);
  mount();
  await screen.findByRole("checkbox", { name: "Select row 6" });
  fireEvent.change(screen.getByRole("textbox", { name: "Search table" }), {
    target: { value: "AUDITOR" },
  });
  await waitFor(() =>
    expect(
      screen.queryByRole("checkbox", { name: "Select row 5" }),
    ).not.toBeInTheDocument(),
  );
  expect(
    screen.getByRole("checkbox", { name: "Select row 6" }),
  ).toBeInTheDocument();
});
it("does not fetch role grants when super-admin authorization is denied", async () => {
  jest
    .mocked(rolesApi.metadata)
    .mockRejectedValue(
      new Error(
        "An active application super administrator is required to manage roles.",
      ),
    );
  mount();
  expect(
    await screen.findByText(/active application super administrator/),
  ).toBeInTheDocument();
  expect(rolesApi.list).not.toHaveBeenCalled();
});
it("reuses the form on the dedicated create route", async () => {
  mount(<RoleFormPage mode="create" />);
  expect(await screen.findByLabelText(/Role name/)).toBeInTheDocument();
  expect(
    screen.getByRole("group", { name: "TranslationKey" }),
  ).toBeInTheDocument();
});
it("rejects invalid dedicated route IDs before network access", () => {
  mount(<RoleFormPage mode="edit" recordId="-1" />);
  expect(screen.getByText("Invalid role ID.")).toBeInTheDocument();
  expect(rolesApi.metadata).not.toHaveBeenCalled();
  expect(rolesApi.get).not.toHaveBeenCalled();
});
