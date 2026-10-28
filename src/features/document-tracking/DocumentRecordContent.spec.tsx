import { fireEvent, render, screen, within } from "@testing-library/react";
import { DocumentRecordContent } from "./DocumentRecordContent";
import { trackingRecord } from "./tracking.test-fixtures";

it("renders a complete document workspace with stage responsibility, storage and original files", () => {
  const progress = jest.fn(); const attachment = jest.fn();
  render(<DocumentRecordContent record={{ ...trackingRecord, notes: "Review the original request.", storageLocation: { id: "store", code: "A-01", name: "Cabinet A" }, attachments: [{ id: "file", name: "Original request.pdf", kind: "INCOMING", url: "https://example.com/request.pdf", createdAt: trackingRecord.createdAt }] }} onProgress={progress} onAttachment={attachment} />);
  expect(screen.getByRole("region", { name: "Handling route" })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Document registration" })).toBeInTheDocument();
  expect(within(screen.getByRole("region", { name: "Filing & storage" })).getByText("Cabinet A")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open attachment" })).toHaveAttribute("href", "https://example.com/request.pdf");
  expect(screen.getByText("Review the original request.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Update progress" })); expect(progress).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Add attachment" })); expect(attachment).toHaveBeenCalledTimes(1);
});
it("shows recorded history newest first and hides handler commands without permission", () => {
  render(<DocumentRecordContent record={{ ...trackingRecord, permissions: { canManage: false, canUpdateProgress: false }, events: [...trackingRecord.events, { ...trackingRecord.events[0], id: "later", sequence: 2, kind: "COMMENTED", note: "Newest note" }] }} onProgress={jest.fn()} onAttachment={jest.fn()} />);
  const history = screen.getByRole("region", { name: "Handling history" });
  const entries = within(history).getAllByRole("listitem");
  expect(entries[0]).toHaveTextContent("Newest note");
  expect(entries[1]).toHaveTextContent("Document registered.");
  expect(screen.queryByRole("button", { name: "Update progress" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Add attachment" })).not.toBeInTheDocument();
});
