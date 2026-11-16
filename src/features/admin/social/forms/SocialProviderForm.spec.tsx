import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocialProviderForm } from "./SocialProviderForm";
import { socialApi } from "../api";
const provider = { id: 3, key: "telegram", name: "Telegram", websiteUrl: "https://t.me", icon: "telegram", isEnabled: true };
afterEach(() => jest.restoreAllMocks());
function mount(mode: "create" | "edit" | "delete") {
  const onSuccess = jest.fn();
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(<QueryClientProvider client={client}><SocialProviderForm mode={mode} record={mode === "create" ? undefined : provider} onCancel={jest.fn()} onSuccess={onSuccess} /></QueryClientProvider>);
  return onSuccess;
}
it("uses the same validated create form for both hosts", async () => {
  const save = jest.spyOn(socialApi, "saveProvider").mockResolvedValue(provider);
  mount("create");
  fireEvent.click(screen.getByRole("button", { name: "Create provider" }));
  expect(save).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText(/Provider key/), { target: { value: "telegram" } });
  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Telegram" } });
  fireEvent.click(screen.getByRole("button", { name: "Create provider" }));
  await waitFor(() => expect(save).toHaveBeenCalledWith({ key: "telegram", name: "Telegram", websiteUrl: null, icon: null, isEnabled: true }, undefined));
});
it("does not delete on mount and prevents duplicate pending submissions", async () => {
  let resolve!: (record: typeof provider) => void;
  const remove = jest.spyOn(socialApi, "deleteProvider").mockReturnValue(new Promise(done => { resolve = done; }));
  const success = mount("delete");
  expect(remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete provider" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete provider" }));
  await waitFor(() => expect(remove).toHaveBeenCalledTimes(1));
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  resolve(provider);
  await waitFor(() => expect(success).toHaveBeenCalledWith(provider));
});
