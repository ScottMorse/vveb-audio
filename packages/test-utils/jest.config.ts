import { Config } from "jest"

const config: Config = {
  setupFilesAfterEnv: [require.resolve("./setupTests.ts")],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    nanoid: require.resolve("nanoid"),
  },
  transform: {
    "^.+\\.[jt]sx?$": "ts-jest",
    "/node_modules/nanoid.*": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!nanoid).*"],
}

export default config
