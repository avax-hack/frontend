/** Check if an error is a wallet user rejection (EIP-1193 error code 4001) */
export function isUserRejection(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as Record<string, unknown>).code === 'number' &&
    (error as Record<string, unknown>).code === 4001
  )
}
