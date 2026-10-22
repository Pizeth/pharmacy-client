import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // 1. Global Ignores (Must be the first object and only contain 'ignores')
  {
    ignores: [".next/**", ".open-next/**", ".vercel/**", "node_modules/**", "dist/**", "out/**", "coverage/**", "next-env.d.ts"],
  },

  // 2. Base Next.js & TS Configs
  ...nextVitals,
  ...nextTypescript,

  // 3. Custom Rule Overrides
  {
    name: "pharmacy-client-overrides",
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      // During migration, you might want to keep these off to avoid noise
      // "@typescript-eslint/no-explicit-any": "off",
      // "react/display-name": "off",
    },
  },
];

export default eslintConfig;
