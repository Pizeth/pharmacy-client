import {
  deleteTranslationKey,
  TranslationKeyApiError,
} from "./translationKeyApi";

jest.mock("@/types/constants", () => ({
  API_URL: "https://api.example.test/",
}));

const originalFetch = globalThis.fetch;
const fetchMock = jest.fn();
const deleted = {
  requestStatus: "SUCCESS",
  statusCode: 200,
  statusText: "OK",
  data: { id: 31, key: "acceptance_delete_test" },
};

function respond(
  payload: unknown,
  status = 200,
  contentType = "application/json",
) {
  fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Forbidden",
    headers: { get: () => contentType },
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

it("uses the exact DELETE endpoint with credentials and validates the returned identity", async () => {
  respond(deleted);
  await expect(deleteTranslationKey(31)).resolves.toEqual(deleted);
  expect(fetchMock).toHaveBeenCalledWith(
    "https://api.example.test/api/v1/i18n/keys/31",
    {
      method: "DELETE",
      credentials: "include",
      signal: undefined,
      headers: { Accept: "application/json" },
    },
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("preserves structured backend rejection rather than treating it as success", async () => {
  const payload = {
    message: "Deletion is not allowed",
    statusCode: 403,
    code: "FORBIDDEN",
  };
  respond(payload, 403);
  await expect(deleteTranslationKey(31)).rejects.toMatchObject({
    name: "TranslationKeyApiError",
    status: 403,
    message: payload.message,
    payload,
  });
});

it.each([
  { ...deleted, requestStatus: "FAILED" },
  { ...deleted, data: { id: "31", key: "acceptance_delete_test" } },
  { ...deleted, data: { id: 31 } },
  undefined,
])("rejects a malformed success response (%#)", async (payload) => {
  respond(payload);
  await expect(deleteTranslationKey(31)).rejects.toThrow();
});

it("does not claim success when the server returns an empty 204 response", async () => {
  respond(undefined, 204, "");
  await expect(deleteTranslationKey(31)).rejects.toThrow();
});

it("reports non-JSON HTTP errors as API failures", async () => {
  respond("<html>Forbidden</html>", 403, "text/html");
  await expect(deleteTranslationKey(31)).rejects.toBeInstanceOf(
    TranslationKeyApiError,
  );
});

it("forwards cancellation and does not retry a rejected transport request", async () => {
  const controller = new AbortController();
  const error = new Error("Connection lost");
  fetchMock.mockRejectedValue(error);
  await expect(deleteTranslationKey(31, controller.signal)).rejects.toBe(error);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
});
