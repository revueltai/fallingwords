<script setup lang="ts">
import { UI } from '@/configs/constants'
import { ToastService } from '@/services/ToastService'
import { useSoundStore } from '@/stores/sounds.store'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const soundStore = useSoundStore()
const { t } = useI18n()

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
    isVisible.value = true
    type.value = payload.type || 'info'
    message.value = payload.translateMessage
      ? t(payload.message)
      : payload.message

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

onMounted(() => ToastService.emitter.on('toast', showToast))

onUnmounted(() => {
  ToastService.emitter.off('toast', showToast)

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
