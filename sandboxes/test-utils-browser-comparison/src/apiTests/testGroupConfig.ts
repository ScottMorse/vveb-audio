import { PartiallyRequired } from "@@core/internal/util/types"
import { AppState } from "src/lib/appContext"

export interface ApiTestResult {
  /** An array of `Errors` or at least objects with a `message` property */
  errors: PartiallyRequired<Partial<Error>, "message">[]
}

export interface TestConfig {
  name: string
  run: (context: AppState) => Promise<ApiTestResult> | ApiTestResult
}

export type TestGroupConfig<TestId extends string = string> = {
  name: string
  tests: { [testId in TestId]: TestConfig }
}
