import { fireEvent, render, screen } from "@testing-library/react";
import { TranslationKeyRecordContent } from "./TranslationKeyRecordContent";
import type { TranslationKey } from "../schemas";
jest.mock("../forms/TranslationValueCreateDialog", () => ({ TranslationValueCreateDialog: ({ onCreated }: { onCreated: () => void }) => <button onClick={onCreated}>Confirm translation</button> }));
jest.mock("../forms/TranslationValueEditDialog", () => ({ TranslationValueEditDialog: ({ onUpdated }: { onUpdated: () => void }) => <button onClick={onUpdated}>Save translation</button> }));
jest.mock("../forms/TranslationValueDeleteDialog", () => ({ TranslationValueDeleteDialog: ({ onDeleted }: { onDeleted: () => void }) => <button onClick={onDeleted}>Confirm delete</button> }));
const date = "2026-10-27T00:00:00Z";
const record: TranslationKey = { id: 4, key: "home", description: "Homepage title", categoryId: 1, createdAt: date, updatedAt: date, translationCategory: { id: 1, name: "Common", description: "Shared labels" }, translations: [{ id: 1, locale: "en", value: "Home", createdAt: date, updatedAt: date }, { id: 3, locale: "fr", value: "Accueil", createdAt: date, updatedAt: date }] };
it("reports missing supported locales while retaining additional stored locale text", () => {
  render(<TranslationKeyRecordContent record={record} onChanged={jest.fn()} />);
  expect(screen.getByText(/Missing or empty translations: Khmer/)).toBeInTheDocument();
  expect(screen.getByText("Accueil")).toHaveAttribute("lang", "fr");
  expect(screen.getByText("Shared labels")).toBeInTheDocument();
});
it("uses the shared translation dialogs and refreshes after successful changes", () => {
  const changed = jest.fn(); render(<TranslationKeyRecordContent record={record} onChanged={changed} />);
  fireEvent.click(screen.getByRole("button", { name: "Add translation" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm translation" }));
  expect(changed).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Confirm translation" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Edit English translation" }));
  fireEvent.click(screen.getByRole("button", { name: "Save translation" }));
  expect(changed).toHaveBeenCalledTimes(2);
});
