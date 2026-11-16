import { act, render, screen, waitFor } from "@testing-library/react";
import { Authenticated, Refine, type AuthProvider } from "@refinedev/core";
import { useNavigationAccount } from "./useNavigationAccount";
import { useTranslationKeyFilterOptions } from "@/features/i18n/translation-keys/table/useTranslationKeyFilterOptions";
import { getTranslationCategories } from "@/features/i18n/translation-keys/api";

jest.mock("@/features/i18n/translation-keys/api", () => ({ getTranslationCategories: jest.fn() }));

function Page() {
  const { authenticated, account } = useNavigationAccount();
  const options = useTranslationKeyFilterOptions();
  return <div>{authenticated ? account?.name : "Guest"}{options.fetching ? " Loading categories" : " Categories ready"}</div>;
}
function setup(protectedPage: boolean) {
  const check = jest.fn().mockResolvedValue({ authenticated: protectedPage });
  const getIdentity = jest.fn().mockResolvedValue({ name: "Member", email: "member@example.com", role: "member" });
  const authProvider: AuthProvider = {
    check, getIdentity,
    login: async () => ({ success: true }),
    logout: async () => ({ success: true }),
    onError: async () => ({}),
  };
  jest.mocked(getTranslationCategories).mockResolvedValue({ data: [], requestStatus: "SUCCESS", statusCode: 200, statusText: "OK" });
  render(<Refine authProvider={authProvider} options={{ disableTelemetry: true }}>
    {protectedPage ? <Authenticated key="protected" loading={<div>Checking auth</div>}><Page /></Authenticated> : <Page />}
  </Refine>);
  return { check, getIdentity };
}
beforeEach(() => jest.clearAllMocks());

test("protected page settles without remounting and refetching categories", async () => {
  const { check } = setup(true);
  await waitFor(() => expect(screen.getByText("Member Categories ready")).toBeInTheDocument());
  const settledChecks = check.mock.calls.length;
  const settledCategories = jest.mocked(getTranslationCategories).mock.calls.length;
  // Allow observer notifications and any accidental remount/refetch cycle to run.
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 100)); });
  expect(check).toHaveBeenCalledTimes(settledChecks);
  expect(getTranslationCategories).toHaveBeenCalledTimes(settledCategories);
  expect(settledCategories).toBeLessThanOrEqual(2);
});

test("public page still checks an uncached session and hides guest identity", async () => {
  const { check, getIdentity } = setup(false);
  await waitFor(() => expect(screen.getByText("Guest Categories ready")).toBeInTheDocument());
  expect(check).toHaveBeenCalled();
  expect(getIdentity).not.toHaveBeenCalled();
});

