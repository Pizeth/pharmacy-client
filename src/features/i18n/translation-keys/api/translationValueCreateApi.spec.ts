import { createTranslation, TranslationKeyApiError } from "./translationKeyApi";

jest.mock("@/types/constants", () => ({
  API_URL: "https://api.example.test/",
}));

const originalFetch = globalThis.fetch;

const fetchMock = jest.fn();

const created = {
  requestStatus: "SUCCESS",

  statusCode: 201,

  statusText: "Created",

  data: {
    id: 50,

    keyId: 10,

    locale: "en",

    value: "Email",

    createdAt: "2026-09-22T00:00:00.000Z",

    updatedAt: "2026-09-22T00:00:00.000Z",
  },
};

function respond(
  payload: unknown,
  status = 201,
  contentType = "application/json",
) {
  fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,

    status,

    statusText: status === 201 ? "Created" : "Conflict",

    headers: {
      get: () => contentType,
    },

    json: async () => payload,
  });
}

beforeEach(() => {
  fetchMock.mockReset();

  globalThis.fetch = fetchMock;
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});

it("uses the exact nested POST endpoint with credentials and validates the response", async () => {
  respond(created);

  await expect(
    createTranslation(10, {
      locale: "en",

      value: "Email",
    }),
  ).resolves.toEqual(created);

  expect(fetchMock).toHaveBeenCalledWith(
    "https://api.example.test/api/v1/i18n/keys/10/translations",
    {
      method: "POST",

      credentials: "include",

      signal: undefined,

      body: JSON.stringify({
        locale: "en",

        value: "Email",
      }),

      headers: {
        Accept: "application/json",

        "Content-Type": "application/json",
      },
    },
  );

  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("preserves a structured backend rejection", async () => {
  const payload = {
    message: "Translation already exists.",

    statusCode: 409,

    code: "CONFLICT",

    field: "locale",
  };

  respond(payload, 409);

  await expect(
    createTranslation(10, {
      locale: "en",

      value: "Email",
    }),
  ).rejects.toMatchObject({
    name: "TranslationKeyApiError",

    status: 409,

    message: payload.message,

    payload,
  });
});

it.each([
  {
    ...created,
    requestStatus: "FAILED",
  },

  {
    ...created,
    data: {
      ...created.data,
      id: "50",
    },
  },

  {
    ...created,
    data: {
      ...created.data,
      locale: 123,
    },
  },

  undefined,
])("rejects malformed successful responses (%#)", async (payload) => {
  respond(payload);

  await expect(
    createTranslation(10, {
      locale: "en",

      value: "Email",
    }),
  ).rejects.toThrow();
});

it("reports non-JSON HTTP errors through TranslationKeyApiError", async () => {
  respond("<html>Conflict</html>", 409, "text/html");

  await expect(
    createTranslation(10, {
      locale: "en",

      value: "Email",
    }),
  ).rejects.toBeInstanceOf(TranslationKeyApiError);
});

it("forwards cancellation and performs no automatic retry", async () => {
  const controller = new AbortController();

  const error = new Error("Connection lost");

  fetchMock.mockRejectedValue(error);

  await expect(
    createTranslation(
      10,
      {
        locale: "en",

        value: "Email",
      },
      controller.signal,
    ),
  ).rejects.toBe(error);

  expect(fetchMock).toHaveBeenCalledTimes(1);

  expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
});
