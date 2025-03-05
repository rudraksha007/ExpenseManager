import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off", // Turns off the requirement for @ts-expect-error descriptions
      "@typescript-eslint/no-unused-vars": "off", // Turns off unused variables error
      "react-hooks/exhaustive-deps": "off", // Turns off missing dependency warning for useEffect
    },
  },
];

export default eslintConfig;