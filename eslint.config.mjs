import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // ✅ Relax strict rules that commonly cause deployment issues
      "@typescript-eslint/no-unused-vars": "warn", // Changed from error to warning
      "@typescript-eslint/no-explicit-any": "warn", // Allow 'any' type with warning
      "react-hooks/exhaustive-deps": "warn", // Dependency array warnings
      "@next/next/no-img-element": "warn", // Allow img tags with warning
      "prefer-const": "warn", // Variable declaration warnings
      
      // ✅ Disable problematic rules
      "@typescript-eslint/no-empty-interface": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
  {
    // ✅ Ignore specific files/patterns that cause issues
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "*.config.js",
      "*.config.ts",
      ".env*",
    ],
  },
];

export default eslintConfig;