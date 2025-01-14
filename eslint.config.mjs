// @ts-check

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

import reactPlugin from "eslint-plugin-react";
import pluginReactCompiler from "eslint-plugin-react-compiler";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import vitestPlugin from "eslint-plugin-vitest";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  // @ts-expect-error Malformed types
  reactPlugin.configs.flat.recommended,
  // @ts-expect-error Malformed types
  reactPlugin.configs.flat["jsx-runtime"],
  {
    // TODO replace with https://github.com/facebook/react/pull/30774
    name: "react-hooks/recommended",
    // @ts-expect-error Malformed types
    plugins: { "react-hooks": reactHooksPlugin },
    // @ts-expect-error Malformed types
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  {
    plugins: {
      "react-compiler": pluginReactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-empty-function": "warn",
      "no-nested-ternary": "warn",
      "no-unreachable": "warn",
      "object-shorthand": "warn",
      "linebreak-style": ["warn", "unix"],
      eqeqeq: ["warn", "smart"],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],

      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "react/prop-types": "off",
      "react/jsx-fragments": ["warn", "syntax"],
      "react/jsx-curly-brace-presence": ["warn", "never"],
      "react/no-unknown-property": [
        "error",
        {
          ignore: ["css"],
        },
      ],
      "react/function-component-definition": [
        "error",
        { namedComponents: "function-declaration", unnamedComponents: [] },
      ],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
  },
);
