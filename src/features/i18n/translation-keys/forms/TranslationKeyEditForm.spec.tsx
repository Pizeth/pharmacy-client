import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { updateTranslationKey } from "../api";
import { useTranslationKeyFilterOptions } from "../table/useTranslationKeyFilterOptions";
import type { TranslationKey } from "../schemas";
import { TranslationKeyEditForm } from "./TranslationKeyEditForm";

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),

  updateTranslationKey: jest.fn(),
}));

jest.mock("../table/useTranslationKeyFilterOptions", () => ({
  useTranslationKeyFilterOptions: jest.fn(),
}));

const update = updateTranslationKey as jest.Mock;

const options = useTranslationKeyFilterOptions as jest.Mock;

const record: TranslationKey = {
  id: 7,

  key: "auth_login",

  description: "Login action",

  categoryId: 2,

  createdAt: "2026-09-03T10:16:00.000Z",

  updatedAt: "2026-09-04T03:46:00.000Z",

  translationCategory: {
    id: 2,

    name: "auth",

    description: null,
  },

  translations: [],
};

beforeEach(() => {
  jest.resetAllMocks();

  options.mockReturnValue({
    loading: false,

    fetching: false,

    error: undefined,

    categoryOptions: [
      {
        value: 2,

        label: "auth",
      },

      {
        value: 3,

        label: "common",
      },
    ],

    localeOptions: [],

    refresh: jest.fn(),
  });
});

it("seeds the editable values and disables saving until something changes", () => {
  render(
    <TranslationKeyEditForm
      record={record}
      onUpdated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  expect(
    screen.getByRole("textbox", {
      name: /Key/,
    }),
  ).toHaveValue("auth_login");

  expect(
    screen.getByRole("textbox", {
      name: /Description/,
    }),
  ).toHaveValue("Login action");

  expect(
    screen.getByRole("combobox", {
      name: /Category/,
    }),
  ).toHaveTextContent("auth");

  //   expect(
  //     screen.getByRole("combobox", {
  //       name: /Category/,
  //     }),
  //   ).toHaveAttribute("aria-expanded", "false");

  expect(
    screen.getByRole("button", {
      name: "Save changes",
    }),
  ).toBeDisabled();
});

it("sends only changed normalized metadata", async () => {
  const updated: TranslationKey = {
    ...record,

    description: "Authentication login action",

    updatedAt: "2026-09-21T08:00:00.000Z",
  };

  update.mockResolvedValue({
    data: updated,
  });

  const onUpdated = jest.fn();

  render(
    <TranslationKeyEditForm
      record={record}
      onUpdated={onUpdated}
      onCancel={jest.fn()}
    />,
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: /Description/,
    }),
    {
      target: {
        value: "  Authentication login action  ",
      },
    },
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Save changes",
    }),
  );

  await waitFor(() => {
    expect(update).toHaveBeenCalledWith(7, {
      description: "Authentication login action",
    });
  });

  await waitFor(() => {
    expect(onUpdated).toHaveBeenCalledWith(updated);
  });
});

it("preserves edited values when the update request fails", async () => {
  update.mockRejectedValue(new Error("Unable to update"));

  render(
    <TranslationKeyEditForm
      record={record}
      onUpdated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  const keyInput = screen.getByRole("textbox", {
    name: /Key/,
  });

  fireEvent.change(keyInput, {
    target: {
      value: "auth_login_new",
    },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Save changes",
    }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to update",
  );

  expect(keyInput).toHaveValue("auth_login_new");
});

it("can change the category and sends its numeric id", async () => {
  update.mockResolvedValue({
    data: {
      ...record,

      categoryId: 3,

      translationCategory: {
        id: 3,

        name: "common",

        description: null,
      },
    },
  });

  render(
    <TranslationKeyEditForm
      record={record}
      onUpdated={jest.fn()}
      onCancel={jest.fn()}
    />,
  );

  fireEvent.mouseDown(
    screen.getByRole("combobox", {
      name: /Category/,
    }),
  );

  fireEvent.click(
    await screen.findByRole("option", {
      name: "common",
    }),
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Save changes",
    }),
  );

  await waitFor(() => {
    expect(update).toHaveBeenCalledWith(7, {
      categoryId: 3,
    });
  });
});
