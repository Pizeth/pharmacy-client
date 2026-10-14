/** Build opt-in and runtime secret are independent; a normal build stays closed. */
export function canAccessLocalProfile(input: {
  readonly buildMode?: string;
  readonly runtimeMode?: string;
  readonly expectedToken?: string;
  readonly token?: string | string[];
}): boolean {
  return (input.buildMode === "browser" || input.buildMode === "react")
    && input.runtimeMode === input.buildMode
    && typeof input.expectedToken === "string"
    && /^[a-f0-9]{64}$/.test(input.expectedToken)
    && input.token === input.expectedToken;
}
