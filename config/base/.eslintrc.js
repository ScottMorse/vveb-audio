/* eslint-disable no-undef */
const ALLOW_UNUSED_VARNAME_PATTERN = "^_"

module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    "shared-node-browser": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["import", "@typescript-eslint", "jest", "sort-class-members"],
  rules: {
    /** Special formatting rules begin (otherwise all formatting is Prettier) */
    "lines-between-class-members": "warn",
    "sort-class-members/sort-class-members": [
      "warn",
      {
        order: [
          "[static-properties]",
          "[static-methods]",
          "[properties]",
          "constructor",
          "[methods]",
          "[conventional-private-properties]",
          "[conventional-private-methods]",
        ],
        groups: {
          properties: [
            {
              type: "property",
              sort: "alphabetical",
            },
          ],
          methods: [
            {
              type: "method",
              sort: "alphabetical",
            },
          ],
        },
        accessorPairPositioning: "getThenSet",
      },
    ],
    /** Special formatting rules end */

    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-empty": "warn",
    "@typescript-eslint/no-extra-semi": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
        argsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
        destructuredArrayIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
        caughtErrorsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
      },
    ],
    eqeqeq: "error",
    "prefer-const": "error",
    "import/order": [
      "warn",
      {
        alphabetize: { order: "asc", caseInsensitive: true },
        pathGroups: [
          {
            pattern: "@/**",
            group: "external",
            position: "after",
          },
        ],
      },
    ],
  },
}
