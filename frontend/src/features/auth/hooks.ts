'use client'

import { useCallback, useRef, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { postNonce, postSession, deleteSession, getAccount } from './services'
import { authKeys } from './query-keys'
import { ApiError } from '@/lib/api'
import { isUserRejection } from '@/lib/errors'
import type { IAccountInfo } from '@/types/common'

export function useProfile() {
  const { address, isConnected } = useAccount()
  const queryClient = useQueryClient()

  const { data: account, isLoading, isFetched } = useQuery({
    queryKey: authKeys.session(address),
    queryFn: () => getAccount(),
    enabled: isConnected && !!address,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const isAuthenticated = !!account
  const isSessionRestored = isFetched

  const setSession = useCallback(
    (accountInfo: IAccountInfo) => {
      queryClient.setQueryData(authKeys.session(address), accountInfo)
    },
    [queryClient, address],
  )

  const clearSession = useCallback(() => {
    queryClient.removeQueries({ queryKey: authKeys.all })
  }, [queryClient])

  return { account: account ?? null, isAuthenticated, isSessionRestored, isLoading, setSession, clearSession }
}

export function useAuth() {
  const { address, chainId } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { setSession, clearSession } = useProfile()
  const signingRef = useRef(false)
  const [isSigning, setIsSigning] = useState(false)

  const login = useCallback(async (): Promise<boolean> => {
    if (!address || !chainId || signingRef.current) return false

    signingRef.current = true
    setIsSigning(true)
    try {
      const { nonce } = await postNonce(address)
      const signature = await signMessageAsync({ message: nonce })
      const result = await postSession({
        nonce,
        signature,
        chain_id: chainId,
      })
      setSession(result.account_info)

      toast.success('Wallet authenticated')
      return true
    } catch (error: unknown) {
      if (isUserRejection(error)) {
        toast.error('Signature rejected', {
          description: 'Please sign the message to authenticate.',
        })
      } else if (error instanceof ApiError) {
        toast.error('Authentication failed', {
          description: 'Network error. Please try again.',
        })
      } else {
        toast.error('Authentication failed')
      }
      clearSession()
      return false
    } finally {
      signingRef.current = false
      setIsSigning(false)
    }
  }, [address, chainId, signMessageAsync, setSession, clearSession])

  const logout = useCallback(async () => {
    try {
      await deleteSession()
    } catch {
      // Ignore logout API errors
    }
    clearSession()
    toast.success('Signed out')
  }, [clearSession])

  return { login, logout, isSigning }
}
