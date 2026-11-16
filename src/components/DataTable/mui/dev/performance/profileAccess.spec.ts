import { canAccessLocalProfile } from "./profileAccess";

const allowed = { buildMode: "browser", runtimeMode: "browser", expectedToken: "a".repeat(64), token: "a".repeat(64) };
it("requires both build and runtime opt-in and an exact per-run token", () => {
  expect(canAccessLocalProfile(allowed)).toBe(true);
  for (const invalid of [
    { buildMode: "disabled" }, { runtimeMode: undefined }, { runtimeMode: "react" },
    { expectedToken: undefined }, { expectedToken: "short", token: "short" },
    { token: undefined }, { token: "b".repeat(64) }, { token: [allowed.token] },
  ]) expect(canAccessLocalProfile({ ...allowed, ...invalid })).toBe(false);
});
