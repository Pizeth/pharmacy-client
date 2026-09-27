import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { getTranslationKey } from "../api";
import type { TranslationKey } from "../schemas";

import { TranslationKeyEditPage } from "./TranslationKeyEditPage";

jest.mock("../api", () => ({
  getTranslationKey: jest.fn(),
}));

jest.mock("../forms", () => ({
  TranslationKeyEditForm: ({
    record,
    onCancel,
    onUpdated,
  }: {
    record: TranslationKey;
    onCancel: () => void;
    onUpdated: (record: TranslationKey) => void;
  }) => (
    <div>
      <span>{record.key}</span>
      <button type="button" onClick={onCancel}>
        Cancel edit
      </button>
      <button
        type="button"
        onClick={() =>
          onUpdated({
            ...record,
            key: `${record.key}_updated`,
          })
        }
      >
        Save edit
      </button>
    </div>
  ),
}));

const mockedGetTranslationKey =
  getTranslationKey as jest.MockedFunction<typeof getTranslationKey>;

const record: TranslationKey = {
  id: 12,
  key: "auth_login",
  description: "Login label",
  categoryId: 3,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-02T00:00:00.000Z",
  translationCategory: {
    id: 3,
    name: "auth",
  },
  translations: [],
};

describe("TranslationKeyEditPage", () => {
  beforeEach(() => {
    mockedGetTranslationKey.mockReset();
  });

  it("loads the canonical record and delegates mutation to the existing edit form", async () => {
    mockedGetTranslationKey.mockResolvedValue({
      data: record,
    });

    const onBack = jest.fn();
    const onUpdated = jest.fn();

    render(
      <TranslationKeyEditPage
        recordId={record.id}
        onBack={onBack}
        onUpdated={onUpdated}
      />,
    );

    expect(
      screen.getByText("Loading translation key…"),
    ).toBeInTheDocument();

    expect(
      await screen.findByText("auth_login"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save edit",
      }),
    );

    expect(onUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 12,
        key: "auth_login_updated",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel edit",
      }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("shows a retryable detail-loading failure", async () => {
    mockedGetTranslationKey
      .mockRejectedValueOnce(new Error("Translation key not found."))
      .mockResolvedValueOnce({
        data: record,
      });

    render(
      <TranslationKeyEditPage
        recordId={record.id}
        onBack={jest.fn()}
        onUpdated={jest.fn()}
      />,
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Translation key not found.");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry",
      }),
    );

    await waitFor(() => {
      expect(mockedGetTranslationKey).toHaveBeenCalledTimes(2);
    });

    expect(
      await screen.findByText("auth_login"),
    ).toBeInTheDocument();
  });
});
