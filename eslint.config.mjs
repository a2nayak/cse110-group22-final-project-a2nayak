import js from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...jestPlugin.environments.globals.globals
      }
    },

    plugins: {
      jest: jestPlugin
    },

    rules: {
      ...jestPlugin.configs.recommended.rules
    }
  }
];


