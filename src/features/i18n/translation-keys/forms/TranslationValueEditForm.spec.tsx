import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  updateTranslation,
} from "../api";

import type {
  TranslationKey,
  TranslationValue,
} from "../schemas";

import {
  TranslationValueEditForm,
} from "./TranslationValueEditForm";

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  updateTranslation: jest.fn(),
}));

const update = updateTranslation as jest.MockedFunction<
  typeof updateTranslation
>;

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

it("starts from the current value and keeps Save disabled until dirty", () => {
  render(
    <TranslationValueEditForm
      record={record}
      translation={translation}
      onUpdated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  expect(
    screen.getByRole("textbox", {
      name: /Translation value/i,
    }),
  ).toHaveValue("Email");

  expect(
    screen.getByRole("button", {
      name: "Save translation",
    }),
  ).toBeDisabled();
});

it("updates the current locale through the nested PATCH endpoint contract", async () => {
  const updated: TranslationValue = {
    ...translation,
    value: "Email address",
    updatedAt: "2026-09-22T01:00:00.000Z",
  };

  update.mockResolvedValue({
    requestStatus: "SUCCESS",
    statusCode: 200,
    statusText: "OK",
    data: updated,
  });

  const onUpdated = jest.fn();

  render(
    <TranslationValueEditForm
      record={record}
      translation={translation}
      onUpdated={onUpdated}
      onCancel={jest.fn()}
    />,
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: /Translation value/i,
    }),
    {
      target: {
        value: "Email address",
      },
    },
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Save translation",
    }),
  );

  await waitFor(() => {
    expect(update).toHaveBeenCalledWith(
      10,
      "en",
      {
        value: "Email address",
      },
    );
  });

  expect(update).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    expect(onUpdated).toHaveBeenCalledWith(updated);
  });
});

it("blocks duplicate submission while the PATCH is pending", async () => {
  let resolve!: (value: Awaited<ReturnType<typeof updateTranslation>>) => void;

  update.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );

  render(
    <TranslationValueEditForm
      record={record}
      translation={translation}
      onUpdated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: /Translation value/i,
    }),
    {
      target: {
        value: "Email address",
      },
    },
  );

  const save = screen.getByRole("button", {
    name: "Save translation",
  });

  fireEvent.click(save);
  fireEvent.click(save);

  expect(update).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    expect(
      screen.getByRole("button", {
        name: "Saving...",
      }),
    ).toBeDisabled();
  });

  await act(async () => {
    resolve({
      requestStatus: "SUCCESS",
      statusCode: 200,
      statusText: "OK",
      data: {
        ...translation,
        value: "Email address",
      },
    });
  });
});

it("preserves the draft when the server rejects the update", async () => {
  update.mockRejectedValue(
    new Error("Unable to update this translation."),
  );

  render(
    <TranslationValueEditForm
      record={record}
      translation={translation}
      onUpdated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  const input = screen.getByRole("textbox", {
    name: /Translation value/i,
  });

  fireEvent.change(input, {
    target: {
      value: "Email address",
    },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Save translation",
    }),
  );

  expect(
    await screen.findByRole("alert"),
  ).toHaveTextContent(
    "Unable to update this translation.",
  );

  expect(input).toHaveValue("Email address");
});
