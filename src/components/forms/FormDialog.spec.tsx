import { fireEvent, render, screen } from "@testing-library/react";

import { FormDialog } from "./FormDialog";

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
