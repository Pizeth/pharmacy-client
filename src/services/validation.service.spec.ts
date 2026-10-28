import axios from "axios";
import { createAsyncValidator } from "./validation.service";
jest.mock("axios");
it("refreshes an earlier availability result and safely encodes email addresses", async () => {
  const get = jest.mocked(axios.get);
  get.mockResolvedValueOnce({ data: { statusCode: 200, message: "Available" } });
  const validator = createAsyncValidator("email", 0);
  const check = () => new Promise<string>(resolve => validator.validate("fresh+tag@example.com", result => {
    if (result.status === "success" || result.status === "error") resolve(result.message);
  }));
  expect(await check()).toBe("Available");
  expect(await check()).toBe("Available");
  expect(get).toHaveBeenCalledTimes(1);
  validator.invalidate();
  get.mockResolvedValueOnce({ data: { statusCode: 409, message: "Email already exists" } });
  expect(await check()).toBe("Email already exists");
  expect(get).toHaveBeenCalledTimes(2);
  expect(get.mock.calls[0][0]).toContain("fresh%2Btag%40example.com");
  validator.cancel();
});
