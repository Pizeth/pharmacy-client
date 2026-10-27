import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ProgressForm } from "./ProgressForm";
import { DocumentForm } from "./DocumentForm";
import { DocumentDetailContent } from "./DocumentDetail";
import { trackingApi, TrackingRequestError } from "./api";
import { trackingMetadata, trackingRecord } from "./tracking.test-fixtures";
afterEach(() => jest.restoreAllMocks());
function mount(children: React.ReactNode) {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
    </QueryClientProvider>,
  );
}
it("shows a readable missing-note error without submitting progress", async () => {
  const progress = jest.spyOn(trackingApi, "progress");
  mount(<ProgressForm record={trackingRecord} metadata={trackingMetadata} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Action" }));
  fireEvent.click(screen.getByRole("option", { name: "Put on hold" }));
  fireEvent.click(screen.getByRole("button", { name: "Put on hold" }));
  expect(await screen.findByText("A reason or comment is required for this action.")).toBeInTheDocument();
  expect(progress).not.toHaveBeenCalled();
});
it("sends the selected receiving handler with the exact open-form version", async () => {
  const progress = jest
    .spyOn(trackingApi, "progress")
    .mockResolvedValue(trackingRecord);
  const success = jest.fn();
  mount(
    <ProgressForm
      record={trackingRecord}
      metadata={trackingMetadata}
      onCancel={jest.fn()}
      onSuccess={success}
    />,
  );
  fireEvent.mouseDown(
    screen.getByRole("combobox", { name: /Receiving handler/ }),
  );
  fireEvent.click(screen.getByRole("option", { name: "Receiving handler" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Hand over to next stage" }),
  );
  await waitFor(() =>
    expect(progress).toHaveBeenCalledWith(
      trackingRecord.id,
      expect.objectContaining({
        action: "FORWARD",
        assignedToId: 2,
        version: 3,
      }),
    ),
  );
  await waitFor(() => expect(success).toHaveBeenCalled());
});
it("preserves the draft and blocks retrying a stale form without reloading", async () => {
  jest
    .spyOn(trackingApi, "save")
    .mockRejectedValue(new TrackingRequestError("Changed", 409));
  mount(
    <DocumentForm
      mode="edit"
      record={trackingRecord}
      metadata={trackingMetadata}
      onCancel={jest.fn()}
      onSuccess={jest.fn()}
    />,
  );
  fireEvent.change(screen.getByLabelText(/Document title/), {
    target: { value: "Updated title" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(
    await screen.findByText(/Close and reopen it to review the latest version/),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/Document title/)).toHaveValue("Updated title");
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
});
it("requires an archive reason and makes no request on navigation or cancel", async () => {
  const archive = jest.spyOn(trackingApi, "archive");
  const cancel = jest.fn();
  mount(
    <DocumentForm
      mode="delete"
      record={trackingRecord}
      metadata={trackingMetadata}
      onCancel={cancel}
      onSuccess={jest.fn()}
    />,
  );
  expect(archive).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Archive record" }));
  expect(
    await screen.findByText("Give a reason for archiving this record."),
  ).toBeInTheDocument();
  expect(archive).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(cancel).toHaveBeenCalled();
});
it("renders the route and full return history in a compact detail without mutation controls for a reader", () => {
  mount(
    <DocumentDetailContent
      compact
      record={{
        ...trackingRecord,
        permissions: { canManage: false, canUpdateProgress: false },
        events: [
          ...trackingRecord.events,
          {
            ...trackingRecord.events[0],
            id: "return",
            sequence: 2,
            kind: "RETURNED",
            note: "Please correct the signature",
            fromStage: "Processing",
            toStage: "Received",
          },
        ],
      }}
      onProgress={jest.fn()}
    />,
  );
  expect(screen.getByLabelText("Document route progress")).toBeInTheDocument();
  expect(screen.getByText("Returned for rework")).toBeInTheDocument();
  expect(screen.getByText("Please correct the signature")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Update progress" }),
  ).not.toBeInTheDocument();
});
