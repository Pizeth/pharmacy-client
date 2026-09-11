// jest.config.mjs

import nextJest from "next/jest.js";

/**
 * ------------------------------------------------------------------
 * Next.js Jest configuration
 * ------------------------------------------------------------------
 *
 * next/jest provides the SWC transform and standard Next.js handling
 * for:
 *
 * - TypeScript
 * - JSX/TSX
 * - CSS
 * - images
 * - next/font
 * - environment files
 */
const createJestConfig = nextJest({
  dir: "./",
});

/**
 * Configuration supplied to next/jest before it generates its final
 * Jest configuration.
 *
 * @type {import("jest").Config}
 */
const customJestConfig = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  clearMocks: true,
};

/**
 * next/jest returns an asynchronous configuration factory because it
 * must read Next.js configuration before constructing Jest's final
 * setup.
 */
const getNextJestConfig = createJestConfig(customJestConfig);

/**
 * Export the FINAL generated configuration rather than exporting
 * createJestConfig(customJestConfig) directly.
 *
 * Why?
 *
 * next/jest installs its own:
 *
 *   /node_modules/
 *
 * transformIgnorePatterns entry.
 *
 * That normally makes sense, but TanStack Table v9 is consumed as ESM.
 *
 * Our column-definition tests now execute the real:
 *
 *   @tanstack/react-table
 *   @tanstack/table-core
 *
 * runtime, so Jest must allow those packages through Next's SWC
 * transformer.
 */
export default async () => {
  const config = await getNextJestConfig();

  /**
   * Remove next/jest's generated node_modules exclusion.
   *
   * We immediately replace it below with an equivalent exclusion that
   * contains a very narrow TanStack exception.
   *
   * Keep all unrelated transform-ignore rules, including Next's CSS
   * module rule.
   */
  const remainingTransformIgnorePatterns = (
    config.transformIgnorePatterns ?? []
  ).filter((pattern) => !pattern.startsWith("/node_modules"));

  return {
    ...config,

    /**
     * Ignore every node_modules package EXCEPT the two TanStack Table
     * runtime packages used by our real table implementation.
     *
     * These packages will therefore flow through Next's existing SWC
     * Jest transformer.
     *
     * Do not broadly transpile all node_modules.
     */
    transformIgnorePatterns: [
      "/node_modules/(?!@tanstack/(?:table-core|react-table)/)",

      ...remainingTransformIgnorePatterns,
    ],
  };
};
