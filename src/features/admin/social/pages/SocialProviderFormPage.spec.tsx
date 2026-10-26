import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocialProviderFormPage } from "./SocialProviderFormPage";
import { socialApi } from "../api";
import { useAdminAccess } from "../useAdminAccess";
jest.mock("../useAdminAccess", () => ({ useAdminAccess: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("@/components/layouts/ResourcePage", () => ({ ResourcePage: ({ children }: { children: React.ReactNode }) => children }));
afterEach(() => jest.restoreAllMocks());
it("renders a missing-record state without enabling mutations", async () => {
  jest.mocked(useAdminAccess).mockReturnValue({ allowed: true, isLoading: false } as ReturnType<typeof useAdminAccess>);
  jest.spyOn(socialApi, "providers").mockResolvedValue([]);
  const remove = jest.spyOn(socialApi, "deleteProvider");
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={client}><SocialProviderFormPage mode="delete" recordId={999} /></QueryClientProvider>);
  expect(await screen.findByText("Social provider not found.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Delete provider" })).not.toBeInTheDocument();
  expect(remove).not.toHaveBeenCalled();
});
