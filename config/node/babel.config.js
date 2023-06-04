module.exports = {
  extends: require.resolve("../base/babel.config.js"),
  overrides: [
    {
      test: /\.tsx?$/,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
          },
        ],
      ],
    },
  ],
}
