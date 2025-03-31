import mitt from 'mitt'

export const toastEmitter = mitt<{
  toast: { message: string, type: 'success' | 'error' | 'info' }
}>()
