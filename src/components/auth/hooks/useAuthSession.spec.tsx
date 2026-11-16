import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthSession } from "./useAuthSession";

const mockReplace = jest.fn();
const mockReset = jest.fn();
const mockOneTap = jest.fn();
const mockFailure = jest.fn();
let mockAuth: {isLoading:boolean; isFetching:boolean; data?: {authenticated:boolean; redirectTo?:string}};
jest.mock("@refinedev/core", () => ({useIsAuthenticated: () => mockAuth}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({replace:mockReplace}),
  useSearchParams: () => new URLSearchParams("callbackUrl=%2Fadmin%2Fdocuments"),
}));
jest.mock("jotai", () => ({useSetAtom: () => mockReset}));
jest.mock("@/Stores/validationStore", () => ({resetAllValidationsAtom: {}}));
jest.mock("@/lib/auth-client", () => ({authClient: {oneTap: (...args:unknown[]) => mockOneTap(...args)}}));
jest.mock("@/lib/auth/loginFeedback", () => ({reportLoginFailure: () => mockFailure()}));

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth = {isLoading:false, isFetching:false, data:{authenticated:false}};
  mockOneTap.mockResolvedValue(undefined);
});

it("does not prompt before the session check resolves", () => {
  mockAuth = {isLoading:true, isFetching:true};
  const {result} = renderHook(() => useAuthSession("signin"));
  expect(result.current.isLoading).toBe(true);
  expect(mockOneTap).not.toHaveBeenCalled();
});

it("redirects authenticated users without prompting One Tap", () => {
  mockAuth.data = {authenticated:true};
  renderHook(() => useAuthSession("signin"));
  expect(mockReplace).toHaveBeenCalledWith("/admin/documents");
  expect(mockOneTap).not.toHaveBeenCalled();
});

it("preserves the auth provider's redirect", () => {
  mockAuth.data = {authenticated:true, redirectTo:"/admin/dashboard"};
  renderHook(() => useAuthSession("signin"));
  expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
});

it("prompts once across mode changes and sends success to the safe callback", () => {
  const {result,rerender} = renderHook(() => useAuthSession("signin"));
  act(() => result.current.handleToggle());
  expect(result.current.currentMode).toBe("signup");
  expect(mockReset).toHaveBeenCalledTimes(2);
  rerender();
  expect(mockOneTap).toHaveBeenCalledTimes(1);
  act(() => mockOneTap.mock.calls[0][0].fetchOptions.onSuccess());
  expect(mockReplace).toHaveBeenCalledWith("/admin/documents");
  act(() => result.current.handleToggle());
  expect(result.current.currentMode).toBe("signin");
});

it("reports One Tap failure without an unhandled rejection", async () => {
  mockOneTap.mockRejectedValueOnce(new Error("Prompt unavailable"));
  renderHook(() => useAuthSession("signin"));
  await waitFor(() => expect(mockFailure).toHaveBeenCalledTimes(1));
});
