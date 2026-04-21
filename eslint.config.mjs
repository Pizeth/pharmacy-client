import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Global Ignores (Must be the first object and only contain 'ignores')
  {
    ignores: [".next/*", "node_modules/*", "dist/*"],
  },

  // 2. Base Next.js & TS Configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

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
