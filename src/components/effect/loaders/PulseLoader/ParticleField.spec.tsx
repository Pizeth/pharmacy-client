import { stormPhase } from "./ParticleField";

test("matches the solar reference's radius, depth and opacity keyframes", () => {
  expect(stormPhase(0).opacity).toBeCloseTo(0, 2);
  expect(stormPhase(0.1).opacity).toBe(1);
  expect(stormPhase(0.2).radius).toBe(1);
  expect(stormPhase(0.2).depth).toBeCloseTo(0, 2);
  expect(stormPhase(0.6).depth).toBe(1.6);
  expect(stormPhase(0.9).radius).toBeCloseTo(1.2, 2);
  expect(stormPhase(1).opacity).toBeCloseTo(0, 2);
  expect(stormPhase(1).radius).toBeCloseTo(0, 2);
  expect(stormPhase(1).depth).toBeCloseTo(0, 2);
});
