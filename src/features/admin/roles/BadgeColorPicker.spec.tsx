import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { BadgeColorPicker } from "./BadgeColorPicker";

function Fixture() {
  const [color, setColor] = useState("#ff0000");
  return <><BadgeColorPicker value={color} onChange={setColor} /><output aria-label="Selected color">{color}</output></>;
}
it("adjusts hue, saturation and brightness with keyboard-accessible controls", () => {
  render(<Fixture />);
  fireEvent.click(screen.getByRole("button", { name: "Pick badge color" }));
  const wheel = screen.getByRole("slider", { name: "Color wheel" });
  fireEvent.keyDown(wheel, { key: "ArrowRight", shiftKey: true });
  expect(screen.getByLabelText("Selected color")).toHaveTextContent("#ff2a00");
  fireEvent.keyDown(wheel, { key: "ArrowDown", shiftKey: true });
  expect(wheel).toHaveAttribute("aria-valuetext", "Hue 10 degrees, saturation 90 percent");
  fireEvent.change(screen.getByRole("slider", { name: "Brightness" }), { target: { value: "0" } });
  expect(screen.getByLabelText("Selected color")).toHaveTextContent("#000000");
  fireEvent.change(screen.getByRole("slider", { name: "Brightness" }), { target: { value: "100" } });
  expect(wheel).toHaveAttribute("aria-valuetext", "Hue 10 degrees, saturation 90 percent");
});
it("does not open a disabled picker", () => {
  render(<BadgeColorPicker value="" disabled onChange={jest.fn()} />);
  expect(screen.getByRole("button", { name: "Pick badge color" })).toBeDisabled();
});
it("selects a color from the wheel using pointer coordinates", () => {
  render(<Fixture />);
  fireEvent.click(screen.getByRole("button", { name: "Pick badge color" }));
  const wheel = screen.getByRole("slider", { name: "Color wheel" });
  jest.spyOn(wheel, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 200, height: 200 } as DOMRect);
  wheel.setPointerCapture = jest.fn();
  const event = new MouseEvent("pointerdown", { bubbles: true, clientX: 200, clientY: 100, button: 0 });
  Object.defineProperty(event, "pointerId", { value: 1 });
  fireEvent(wheel, event);
  expect(screen.getByLabelText("Selected color")).toHaveTextContent("#80ff00");
  expect(wheel.setPointerCapture).toHaveBeenCalledWith(1);
});
