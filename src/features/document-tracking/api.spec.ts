import { trackingApi, TrackingRequestError } from "./api";
import { trackingRecord } from "./tracking.test-fixtures";

const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });
it("sends uploads as authenticated multipart requests without overriding the boundary", async () => {
  const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 201, json: async () => trackingRecord } as Response);
  global.fetch = fetchMock;
  const file = new File(["Document notes"], "notes.txt", { type: "text/plain" });
  await trackingApi.uploadAttachment(trackingRecord.id, trackingRecord.version, { name: "Notes", kind: "SUPPORTING" }, file);
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toContain("/attachments/upload");
  expect(init.credentials).toBe("include");
  expect(init.headers).not.toHaveProperty("Content-Type");
  expect(init.body.get("version")).toBe(String(trackingRecord.version));
  expect(init.body.get("file")).toBe(file);
});

it("warns that an acknowledged mutation may have been saved when its response is invalid", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ unexpected: true }) } as Response);
  await expect(trackingApi.archive(trackingRecord.id, trackingRecord.version, "Duplicate")).rejects.toMatchObject({
    name: "TrackingRequestError", status: 200,
    message: expect.stringContaining("Your change may have been saved"),
  });
});

it("reports invalid read responses without implying a write occurred", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => null } as Response);
  await expect(trackingApi.get(trackingRecord.id)).rejects.toEqual(new TrackingRequestError("The server returned an unexpected response. Reload the page to try again.", 200));
});
