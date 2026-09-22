import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { createTranslation } from "../api";

import type { TranslationKey, TranslationValue } from "../schemas";

import { TranslationValueCreateForm } from "./TranslationValueCreateForm";

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  createTranslation: jest.fn(),
}));

const create = createTranslation as jest.MockedFunction<
  typeof createTranslation
>;

const createdTranslation: TranslationValue = {
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
  translations: [],
};

function chooseLocale(label: string) {
  fireEvent.mouseDown(
    screen.getByRole("combobox", {
      name: /Locale/i,
    }),
  );

  fireEvent.click(
    screen.getByRole("option", {
      name: label,
    }),
  );
}

beforeEach(() => {
  jest.resetAllMocks();
});

it("creates a nested translation with the selected locale and value", async () => {
  create.mockResolvedValue({
    requestStatus: "SUCCESS",
    statusCode: 201,
    statusText: "Created",
    data: createdTranslation,
  });

  const onCreated = jest.fn();

  render(
    <TranslationValueCreateForm
      record={record}
      onCreated={onCreated}
      onCancel={jest.fn()}
    />,
  );

  chooseLocale("English");

  fireEvent.change(
    screen.getByRole("textbox", {
      name: /Translation value/i,
    }),
    {
      target: {
        value: "Email",
      },
    },
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add translation",
    }),
  );

  await waitFor(() => {
    expect(create).toHaveBeenCalledWith(record.id, {
      locale: "en",

      value: "Email",
    });
  });

  expect(create).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    expect(onCreated).toHaveBeenCalledWith(createdTranslation);
  });
});

it("does not offer a locale that already exists on the key", () => {
  render(
    <TranslationValueCreateForm
      record={{
        ...record,

        translations: [createdTranslation],
      }}
      onCreated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  fireEvent.mouseDown(
    screen.getByRole("combobox", {
      name: /Locale/i,
    }),
  );

  expect(
    screen.queryByRole("option", {
      name: "English",
    }),
  ).not.toBeInTheDocument();

  expect(
    screen.getByRole("option", {
      name: "Khmer",
    }),
  ).toBeInTheDocument();
});

it("blocks creation when every supported locale already exists", () => {
  render(
    <TranslationValueCreateForm
      record={{
        ...record,

        translations: [
          createdTranslation,

          {
            ...createdTranslation,
            id: 51,
            locale: "km",
            value: "អ៊ីមែល",
          },
        ],
      }}
      onCreated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "All supported locales already have translations",
  );

  expect(
    screen.getByRole("button", {
      name: "Add translation",
    }),
  ).toBeDisabled();
});

it("preserves a rejected request in the form for correction or retry", async () => {
  create.mockRejectedValue(new Error("Translation already exists."));

  render(
    <TranslationValueCreateForm
      record={record}
      onCreated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  chooseLocale("English");

  fireEvent.change(
    screen.getByRole("textbox", {
      name: /Translation value/i,
    }),
    {
      target: {
        value: "Email",
      },
    },
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add translation",
    }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Translation already exists.",
  );

  expect(
    screen.getByRole("textbox", {
      name: /Translation value/i,
    }),
  ).toHaveValue("Email");
});
