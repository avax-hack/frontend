import { httpGet, httpPost, httpDelete, ApiError } from '@/lib/api'
import type { IAccountInfo } from '@/types/common'

export function postNonce(address: string) {
  return httpPost<{ nonce: string }>('/auth/nonce', {
    body: { address },
  })
}

export function postSession(params: {
  nonce: string
  signature: string
  chain_id: number
}) {
  return httpPost<{ account_info: IAccountInfo }>('/auth/session', {
    body: params,
    auth: 'cookie',
  })
}

export function deleteSession() {
  return httpDelete<void>('/auth/delete_session', {
    auth: 'cookie',
  })
}

export async function getAccount(): Promise<IAccountInfo | null> {
  try {
    return await httpGet<IAccountInfo>('/account/get_account', {
      auth: 'cookie',
    })
  } catch (error) {
    if (error instanceof ApiError && (error.isNotFound || error.isUnauthorized)) {
      return null
    }
    throw error
  }
}
