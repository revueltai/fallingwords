import mitt from 'mitt'

type ToastType = 'success' | 'error' | 'info'

export const toastEmitter = mitt<{ toast: { message: string, type: ToastType } }>()

export function emitToast(message: string, type: ToastType) {
  toastEmitter.emit('toast', { type, message })
}
