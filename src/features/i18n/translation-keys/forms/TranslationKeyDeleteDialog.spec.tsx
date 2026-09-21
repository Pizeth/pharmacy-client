import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { deleteTranslationKey } from "../api";
import type { TranslationKey } from "../schemas";
import { TranslationKeyDeleteDialog } from "./TranslationKeyDeleteDialog";

jest.mock("../api", () => ({ deleteTranslationKey: jest.fn() }));
const remove = deleteTranslationKey as jest.Mock;
const record: TranslationKey = {
  id: 31,
  key: "sequence_test",
  description: "Test key",
  categoryId: 1,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: { id: 1, name: "common", description: null },
  translations: [],
};

beforeEach(() => jest.resetAllMocks());

it("identifies the target and requires explicit confirmation, with Cancel initially focused", () => {
  const onClose = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={onClose}
      onDeleted={jest.fn()}
    />,
  );
  expect(screen.getByRole("dialog")).toHaveTextContent("sequence_test");
  expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  expect(remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(remove).not.toHaveBeenCalled();
});

it("ignores Escape and backdrop while allowing the explicit X", () => {
  const onClose = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={onClose}
      onDeleted={jest.fn()}
    />,
  );
  const dialog = screen.getByRole("dialog");
  fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
  fireEvent.click(dialog.parentElement!);
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("button", { name: "Close delete translation key dialog" }),
  );
  expect(onClose).toHaveBeenCalledTimes(1);
});

it("sends one DELETE and locks every action until the validated result arrives", async () => {
  let resolve!: (value: unknown) => void;
  remove.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const onDeleted = jest.fn();
  const onClose = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={onClose}
      onDeleted={onDeleted}
    />,
  );
  const button = screen.getByRole("button", { name: "Delete key" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(remove).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith(31);
  expect(screen.getByRole("button", { name: /Deleting/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "Close delete translation key dialog" }),
  ).toBeDisabled();
  expect(onDeleted).not.toHaveBeenCalled();
  await act(async () => {
    resolve({ data: { id: 31, key: "sequence_test" } });
  });
  expect(onDeleted).toHaveBeenCalledWith({ id: 31, key: "sequence_test" });
  expect(onClose).not.toHaveBeenCalled();
});

it("keeps the confirmation and target after failure and allows retry", async () => {
  remove.mockRejectedValueOnce(new Error("Deletion is not allowed"));
  remove.mockResolvedValueOnce({ data: { id: 31, key: "sequence_test" } });
  const onDeleted = jest.fn();
  render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Deletion is not allowed",
  );
  expect(screen.getByRole("dialog")).toHaveTextContent("sequence_test");
  expect(onDeleted).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1));
  expect(remove).toHaveBeenCalledTimes(2);
});

it("clears errors when selecting another record and renders nothing when closed", async () => {
  remove.mockRejectedValue("unknown failure");
  const props = { onClose: jest.fn(), onDeleted: jest.fn() };
  const view = render(
    <TranslationKeyDeleteDialog record={record} {...props} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to delete translation key",
  );
  view.rerender(
    <TranslationKeyDeleteDialog
      record={{ ...record, id: 32, key: "another_key" }}
      {...props}
    />,
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("dialog")).toHaveTextContent("another_key");
  view.rerender(<TranslationKeyDeleteDialog record={null} {...props} />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("does not notify an unmounted confirmation after the request completes", async () => {
  let resolve!: (value: unknown) => void;
  remove.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const onDeleted = jest.fn();
  const view = render(
    <TranslationKeyDeleteDialog
      record={record}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Delete key" }));
  view.unmount();
  await act(async () => {
    resolve({ data: { id: 31, key: "sequence_test" } });
  });
  expect(onDeleted).not.toHaveBeenCalled();
});
