import { IS_MOCK, getMockHandler, mockDelay } from './mock'

type AuthMode = 'none' | 'cookie' | 'bearer'

interface IFetchOptions {
  body?: unknown
  auth?: AuthMode
  headers?: Record<string, string>
  signal?: AbortSignal
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public serverMessage?: string,
  ) {
    super(serverMessage ?? `API Error: ${status}`)
    this.name = 'ApiError'
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isNotFound() {
    return this.status === 404
  }

  get isServerError() {
    return this.status >= 500
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

async function baseFetch<T>(
  method: string,
  path: string,
  options?: IFetchOptions,
): Promise<T> {
  // Mock mode — return mock data if handler exists
  if (IS_MOCK) {
    const handler = getMockHandler(path)
    if (handler) {
      await mockDelay()
      try {
        return handler(path, options) as T
      } catch (error) {
        if (error instanceof ApiError) {
          throw error
        }
        throw new ApiError(500, error instanceof Error ? error.message : 'Mock handler error')
      }
    }
    console.warn(`[mock] No handler for ${method} ${path} — falling through to real API`)
  }

  const url = `${API_BASE}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  const res = await fetch(url, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: options?.auth === 'cookie' ? 'include' : 'same-origin',
    signal: options?.signal,
  })

  if (!res.ok) {
    let serverMessage: string | undefined
    try {
      const errorBody = await res.json()
      serverMessage = errorBody.message ?? errorBody.error
    } catch {
      // Response body is not JSON
    }
    throw new ApiError(res.status, serverMessage)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export const httpGet = <T>(path: string, options?: IFetchOptions) =>
  baseFetch<T>('GET', path, options)

export const httpPost = <T>(path: string, options?: IFetchOptions) =>
  baseFetch<T>('POST', path, options)

export const httpPut = <T>(path: string, options?: IFetchOptions) =>
  baseFetch<T>('PUT', path, options)

export const httpPatch = <T>(path: string, options?: IFetchOptions) =>
  baseFetch<T>('PATCH', path, options)

export const httpDelete = <T>(path: string, options?: IFetchOptions) =>
  baseFetch<T>('DELETE', path, options)
