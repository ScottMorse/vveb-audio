import { MockEnvironment } from "./createMockFactory"

export class MockInternals<MockInterface> {
  constructor(
    protected readonly mock: MockInterface,
    protected readonly mockEnvironment: MockEnvironment
  ) {}
}
