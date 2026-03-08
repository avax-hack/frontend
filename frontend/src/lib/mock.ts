// Mock mode flag
export const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

// Simulate network delay
export const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data registry
type MockHandler = (path: string, options?: unknown) => unknown

const mockHandlers = new Map<string, MockHandler>()

export function registerMock(pathPattern: string, handler: MockHandler) {
  mockHandlers.set(pathPattern, handler)
}

export function getMockHandler(path: string): MockHandler | undefined {
  if (mockHandlers.has(path)) return mockHandlers.get(path)

  for (const [pattern, handler] of mockHandlers) {
    const regex = new RegExp('^' + pattern.replace(/:[\w]+/g, '[^/]+') + '$')
    if (regex.test(path)) return handler
  }

  return undefined
}

// Initialize mocks — call once at app startup
let initialized = false
export async function initMocks() {
  if (initialized || !IS_MOCK) return
  initialized = true
  await import('@/mocks')
  console.log('[mock] Mock mode enabled')
}
