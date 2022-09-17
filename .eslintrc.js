const ALLOW_UNUSED_VARNAME_PATTERN = "^_"

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    node: true,
  },
  plugins: ["import", "@typescript-eslint", "jest"],
  rules: {
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
