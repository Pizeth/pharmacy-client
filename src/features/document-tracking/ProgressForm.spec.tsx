import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ProgressForm, AttachmentForm } from "./ProgressForm";
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
it("uploads a selected attachment with the record version and inferred filename", async () => {
  const upload = jest.spyOn(trackingApi, "uploadAttachment").mockResolvedValue(trackingRecord);
  const file = new File(["Document notes"], "notes.txt", { type: "text/plain" });
  mount(<AttachmentForm record={trackingRecord} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  fireEvent.change(screen.getByLabelText("Attachment file"), { target: { files: [file] } });
  expect(screen.getByLabelText(/Attachment name/)).toHaveValue("notes.txt");
  fireEvent.click(screen.getByRole("button", { name: "Upload attachment" }));
  await waitFor(() => expect(upload).toHaveBeenCalledWith(trackingRecord.id, trackingRecord.version, { name: "notes.txt", kind: "SUPPORTING" }, file));
});
it("still supports attachment links without uploading a file", async () => {
  const link = jest.spyOn(trackingApi, "attachment").mockResolvedValue(trackingRecord);
  const upload = jest.spyOn(trackingApi, "uploadAttachment");
  mount(<AttachmentForm record={trackingRecord} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Attachment source" }));
  fireEvent.click(screen.getByRole("option", { name: "File URL" }));
  fireEvent.change(screen.getByLabelText(/Attachment name/), { target: { value: "Letter" } });
  fireEvent.change(screen.getByRole("textbox", { name: /File URL/ }), { target: { value: "https://files.example/letter.pdf" } });
  fireEvent.click(screen.getByRole("button", { name: "Add attachment link" }));
  await waitFor(() => expect(link).toHaveBeenCalledWith(trackingRecord.id, trackingRecord.version, { name: "Letter", url: "https://files.example/letter.pdf", kind: "SUPPORTING" }));
  expect(upload).not.toHaveBeenCalled();
});
function fillRegistration() {
  fireEvent.change(screen.getByLabelText(/Document title/), { target: { value: "Incoming letter" } });
  fireEvent.mouseDown(screen.getByRole("combobox", { name: /Category/ }));
  fireEvent.click(screen.getByRole("option", { name: "Official documents" }));
  fireEvent.mouseDown(screen.getByRole("combobox", { name: /Document type/ }));
  fireEvent.click(screen.getByRole("option", { name: "Leave request" }));
}
it("requires an attachment before creating the document record", async () => {
  const save = jest.spyOn(trackingApi, "save").mockResolvedValue(trackingRecord);
  const success = jest.fn();
  mount(<DocumentForm mode="create" metadata={trackingMetadata} onCancel={jest.fn()} onSuccess={success} />);
  expect(screen.getByLabelText("Attachment file").closest("label")).toHaveTextContent("Upload file");
  expect(screen.getByRole("combobox", { name: "Attachment source" })).toBeInTheDocument();
  fillRegistration();
  fireEvent.click(screen.getByRole("button", { name: "Register document" }));
  expect(await screen.findByText("Choose a non-empty file to upload.")).toBeInTheDocument();
  expect(save).not.toHaveBeenCalled();
  expect(success).not.toHaveBeenCalled();
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Attachment source" }));
  expect(screen.queryByRole("option", { name: "No attachment" })).not.toBeInTheDocument();
  expect(screen.queryByRole("option", { name: "Choose an option" })).not.toBeInTheDocument();
  expect(screen.getAllByRole("option")).toHaveLength(2);
});
it("saves a link supplied directly in the registration form", async () => {
  jest.spyOn(trackingApi, "save").mockResolvedValue(trackingRecord);
  const link = jest.spyOn(trackingApi, "attachment").mockResolvedValue(trackingRecord);
  const success = jest.fn();
  mount(<DocumentForm mode="create" metadata={trackingMetadata} onCancel={jest.fn()} onSuccess={success} />);
  fillRegistration();
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Attachment source" }));
  fireEvent.click(screen.getByRole("option", { name: "File URL" }));
  fireEvent.change(screen.getByRole("textbox", { name: /File URL/ }), { target: { value: "https://files.example/incoming.pdf" } });
  fireEvent.click(screen.getByRole("button", { name: "Register document" }));
  await waitFor(() => expect(link).toHaveBeenCalledWith(trackingRecord.id, trackingRecord.version, { name: "Incoming letter", kind: "INCOMING", url: "https://files.example/incoming.pdf" }));
  await waitFor(() => expect(success).toHaveBeenCalled());
});
it("retries a registration attachment failure without registering the document twice", async () => {
  const save = jest.spyOn(trackingApi, "save").mockResolvedValue(trackingRecord);
  const upload = jest.spyOn(trackingApi, "uploadAttachment").mockRejectedValueOnce(new Error("Upload failed")).mockResolvedValue(trackingRecord);
  const success = jest.fn();
  const file = new File(["Letter"], "incoming.txt", { type: "text/plain" });
  mount(<DocumentForm mode="create" metadata={trackingMetadata} onCancel={jest.fn()} onSuccess={success} />);
  fillRegistration();
  fireEvent.change(screen.getByLabelText("Attachment file"), { target: { files: [file] } });
  fireEvent.click(screen.getByRole("button", { name: "Register document" }));
  expect(await screen.findByText(/The document is saved, but its required attachment could not be confirmed/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Finish without attachment" })).not.toBeInTheDocument();
  expect(screen.getByLabelText(/Document title/)).toBeDisabled();
  expect(screen.getByLabelText(/Attachment name/)).toHaveValue("incoming.txt");
  expect(success).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Retry attachment" }));
  await waitFor(() => expect(success).toHaveBeenCalled());
  expect(save).toHaveBeenCalledTimes(1);
  expect(upload).toHaveBeenCalledTimes(2);
  expect(upload).toHaveBeenLastCalledWith(trackingRecord.id, trackingRecord.version, { name: "incoming.txt", kind: "INCOMING" }, file);
});
it("blocks registration when the link option has an empty URL", async () => {
  const save = jest.spyOn(trackingApi, "save");
  mount(<DocumentForm mode="create" metadata={trackingMetadata} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  fillRegistration();
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Attachment source" }));
  fireEvent.click(screen.getByRole("option", { name: "File URL" }));
  expect(screen.getByRole("textbox", { name: /File URL/ })).toBeRequired();
  fireEvent.click(screen.getByRole("button", { name: "Register document" }));
  expect(await screen.findByText("Enter an HTTP or HTTPS file URL.")).toBeInTheDocument();
  expect(save).not.toHaveBeenCalled();
});
it("rejects an invalid attachment URL before registering the document", async () => {
  const save = jest.spyOn(trackingApi, "save");
  mount(<DocumentForm mode="create" metadata={trackingMetadata} onCancel={jest.fn()} onSuccess={jest.fn()} />);
  fillRegistration();
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Attachment source" }));
  fireEvent.click(screen.getByRole("option", { name: "File URL" }));
  fireEvent.change(screen.getByRole("textbox", { name: /File URL/ }), { target: { value: "javascript:alert(1)" } });
  fireEvent.click(screen.getByRole("button", { name: "Register document" }));
  expect(await screen.findByText("Enter an HTTP or HTTPS file URL.")).toBeInTheDocument();
  expect(save).not.toHaveBeenCalled();
});
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
