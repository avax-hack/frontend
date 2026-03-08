'use client'

import { useCallback, useRef, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { postNonce, postSession, deleteSession, getAccount } from './services'
import { authKeys } from './query-keys'
import { ApiError } from '@/lib/api'
import { isUserRejection } from '@/lib/errors'

export function useAuth() {
  const { address, chainId } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const queryClient = useQueryClient()
  const { account, isAuthenticated, setAccount, clearAccount } = useAuthStore()
  const signingRef = useRef(false) // loop prevention guard
  const [isSigning, setIsSigning] = useState(false)

  const login = useCallback(async (): Promise<boolean> => {
    if (!address || !chainId || signingRef.current) return false

    signingRef.current = true
    setIsSigning(true)
    try {
      // 1. Get nonce
      const { nonce } = await postNonce(address)

      // 2. Sign message
      const signature = await signMessageAsync({ message: nonce })

      // 3. Create session
      const result = await postSession({
        nonce,
        signature,
        chain_id: chainId,
      })
      setAccount(result.account_info)

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
      clearAccount()
      return false
    } finally {
      signingRef.current = false
      setIsSigning(false)
    }
  }, [address, chainId, signMessageAsync, setAccount, clearAccount])

  const logout = useCallback(async () => {
    try {
      await deleteSession()
    } catch {
      // Ignore logout API errors
    }
    clearAccount()
    queryClient.removeQueries({ queryKey: authKeys.all })
    toast.success('Signed out')
  }, [clearAccount, queryClient])

  const restoreSession = useCallback(async () => {
    try {
      const accountInfo = await getAccount()
      if (accountInfo) {
        setAccount(accountInfo)
      } else {
        clearAccount()
      }
    } catch {
      clearAccount()
    }
  }, [setAccount, clearAccount])

  return {
    account,
    isAuthenticated,
    login,
    logout,
    restoreSession,
    isSigning,
  }
}
