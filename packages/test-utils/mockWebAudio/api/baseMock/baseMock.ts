export class MockInternals<MockInterface> {
  readonly mock: MockInterface = null as unknown as MockInterface
}

const INTERNALS_KEY = Symbol("BaseMockInternals")

/** Mock classes hide the mock implementation details behind a single internal class to minimize additions to the main interface */
export abstract class BaseMock<T extends MockInternals<unknown>> {
  [INTERNALS_KEY]: T

  constructor(mockInternals: T) {
    ;(mockInternals as { mock: any }).mock = this
    this[INTERNALS_KEY] = mockInternals
  }
}

export type ExtractMockInternals<T> = T extends BaseMock<infer U> ? U : never

export const getInternals = <T extends BaseMock<any>>(mock: T) =>
  mock[INTERNALS_KEY] as ExtractMockInternals<T>
