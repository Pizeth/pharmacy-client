import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RecordHero, ResourceRecordPage } from "./ResourceRecordPage";

jest.mock("@/components/layouts/ResourcePage", () => ({
  ResourcePage: ({ children }: { children: React.ReactNode }) => children,
}));

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

it("waits for detail content before printing and supports printing again from the cover", async () => {
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready: Promise.resolve() } });
  const print = jest.spyOn(window, "print").mockImplementation(() => undefined);
  window.history.replaceState(null, "", "/admin/users/12?print=1");
  const page = (loading: boolean, pending: boolean) => (
    <ResourceRecordPage title="User profile" backHref="/admin/users" loading={loading} onRetry={() => undefined}>
      <RecordHero title="Jane Doe" eyebrow="User" icon={null} />
      {pending ? <p data-record-print-pending>Loading profile</p> : <p>Profile details</p>}
    </ResourceRecordPage>
  );

  const { rerender } = render(page(true, true));
  expect(screen.queryByRole("button", { name: "Print details" })).not.toBeInTheDocument();
  expect(print).not.toHaveBeenCalled();
  rerender(page(false, true));
  expect(print).not.toHaveBeenCalled();
  expect(window.location.search).toBe("?print=1");
  rerender(page(false, false));

  await waitFor(() => { expect(print).toHaveBeenCalledTimes(1); });
  expect(window.location.search).toBe("");
  expect(screen.getByText("Profile details").closest("[data-record-print]")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Print details" }));
  await waitFor(() => { expect(print).toHaveBeenCalledTimes(2); });
});
