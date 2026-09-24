import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { deleteTranslation } from "../api";

import type {
  TranslationKey,
  TranslationValue,
} from "../schemas";

import {
  TranslationValueDeleteDialog,
} from "./TranslationValueDeleteDialog";

jest.mock("../api", () => ({
  deleteTranslation: jest.fn(),
}));

const remove =
  deleteTranslation as jest.Mock;

const translation: TranslationValue = {
  id: 50,
  keyId: 10,
  locale: "en",
  value: "Email",
  createdAt: "2026-09-22T00:00:00.000Z",
  updatedAt: "2026-09-22T00:00:00.000Z",
};

const record: TranslationKey = {
  id: 10,
  key: "auth_email",
  description: "Email field label",
  categoryId: 2,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: {
    id: 2,
    name: "auth",
    description: null,
  },
  translations: [translation],
};

beforeEach(() => {
  jest.resetAllMocks();
});

it("identifies the owning key, locale, and current value with Cancel focused", () => {
  const onClose = jest.fn();

  render(
    <TranslationValueDeleteDialog
      record={record}
      translation={translation}
      onClose={onClose}
      onDeleted={jest.fn()}
    />,
  );

  expect(
    screen.getByRole("dialog"),
  ).toHaveTextContent("auth_email");

  expect(
    screen.getByRole("dialog"),
  ).toHaveTextContent("English");

  expect(
    screen.getByRole("dialog"),
  ).toHaveTextContent("Email");

  expect(
    screen.getByRole("button", {
      name: "Cancel",
    }),
  ).toHaveFocus();

  expect(remove).not.toHaveBeenCalled();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Cancel",
    }),
  );

  expect(onClose).toHaveBeenCalledTimes(1);
  expect(remove).not.toHaveBeenCalled();
});

it("ignores Escape and backdrop while allowing the explicit X", () => {
  const onClose = jest.fn();

  render(
    <TranslationValueDeleteDialog
      record={record}
      translation={translation}
      onClose={onClose}
      onDeleted={jest.fn()}
    />,
  );

  const dialog =
    screen.getByRole("dialog");

  fireEvent.keyDown(dialog, {
    key: "Escape",
    code: "Escape",
  });

  fireEvent.click(
    dialog.parentElement!,
  );

  expect(onClose).not.toHaveBeenCalled();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Close delete translation dialog",
    }),
  );

  expect(onClose).toHaveBeenCalledTimes(1);
});

it("sends one nested DELETE and locks every action while pending", async () => {
  let resolve!: (
    value: unknown,
  ) => void;

  remove.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );

  const onDeleted = jest.fn();

  render(
    <TranslationValueDeleteDialog
      record={record}
      translation={translation}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );

  const button =
    screen.getByRole("button", {
      name: "Delete translation",
    });

  fireEvent.click(button);
  fireEvent.click(button);

  expect(remove).toHaveBeenCalledTimes(1);

  expect(remove).toHaveBeenCalledWith(
    10,
    "en",
  );

  expect(
    screen.getByRole("button", {
      name: /Deleting/,
    }),
  ).toBeDisabled();

  expect(
    screen.getByRole("button", {
      name: "Cancel",
    }),
  ).toBeDisabled();

  expect(
    screen.getByRole("button", {
      name: "Close delete translation dialog",
    }),
  ).toBeDisabled();

  expect(onDeleted).not.toHaveBeenCalled();

  await act(async () => {
    resolve({
      data: {
        id: 50,
        keyId: 10,
        locale: "en",
      },
    });
  });

  expect(onDeleted).toHaveBeenCalledWith({
    id: 50,
    keyId: 10,
    locale: "en",
  });
});

it("preserves the confirmation target after failure and allows retry", async () => {
  remove.mockRejectedValueOnce(
    new Error("Deletion is not allowed"),
  );

  remove.mockResolvedValueOnce({
    data: {
      id: 50,
      keyId: 10,
      locale: "en",
    },
  });

  const onDeleted = jest.fn();

  render(
    <TranslationValueDeleteDialog
      record={record}
      translation={translation}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete translation",
    }),
  );

  expect(
    await screen.findByRole("alert"),
  ).toHaveTextContent(
    "Deletion is not allowed",
  );

  expect(
    screen.getByRole("dialog"),
  ).toHaveTextContent("auth_email");

  expect(
    screen.getByRole("dialog"),
  ).toHaveTextContent("English");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete translation",
    }),
  );

  await waitFor(() => {
    expect(
      onDeleted,
    ).toHaveBeenCalledTimes(1);
  });

  expect(remove).toHaveBeenCalledTimes(2);
});

it("resets errors when the nested target changes and renders nothing while closed", async () => {
  remove.mockRejectedValue(
    "unknown failure",
  );

  const callbacks = {
    onClose: jest.fn(),
    onDeleted: jest.fn(),
  };

  const view = render(
    <TranslationValueDeleteDialog
      record={record}
      translation={translation}
      {...callbacks}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete translation",
    }),
  );

  expect(
    await screen.findByRole("alert"),
  ).toHaveTextContent(
    "Unable to delete translation",
  );

  view.rerender(
    <TranslationValueDeleteDialog
      record={record}
      translation={{
        ...translation,
        id: 51,
        locale: "km",
        value: "អ៊ីមែល",
      }}
      {...callbacks}
    />,
  );

  expect(
    screen.queryByRole("alert"),
  ).not.toBeInTheDocument();

  expect(
    screen.getByRole("dialog"),
  ).toHaveTextContent("Khmer");

  view.rerender(
    <TranslationValueDeleteDialog
      record={null}
      translation={null}
      {...callbacks}
    />,
  );

  expect(
    screen.queryByRole("dialog"),
  ).not.toBeInTheDocument();
});

it("does not notify an unmounted nested confirmation after completion", async () => {
  let resolve!: (
    value: unknown,
  ) => void;

  remove.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );

  const onDeleted = jest.fn();

  const view = render(
    <TranslationValueDeleteDialog
      record={record}
      translation={translation}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete translation",
    }),
  );

  view.unmount();

  await act(async () => {
    resolve({
      data: {
        id: 50,
        keyId: 10,
        locale: "en",
      },
    });
  });

  expect(onDeleted).not.toHaveBeenCalled();
});
