import { Config } from "jest"

const config: Config = {
  setupFilesAfterEnv: ["./setupTests.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
}

export default config
