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
