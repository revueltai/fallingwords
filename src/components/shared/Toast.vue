<script setup lang="ts">
import { UI } from '@/configs/constants'
import { useSoundStore } from '@/stores/sounds.store'
import { toastEmitter } from '@/utils/ToastEmitter'
import { computed, onMounted, onUnmounted, ref } from 'vue'

type ToastType = 'info' | 'error' | 'success'

interface ToastPayload {
  message: string
  type: ToastType
}

const soundStore = useSoundStore()

const toastRef = ref<RefElement>(null)
const message = ref('')
const type = ref<ToastType>('info')
const isVisible = ref(false)

const cssClasses = computed(() => {
  return {
    'border-primary-light bg-primary': type.value === 'info',
    'border-tertiary-light bg-tertiary': type.value === 'success',
    'border-quaternary-light bg-quaternary': type.value === 'error',
  }
})

function handleAnimationEnd(event: AnimationEvent) {
  event.stopPropagation()

  const targetEl = event.target as HTMLElement
  targetEl.classList.remove(UI.animationClasses.timed.slideInOutTop)
  isVisible.value = false
  message.value = ''
}

function showToast(payload: ToastPayload) {
  if (!isVisible.value) {
    message.value = payload.message
    type.value = payload.type || 'info'
    isVisible.value = true

    if (toastRef.value) {
      toastRef.value.addEventListener('animationend', handleAnimationEnd)
      toastRef.value.classList.add(UI.animationClasses.timed.slideInOutTop)

      soundStore.playSoundEffect(type.value === 'error'
        ? 'notificationError'
        : 'notificationSuccess',
      )
    }
  }
}

onMounted(() => toastEmitter.on('toast', showToast))

onUnmounted(() => {
  toastEmitter.off('toast', showToast)

  if (toastRef.value) {
    toastRef.value.removeEventListener('animationend', handleAnimationEnd)
  }
})
</script>

<template>
  <div
    v-show="isVisible"
    ref="toastRef"
    class="absolute top-0 left-0 w-full z-50 px-4 overflow-hidden"
  >
    <div
      class="min-w-40 border-2 border-t-0 text-center shadow-lg top-0 p-4 rounded-b-2xl text-white text-sm sm:text-md"
      :class="cssClasses"
    >
      {{ message }}
    </div>
  </div>
</template>
