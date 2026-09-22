import { fireEvent, render, screen } from "@testing-library/react";

import type { TranslationKey } from "../schemas";

import { TranslationKeyTranslationsPanel } from "./TranslationKeyTranslationsPanel";

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
  translations: [
    {
      id: 50,
      keyId: 10,
      locale: "en",
      value: "Email",
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
  ],
};

it("renders the key's existing translation values", () => {
  render(
    <TranslationKeyTranslationsPanel record={record} onCreate={jest.fn()} onEdit={jest.fn()} />,
  );

  expect(screen.getByText("English")).toBeInTheDocument();

  expect(screen.getByText("Email")).toBeInTheDocument();

  expect(screen.getByText(/1 of 2 supported locales/)).toBeInTheDocument();
});

it("delegates nested creation to the resource parent", () => {
  const onCreate = jest.fn();

  render(
    <TranslationKeyTranslationsPanel record={record} onCreate={onCreate} onEdit={jest.fn()} />,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add translation",
    }),
  );

  expect(onCreate).toHaveBeenCalledTimes(1);

  expect(onCreate).toHaveBeenCalledWith(record);
});

it("disables creation when all supported locales are populated", () => {
  render(
    <TranslationKeyTranslationsPanel
      record={{
        ...record,

        translations: [
          ...record.translations,

          {
            id: 51,
            keyId: 10,
            locale: "km",
            value: "អ៊ីមែល",
            createdAt: "2026-09-01T00:00:00.000Z",
            updatedAt: "2026-09-01T00:00:00.000Z",
          },
        ],
      }}
      onCreate={jest.fn()}
      onEdit={jest.fn()}
    />,
  );

  expect(
    screen.getByRole("button", {
      name: "Add translation",
    }),
  ).toBeDisabled();
});


it("delegates nested editing with the owning key and translation", () => {
  const onEdit = jest.fn();

  render(
    <TranslationKeyTranslationsPanel
      record={record}
      onCreate={jest.fn()}
      onEdit={onEdit}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Edit",
    }),
  );

  expect(onEdit).toHaveBeenCalledTimes(1);
  expect(onEdit).toHaveBeenCalledWith(
    record,
    record.translations[0],
  );
});
