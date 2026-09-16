import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TranslationKeyCreateForm } from "./TranslationKeyCreateForm";
import { createTranslationKey } from "../api";
import { useTranslationKeyFilterOptions } from "../table/useTranslationKeyFilterOptions";

jest.mock("../api", () => ({ createTranslationKey: jest.fn() }));
jest.mock("../table/useTranslationKeyFilterOptions", () => ({
  useTranslationKeyFilterOptions: jest.fn(),
}));
const create = createTranslationKey as jest.Mock;
const options = useTranslationKeyFilterOptions as jest.Mock;
beforeEach(() => {
  jest.resetAllMocks();
  options.mockReturnValue({
    fetching: false,
    error: undefined,
    categoryOptions: [{ value: 2, label: "auth" }],
    refresh: jest.fn(),
  });
});
async function fill() {
  fireEvent.change(screen.getByRole("textbox", { name: /Key/ }), {
    target: { value: "  new_key  " },
  });
  fireEvent.mouseDown(screen.getByRole("combobox", { name: /Category/ }));
  fireEvent.click(await screen.findByRole("option", { name: "auth" }));
}
it("validates locally and does not submit blank input", () => {
  render(
    <TranslationKeyCreateForm onCreated={jest.fn()} onCancel={jest.fn()} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Create key" }));
  expect(create).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox", { name: /Key/ })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});
it("normalizes input, blocks duplicate submission, and reports server success", async () => {
  let resolve!: (value: unknown) => void;
  create.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const onCreated = jest.fn();
  render(
    <TranslationKeyCreateForm onCreated={onCreated} onCancel={jest.fn()} />,
  );
  await fill();
  fireEvent.click(screen.getByRole("button", { name: "Create key" }));
  expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  fireEvent.submit(
    screen.getByRole("textbox", { name: /Key/ }).closest("form")!,
  );
  expect(create).toHaveBeenCalledTimes(1);
  expect(create).toHaveBeenCalledWith({
    key: "new_key",
    description: null,
    categoryId: 2,
  });
  resolve({ data: { id: 9, key: "new_key" } });
  await waitFor(() =>
    expect(onCreated).toHaveBeenCalledWith({ id: 9, key: "new_key" }),
  );
});
it("preserves input and permits retry after a rejected request", async () => {
  create.mockRejectedValue(new Error("Key already exists"));
  const onCreated = jest.fn();
  render(
    <TranslationKeyCreateForm onCreated={onCreated} onCancel={jest.fn()} />,
  );
  await fill();
  fireEvent.click(screen.getByRole("button", { name: "Create key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Key already exists",
  );
  expect(screen.getByRole("textbox", { name: /Key/ })).toHaveValue(
    "  new_key  ",
  );
  expect(screen.getByRole("button", { name: "Create key" })).toBeEnabled();
  expect(onCreated).not.toHaveBeenCalled();
});
it("disables creation during category failures and exposes retry", () => {
  const refresh = jest.fn();
  options.mockReturnValue({
    fetching: false,
    error: new Error("offline"),
    categoryOptions: [],
    refresh,
  });
  render(
    <TranslationKeyCreateForm onCreated={jest.fn()} onCancel={jest.fn()} />,
  );
  expect(screen.getByRole("button", { name: "Create key" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Retry categories" }));
  expect(refresh).toHaveBeenCalledTimes(1);
});
