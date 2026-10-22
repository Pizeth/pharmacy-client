import { notFound } from "next/navigation";
import LoginBackgroundPreviewPage from "./page";

jest.mock("next/navigation", () => ({ notFound: jest.fn(() => { throw new Error("preview-not-found"); }) }));
jest.mock("@/components/auth/SideImagePreview", () => ({ __esModule: true, default: () => null }));

afterEach(() => jest.restoreAllMocks());

it("keeps the artwork fixture available in development", () => {
  jest.replaceProperty(process, "env", { ...process.env, NODE_ENV: "development" });
  expect(LoginBackgroundPreviewPage()).toBeTruthy();
});

it.each(["production", "test"] as const)("hides the artwork fixture in %s", environment => {
  jest.replaceProperty(process, "env", { ...process.env, NODE_ENV: environment });
  expect(() => LoginBackgroundPreviewPage()).toThrow("preview-not-found");
  expect(notFound).toHaveBeenCalled();
});
