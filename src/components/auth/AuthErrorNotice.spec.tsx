import { act, render, screen } from "@testing-library/react";
import { AuthErrorNotice } from "./AuthErrorNotice";
import {
  beginLoginAttempt, reportLoginFailure, reportLoginResponse,
} from "@/lib/auth/loginFeedback";

let mockSearch = "";
jest.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(mockSearch) }));

beforeEach(() => { sessionStorage.clear(); mockSearch = ""; });

it("replaces a password error with the next social error in one shared alert", () => {
  render(<AuthErrorNotice />);
  act(() => reportLoginFailure("Password login failed."));
  expect(screen.getAllByRole("alert")).toHaveLength(1);
  expect(screen.getByRole("alert")).toHaveTextContent("Password login failed.");

  act(() => beginLoginAttempt());
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  act(() => reportLoginFailure("Social login blocked."));
  expect(screen.getAllByRole("alert")).toHaveLength(1);
  expect(screen.getByRole("alert")).toHaveTextContent("Social login blocked.");
  expect(screen.queryByText("Password login failed.")).not.toBeInTheDocument();
});

it("clears failures after successful authentication", () => {
  render(<AuthErrorNotice />);
  act(() => reportLoginFailure("One Tap failed."));
  act(() => {
    beginLoginAttempt();
    reportLoginResponse({ user: { id: "1" }, token: "test-session" });
  });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("shows an OAuth callback failure once and clears it when retrying", () => {
  mockSearch = "authError=1";
  render(<AuthErrorNotice />);
  expect(screen.getAllByRole("alert")).toHaveLength(1);
  act(() => beginLoginAttempt());
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
