import { Config } from "jest"

const config: Config = {
  setupFilesAfterEnv: [require.resolve("./setupTests.ts")],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  rootDir: "../../",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "/node_modules/nanoid": "babel-jest",
  },
}

export default config
