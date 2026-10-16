import { render } from "@testing-library/react";
import RazMeta from "./meta";

it("keeps each Meta arc bound to its own gradient when multiple icons are rendered", () => {
  const { container } = render(<><RazMeta /><RazMeta /></>);
  const gradients = Array.from(container.querySelectorAll("linearGradient"));
  const arcs = Array.from(container.querySelectorAll(".meta-gradient-layer"));

  expect(gradients).toHaveLength(2);
  expect(new Set(gradients.map((gradient) => gradient.id)).size).toBe(2);
  arcs.forEach((arc, index) => {
    expect(arc).toHaveAttribute("fill", `url(#${gradients[index].id})`);
  });
});
