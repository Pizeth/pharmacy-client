// jest.config.mjs

import nextJest from "next/jest.js";

/**
 * Let Next.js configure Jest's compiler integration.
 *
 * This automatically handles things such as:
 *
 * - Next.js/SWC transforms
 * - CSS imports
 * - image imports
 * - next/font
 * - .env loading
 * - ignoring .next
 */
const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import("jest").Config} */
const config = {
  /**
   * We will test both:
   *
   * - pure DataTable utilities
   * - React/MUI DataTable components
   *
   * Therefore jsdom is the appropriate project-wide environment.
   */
  testEnvironment: "jsdom",

  /**
   * Shared browser/React assertions.
   */
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  /**
   * Your application uses:
   *
   *   @/...
   *
   * for src-relative imports.
   */
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  /**
   * Keep mocks isolated between tests.
   */
  clearMocks: true,
};

export default createJestConfig(config);
