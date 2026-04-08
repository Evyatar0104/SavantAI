import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "crop_icon.js",
    "crop_icon_simple.js",
    "fix-lessons.js",
    "update-lessons.js",
    "update-lessons2.js",
    "update-lessons3.js",
    "public/*.js",
  ]),
]);

export default eslintConfig;
