import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserForm } from "./UserForm";
import { usersApi } from "./api";
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: {} } }));
const mockEmail = jest.fn().mockResolvedValue(true);
const mockUsername = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/hooks/useFieldValidation", () => ({ useAsyncFieldRule: (source: string) => ({ validate: source === "email" ? mockEmail : mockUsername, invalidate: jest.fn() }) }));
const record = { id: "12", name: "Jane", username: "jane1", email: "jane@example.com", role: "user" };
beforeEach(() => { mockEmail.mockReset().mockResolvedValue(true); mockUsername.mockReset().mockResolvedValue(true); });
afterEach(() => jest.restoreAllMocks());
function mount(mode: "create" | "edit" | "delete") {
  const success = jest.fn(); const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(<QueryClientProvider client={client}><UserForm mode={mode} record={mode === "create" ? undefined : record} onCancel={jest.fn()} onSuccess={success} /></QueryClientProvider>);
  return success;
}
it("validates create fields and submits the shared form", async () => {
  const save = jest.spyOn(usersApi, "save").mockResolvedValue(record); mount("create");
  expect(await screen.findByRole("button", { name: "Create user" })).toBeDisabled();
  expect(save).not.toHaveBeenCalled();
  await act(async () => { fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Jane" } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "jane@example.com" } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Username/), { target: { value: "jane1" } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Temporary password/), { target: { value: "temporary-pass123" } }); });
  const submit = await screen.findByRole("button", { name: "Create user" });
  await waitFor(() => expect(submit).toBeEnabled());
  fireEvent.click(submit);
  await waitFor(() => expect(save).toHaveBeenCalledWith("create", expect.objectContaining({ name: "Jane", email: "jane@example.com" }), undefined));
});
it("blocks a username or email that signup reports as already registered", async () => {
  mockEmail.mockResolvedValue("Email already exists");
  mockUsername.mockResolvedValue("Username already exists");
  const save = jest.spyOn(usersApi, "save"); mount("create");
  fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Jane" } });
  fireEvent.change(screen.getByLabelText(/Username/), { target: { value: "jane1" } });
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText(/Temporary password/), { target: { value: "temporary-pass123" } });
  expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  expect(await screen.findByText("Username already exists")).toBeInTheDocument();
  fireEvent.click(await screen.findByRole("button", { name: "Create user" }));
  await waitFor(() => expect(screen.getByText("Email already exists")).toBeInTheDocument());
  expect(save).not.toHaveBeenCalled();
});
it("keeps the edit form open when the API rejects an update", async () => {
  jest.spyOn(usersApi, "save").mockRejectedValue(new Error("Email already exists")); const success = mount("edit");
  const submit = await screen.findByRole("button", { name: "Save user" });
  await waitFor(() => expect(submit).toBeEnabled());
  fireEvent.click(submit);
  expect(await screen.findByText("Email already exists")).toBeInTheDocument(); expect(success).not.toHaveBeenCalled();
  expect(mockEmail).not.toHaveBeenCalled(); expect(mockUsername).not.toHaveBeenCalled();
});
it("only deletes after confirmation and blocks repeated submissions", async () => {
  let resolve!: (value: typeof record) => void;
  const save = jest.spyOn(usersApi, "save").mockImplementation(() => new Promise(done => { resolve = done; })); const success = mount("delete");
  expect(save).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete user" }));
  const pending = await screen.findByRole("button", { name: "Saving…" });
  expect(pending).toBeDisabled();
  fireEvent.click(pending);
  await waitFor(() => expect(save).toHaveBeenCalledTimes(1)); resolve(record); await waitFor(() => expect(success).toHaveBeenCalled());
});
