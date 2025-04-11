import { ToastService } from '@/services/ToastService'

interface ErrorServiceParams {
  shouldThrow?: boolean
  showToast?: boolean
  msg?: string
}

interface ErrorServiceSchema {
  handleError: (params: {
    msg?: string
    showToast?: boolean
    shouldThrow?: boolean
  }) => false
}

/**
 * Handle errors in a consistent way across the app files (vue, pinia).
 * Do not use in service or other files.
 *
 * @returns {{
 *   handleError: (params: {
 *     msg?: string,
 *     showToast?: boolean,
 *     shouldThrow?: boolean
 *   }) => false
 * }}
 */
export function useErrorService(): ErrorServiceSchema {
  /**
   * Handles an error by throwing it, showing a toast, or logging it, based on options.
   *
   * @param {ErrorServiceParams} params
   * @param {string} [params.msg] - The error message key or plain message.
   * @param {boolean} [params.showToast] - Whether to show the error as a toast.
   * @param {boolean} [params.shouldThrow] - Whether to throw the error.
   * @returns {false} Always returns false to allow graceful fallback.
   */
  function handleError({
    msg = '',
    showToast = false,
    shouldThrow = true,
  }: ErrorServiceParams): false {
    const message = msg || 'unknownError'
    const error = new Error(message)

    if (msg && showToast) {
      ToastService.emitToast(message, 'error', true)
      console.warn(error)
      return false
    }

    if (shouldThrow) {
      throw error
    }

    console.error(error)
    return false
  }

  return { handleError }
}
