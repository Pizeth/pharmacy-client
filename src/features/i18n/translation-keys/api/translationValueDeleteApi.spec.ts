import {
  deleteTranslation,
  TranslationKeyApiError,
} from "./translationKeyApi";

jest.mock("@/types/constants", () => ({
  API_URL: "https://api.example.test/",
}));

const originalFetch =
  globalThis.fetch;

const fetchMock =
  jest.fn();

const deleted = {
  requestStatus: "SUCCESS",
  statusCode: 200,
  statusText: "OK",
  data: {
    id: 50,
    keyId: 10,
    locale: "en",
  },
};

function respond(
  payload: unknown,
  status = 200,
  contentType = "application/json",
) {
  fetchMock.mockResolvedValue({
    ok:
      status >= 200 &&
      status < 300,

    status,

    statusText:
      status === 200
        ? "OK"
        : "Forbidden",

    headers: {
      get: () =>
        contentType,
    },

    json: async () =>
      payload,
  });
}

beforeEach(() => {
  fetchMock.mockReset();

  globalThis.fetch =
    fetchMock;
});

afterAll(() => {
  globalThis.fetch =
    originalFetch;
});

it("uses the exact nested DELETE endpoint with credentials and validates the deleted identity", async () => {
  respond(deleted);

  await expect(
    deleteTranslation(
      10,
      "en",
    ),
  ).resolves.toEqual(
    deleted,
  );

  expect(
    fetchMock,
  ).toHaveBeenCalledWith(
    "https://api.example.test/api/v1/i18n/keys/10/translations/en",
    {
      method: "DELETE",
      credentials: "include",
      signal: undefined,
      headers: {
        Accept:
          "application/json",
      },
    },
  );

  expect(
    fetchMock,
  ).toHaveBeenCalledTimes(1);
});

it("encodes the locale path segment", async () => {
  respond({
    ...deleted,
    data: {
      ...deleted.data,
      locale: "zh-Hant",
    },
  });

  await deleteTranslation(
    10,
    "zh-Hant",
  );

  expect(
    fetchMock.mock
      .calls[0][0],
  ).toBe(
    "https://api.example.test/api/v1/i18n/keys/10/translations/zh-Hant",
  );
});

it("preserves structured backend rejection instead of claiming success", async () => {
  const payload = {
    message:
      "Deletion is not allowed",
    statusCode:
      403,
    code:
      "FORBIDDEN",
  };

  respond(
    payload,
    403,
  );

  await expect(
    deleteTranslation(
      10,
      "en",
    ),
  ).rejects.toMatchObject({
    name:
      "TranslationKeyApiError",

    status:
      403,

    message:
      payload.message,

    payload,
  });
});

it.each([
  {
    ...deleted,
    requestStatus:
      "FAILED",
  },

  {
    ...deleted,
    data: {
      ...deleted.data,
      id:
        "50",
    },
  },

  {
    ...deleted,
    data: {
      ...deleted.data,
      keyId:
        "10",
    },
  },

  {
    ...deleted,
    data: {
      ...deleted.data,
      locale:
        123,
    },
  },

  undefined,
])(
  "rejects malformed successful responses (%#)",
  async (payload) => {
    respond(payload);

    await expect(
      deleteTranslation(
        10,
        "en",
      ),
    ).rejects.toThrow();
  },
);

it("does not claim success for an empty 204 response", async () => {
  respond(
    undefined,
    204,
    "",
  );

  await expect(
    deleteTranslation(
      10,
      "en",
    ),
  ).rejects.toThrow();
});

it("reports non-JSON HTTP failures through TranslationKeyApiError", async () => {
  respond(
    "<html>Forbidden</html>",
    403,
    "text/html",
  );

  await expect(
    deleteTranslation(
      10,
      "en",
    ),
  ).rejects.toBeInstanceOf(
    TranslationKeyApiError,
  );
});

it("forwards cancellation and performs no automatic retry", async () => {
  const controller =
    new AbortController();

  const error =
    new Error(
      "Connection lost",
    );

  fetchMock.mockRejectedValue(
    error,
  );

  await expect(
    deleteTranslation(
      10,
      "en",
      controller.signal,
    ),
  ).rejects.toBe(
    error,
  );

  expect(
    fetchMock,
  ).toHaveBeenCalledTimes(
    1,
  );

  expect(
    fetchMock.mock
      .calls[0][1]
      .signal,
  ).toBe(
    controller.signal,
  );
});
