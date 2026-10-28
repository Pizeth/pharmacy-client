import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoleForm } from "./RoleForm";
import { rolesApi, RoleRequestError } from "./api";
import { applicationRole, roleMetadata } from "./role.test-fixtures";
afterEach(() => jest.restoreAllMocks());
it("keeps HEX entry and the badge color picker synchronized", async () => {
  mount(<RoleForm mode="create" metadata={roleMetadata} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  const hex = screen.getByRole("textbox", { name: "Badge color" });
  const picker = screen.getByLabelText("Pick badge color");
  fireEvent.change(hex, { target: { value: "#112233" } });
  fireEvent.click(picker);
  expect(screen.getByText("#112233")).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole("slider", { name: "Color wheel" }), { key: "ArrowRight" });
  expect(hex).not.toHaveValue("#112233");
  await waitFor(() => expect((hex as HTMLInputElement).value).toMatch(/^#[0-9a-f]{6}$/));
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  fireEvent.change(hex, { target: { value: "" } });
  expect(hex).toHaveValue("");
  fireEvent.click(picker);
  expect(screen.getByText("#1565C0")).toBeInTheDocument();
});
function mount(content: React.ReactNode) {
  return render(
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
      <ThemeProvider
        theme={createTheme({
          components: {
            RazethAdminRoles: {
              styleOverrides: {
                permissionGroup: { borderColor: "rgb(1, 2, 3)" },
              },
            },
          },
        })}
      >
        {content}
      </ThemeProvider>
    </QueryClientProvider>,
  );
}
it("creates a normalized application role with selected catalog grants", async () => {
  const save = jest.spyOn(rolesApi, "save").mockResolvedValue(applicationRole);
  mount(
    <RoleForm
      mode="create"
      metadata={roleMetadata}
      onCancel={jest.fn()}
      onSuccess={jest.fn()}
    />,
  );
  fireEvent.change(screen.getByLabelText(/Role name/), {
    target: { value: "document-editor" },
  });
  const group = screen.getByRole("group", { name: "TranslationKey" });
  expect(group).toHaveStyle({ borderColor: "rgb(1, 2, 3)" });
  fireEvent.click(within(group).getByRole("checkbox", { name: "read" }));
  expect(
    screen.getByRole("checkbox", { name: "fly (not currently evaluated)" }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Create role" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ name: "DOCUMENT_EDITOR", permissionIds: [1] }),
      undefined,
    ),
  );
});
it("keeps an edit draft and blocks stale-version resubmission", async () => {
  jest
    .spyOn(rolesApi, "save")
    .mockRejectedValue(
      new RoleRequestError(
        "This role changed. Close and reopen the form before saving.",
        409,
        "ROLE_VERSION_CONFLICT",
      ),
    );
  mount(
    <RoleForm
      mode="edit"
      record={applicationRole}
      metadata={roleMetadata}
      onCancel={jest.fn()}
      onSuccess={jest.fn()}
    />,
  );
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "My new description" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(await screen.findByText(/This role changed/)).toBeInTheDocument();
  expect(screen.getByLabelText("Description")).toHaveValue(
    "My new description",
  );
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
});
it("allows a duplicate-name conflict to be corrected without losing the form", async () => {
  jest
    .spyOn(rolesApi, "save")
    .mockRejectedValue(
      new RoleRequestError("A role with that name already exists.", 409),
    );
  mount(
    <RoleForm
      mode="edit"
      record={applicationRole}
      metadata={roleMetadata}
      onCancel={jest.fn()}
      onSuccess={jest.fn()}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(await screen.findByText(/already exists/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
});
it("protects bootstrap authority while allowing display metadata edits", () => {
  mount(
    <RoleForm
      mode="edit"
      record={{ ...applicationRole, name: "SUPER_ADMIN", isProtected: true }}
      metadata={roleMetadata}
      onCancel={jest.fn()}
      onSuccess={jest.fn()}
    />,
  );
  expect(screen.getByLabelText(/Role name/)).toBeDisabled();
  expect(screen.getByRole("checkbox", { name: "Enabled" })).toBeDisabled();
  expect(screen.getByRole("checkbox", { name: "read" })).toBeDisabled();
  expect(screen.getByLabelText(/Badge color/)).toBeEnabled();
});
it.each([
  { userCount: 2, isProtected: false },
  { userCount: 0, isProtected: true },
])("cannot delete an assigned or bootstrap role %j", (data) => {
  const remove = jest.spyOn(rolesApi, "remove");
  mount(
    <RoleForm
      mode="delete"
      record={{ ...applicationRole, ...data }}
      metadata={roleMetadata}
      onCancel={jest.fn()}
      onSuccess={jest.fn()}
    />,
  );
  expect(screen.getByRole("button", { name: "Delete role" })).toBeDisabled();
  expect(remove).not.toHaveBeenCalled();
});

it("prefills all stored role fields, including its exact custom HEX color", () => {
  mount(<RoleForm mode="edit" record={{ ...applicationRole, name: "SUPER_ADMIN", description: "Saved description", icon: "shield", color: "#aB12Ef", isEnabled: false }} metadata={roleMetadata} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  expect(screen.getByLabelText(/Role name/)).toHaveValue("SUPER_ADMIN");
  expect(screen.getByLabelText("Description")).toHaveValue("Saved description");
  expect(screen.getByLabelText(/Badge color/)).toHaveValue("#aB12Ef");
  expect(screen.getByRole("checkbox", { name: "Enabled" })).not.toBeChecked();
});
it("shows a theme HEX default for an unset bootstrap color without saving it as DB data", async () => {
  const record = { ...applicationRole, name: "SUPER_ADMIN", color: null };
  const save = jest.spyOn(rolesApi, "save").mockResolvedValue(record);
  mount(<RoleForm mode="edit" record={record} metadata={roleMetadata} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  expect(screen.getByLabelText(/Badge color/)).toHaveValue("#1976d2");
  expect(screen.getByText(/No custom color is stored/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ color: null }), record));
});
it("persists an explicitly chosen custom color when the stored color was unset", async () => {
  const record = { ...applicationRole, color: null };
  const save = jest.spyOn(rolesApi, "save").mockResolvedValue(record);
  mount(<RoleForm mode="edit" record={record} metadata={roleMetadata} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  fireEvent.change(screen.getByLabelText(/Badge color/), { target: { value: "#123abc" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ color: "#123abc" }), record));
});
