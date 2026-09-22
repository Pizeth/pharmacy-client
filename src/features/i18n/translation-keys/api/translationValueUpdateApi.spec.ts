import {
  TranslationKeyApiError,
  updateTranslation,
} from "./translationKeyApi";

jest.mock("@/types/constants", () => ({
  API_URL: "https://api.example.test/",
}));

const originalFetch = globalThis.fetch;
const fetchMock = jest.fn();

const updated = {
  requestStatus: "SUCCESS",
  statusCode: 200,
  statusText: "OK",
  data: {
    id: 50,
    keyId: 10,
    locale: "en",
    value: "Email address",
    createdAt: "2026-09-22T00:00:00.000Z",
    updatedAt: "2026-09-22T01:00:00.000Z",
  },
};

function respond(
  payload: unknown,
  status = 200,
  contentType = "application/json",
) {
  fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Conflict",
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

it("uses the exact locale PATCH endpoint with credentials", async () => {
  respond(updated);

  await expect(
    updateTranslation(
      10,
      "en",
      {
        value: "Email address",
      },
    ),
  ).resolves.toEqual(updated);

  expect(fetchMock).toHaveBeenCalledWith(
    "https://api.example.test/api/v1/i18n/keys/10/translations/en",
    {
      method: "PATCH",
      credentials: "include",
      signal: undefined,
      body: JSON.stringify({
        value: "Email address",
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("encodes the locale path segment", async () => {
  respond({
    ...updated,
    data: {
      ...updated.data,
      locale: "zh-Hant",
    },
  });

  await updateTranslation(
    10,
    "zh-Hant",
    {
      value: "電子郵件",
    },
  );

  expect(fetchMock.mock.calls[0][0]).toBe(
    "https://api.example.test/api/v1/i18n/keys/10/translations/zh-Hant",
  );
});

it("preserves structured backend field errors", async () => {
  const payload = {
    message: "Translation value is invalid.",
    statusCode: 400,
    code: "BAD_REQUEST",
    field: "value",
  };

  respond(payload, 400);

  await expect(
    updateTranslation(
      10,
      "en",
      {
        value: "Email address",
      },
    ),
  ).rejects.toMatchObject({
    name: "TranslationKeyApiError",
    status: 400,
    message: payload.message,
    payload,
  });
});

it("rejects malformed successful responses", async () => {
  respond({
    ...updated,
    data: {
      ...updated.data,
      id: "50",
    },
  });

  await expect(
    updateTranslation(
      10,
      "en",
      {
        value: "Email address",
      },
    ),
  ).rejects.toThrow();
});

it("reports non-JSON HTTP errors through TranslationKeyApiError", async () => {
  respond(
    "<html>Conflict</html>",
    409,
    "text/html",
  );

  await expect(
    updateTranslation(
      10,
      "en",
      {
        value: "Email address",
      },
    ),
  ).rejects.toBeInstanceOf(
    TranslationKeyApiError,
  );
});

it("forwards cancellation and performs no automatic retry", async () => {
  const controller = new AbortController();
  const error = new Error("Connection lost");

  fetchMock.mockRejectedValue(error);

  await expect(
    updateTranslation(
      10,
      "en",
      {
        value: "Email address",
      },
      controller.signal,
    ),
  ).rejects.toBe(error);

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][1].signal).toBe(
    controller.signal,
  );
});
