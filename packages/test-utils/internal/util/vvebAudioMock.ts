import { ConstructorNameToString } from "./decorators"

const MOCK_INTERNALS_KEY = Symbol("__vvebMockInternals")

export class MockInternals<Controller> {
  readonly controller: Controller = null as unknown as Controller
}

/** Mock classes hide the mock implementation details behind a single internal class to minimize additions to the main interface */
@ConstructorNameToString
export abstract class MockController<T extends MockInternals<any>> {
  [MOCK_INTERNALS_KEY]: T

  constructor(mock: T) {
    ;(mock as { controller: any }).controller = this

    this[MOCK_INTERNALS_KEY] = mock
  }
}

type ExtractMockInternals<T> = T extends MockController<infer U> ? U : never

export const getInternals = <T extends MockController<any>>(
  mock: T
): ExtractMockInternals<T> => mock[MOCK_INTERNALS_KEY]
