import { render } from "@testing-library/react";
import RazShare from "./share";
it("gives the shared social icon a secondary palette color using the MUI icon family", () => {
  const { container } = render(<RazShare color="secondary" />);
  expect(container.firstChild).toHaveClass("MuiSvgIcon-colorSecondary");
  expect(container.querySelector("svg")).toHaveAttribute("data-testid", "ShareOutlinedIcon");
});
