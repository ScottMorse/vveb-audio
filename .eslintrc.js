const ALLOW_UNUSED_VARNAME_PATTERN = "^_"

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["eslint-plugin-import", "@typescript-eslint/eslint-plugin", "jest"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
        argsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
        destructuredArrayIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
        caughtErrorsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
      },
    ],
    "import/order": "warn",
    "prefer-const": "error",
    "import/order": [
      "warn",
      { alphabetize: { order: "asc", caseInsensitive: true } },
    ],
  },
}
