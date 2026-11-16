import { hexToHsv, hsvToHex } from "./badgeColor";
it.each(["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000", "#1565c0", "#112233"])("round-trips %s through wheel coordinates", color => {
  expect(hsvToHex(hexToHsv(color))).toBe(color);
});
