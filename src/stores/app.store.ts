import type { ShallowRef } from 'vue'
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useAppStore = defineStore('app', () => {
  const canvasMaxWidth = 600
  const canvasMaxHeight = 800
  const canvasEl: ShallowRef<ElementRef> = shallowRef(null)

  const setElement = (el: HTMLElement) => {
    canvasEl.value = el
  }

  return {
    canvasMaxWidth,
    canvasMaxHeight,
    canvasEl,
    setElement,
  }
})
