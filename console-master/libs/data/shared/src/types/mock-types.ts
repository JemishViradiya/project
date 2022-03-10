declare global {
  interface Window {
    model: {
      mockAll(action: MockAction): void
      _mocks: Record<string, Omit<MockAction, 'id'>>
    }
    CYPRESS_CI_TESTING: boolean
  }
}

export interface MockAction {
  id: string
  data?: Record<string, unknown>
  error?: Record<string, unknown>
}
