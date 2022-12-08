import { Config } from "jest"

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/testing/jest/setupTests.ts"],
  transformIgnorePatterns: [`/node_modules/(?!nanoid)`],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  rootDir: "../../",
  testEnvironment: "jsdom",
}

export default config
