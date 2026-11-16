import { act, render, screen, waitFor } from "@testing-library/react";
import { LoginFeedback } from "./LoginFeedback";
import { authClient } from "@/lib/auth-client";
import { beginLoginAttempt, reportLoginFailure, reportLoginResponse } from "@/lib/auth/loginFeedback";

jest.mock("next/navigation", () => ({ usePathname: () => "/hrd" }));
jest.mock("@/lib/auth-client", () => ({ authClient: { getSession: jest.fn() } }));

beforeEach(() => {
  sessionStorage.clear();
  jest.mocked(authClient.getSession).mockResolvedValue({ data: null, error: null });
});
afterEach(() => jest.useRealTimers());

it("shows an API failure accessibly and accepts a later successful retry", async () => {
  render(<LoginFeedback />);
  act(() => reportLoginFailure("Sign-in was blocked."));
  expect(screen.getByRole("alert")).toHaveTextContent("Sign-in was blocked.");
  act(() => {
    beginLoginAttempt();
    reportLoginResponse({ user: { id: "1" }, token: "test-session" });
  });
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("ចូលប្រើប្រាស់បានជោគជ័យ។"));
});

it("restores queued feedback when a route layout is mounted", () => {
  reportLoginFailure("Please retry.");
  render(<LoginFeedback />);
  expect(screen.getByRole("alert")).toHaveTextContent("Please retry.");
});

it("checks the returned OAuth session and waits for confirmation before showing success", async () => {
  beginLoginAttempt();
  jest.mocked(authClient.getSession).mockImplementation(async () => {
    reportLoginResponse({ user: { id: "1" }, session: { id: "session" } });
    return { data: null, error: null };
  });
  render(<LoginFeedback />);
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("ចូលប្រើប្រាស់បានជោគជ័យ។"));
  expect(authClient.getSession).toHaveBeenCalled();
});

it("automatically fades out errors after their display time", () => {
  jest.useFakeTimers();
  render(<LoginFeedback />);
  act(() => reportLoginFailure("Try again."));
  act(() => jest.advanceTimersByTime(9_999));
  expect(screen.getByRole("alert")).toHaveTextContent("Try again.");
  act(() => jest.advanceTimersByTime(1));
  act(() => jest.advanceTimersByTime(350));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
