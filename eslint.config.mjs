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
    // vendored third-party components (React Bits), kept as published
    "src/components/reactbits/**",
    // vendored swarm engine, served as-is (see the credit in its header)
    "public/swarm-cursors.js",
  ]),
]);

export default eslintConfig;
