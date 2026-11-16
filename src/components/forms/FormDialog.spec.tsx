import { fireEvent, render, screen } from "@testing-library/react";

import { FormDialog } from "./FormDialog";

it("puts the dedicated-page icon link in the title outside scrolling form content", () => {
  render(<FormDialog open title="Create record" dedicatedPageHref="/admin/users/create" dedicatedPageLabel="Open dedicated create page" onClose={jest.fn()}><div>Record fields</div></FormDialog>);
  const link = screen.getByRole("link", { name: "Open dedicated create page" });
  expect(link).toHaveAttribute("href", "/admin/users/create");
  expect(screen.getByRole("heading", { name: "Create record" }).closest(".MuiDialogTitle-root")).toContainElement(link);
  expect(screen.getByText("Record fields").closest(".MuiDialogContent-root")).not.toContainElement(link);
});

it("removes the navigation link while pending and keeps its icon button disabled", () => {
  render(<FormDialog open pending title="Edit record" dedicatedPageHref="/admin/users/edit/12" dedicatedPageLabel="Open dedicated edit page" onClose={jest.fn()}><div>Record fields</div></FormDialog>);
  expect(screen.queryByRole("link", { name: "Open dedicated edit page" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open dedicated edit page" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Close dialog" })).toBeDisabled();
});

it("requires explicit form-dialog closure", () => {
  const onClose = jest.fn();

  render(
    <FormDialog open title="Create record" onClose={onClose}>
      <div>Form content</div>
    </FormDialog>,
  );

  const backdrop = document.querySelector(".MuiBackdrop-root");

  expect(backdrop).not.toBeNull();

  if (backdrop) {
    fireEvent.mouseDown(backdrop);

    fireEvent.click(backdrop);
  }

  expect(onClose).not.toHaveBeenCalled();

  fireEvent.keyDown(screen.getByRole("dialog"), {
    key: "Escape",
  });

  expect(onClose).not.toHaveBeenCalled();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Close dialog",
    }),
  );

  expect(onClose).toHaveBeenCalledTimes(1);
});

it("bounds long forms and keeps one accessible heading outside the scrolling content", () => {
  render(<FormDialog open title="Role permissions" onClose={jest.fn()}><div>Long permission form</div></FormDialog>);
  const dialog = screen.getByRole("dialog");
  expect(dialog).toHaveStyle({ display: "flex", flexDirection: "column", maxHeight: "calc(100dvh - 64px)", overflow: "hidden" });
  expect(screen.getAllByRole("heading", { name: "Role permissions" })).toHaveLength(1);
  const content = screen.getByText("Long permission form").closest(".MuiDialogContent-root");
  expect(content).toHaveStyle({ minHeight: "0", overflowY: "auto" });
  expect(content).not.toContainElement(screen.getByRole("button", { name: "Close dialog" }));
});
