<script setup lang="ts">
import { UI } from '@/configs/constants'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const gameRoundStore = useGameRoundStore()
const gameUIStore = useGameUIStore()

const countdownInterval = 1000
const countdown = ref(3)
const counterRef = ref<ElementRef>(null)

function hideOverlay() {
  gameUIStore.fadeOutOverlay()
  gameRoundStore.startRound()
}

function handleAnimationEnd(event: AnimationEvent) {
  event.stopPropagation()

  if (event.animationName === 'scaleIn') {
    (event.target as HTMLElement).classList.remove(UI.animationClasses.timed.scaleIn)
  }
}

onMounted(() => {
  gameUIStore.fadeInOverlay()

  const intervalId = setInterval(() => {
    if (countdown.value <= 1) {
      countdown.value = 0
      clearInterval(intervalId)
      hideOverlay()
      return
    }

    countdown.value--
    counterRef.value?.classList.add(UI.animationClasses.timed.scaleIn)
    counterRef.value?.addEventListener('animationend', handleAnimationEnd)
  }, countdownInterval)
})

onBeforeUnmount(() => {
  if (counterRef.value) {
    counterRef.value?.removeEventListener('animationend', handleAnimationEnd)
  }
})
</script>

<template>
  <div
    v-if="countdown"
    ref="counterRef"
    class="flex items-center justify-center bg-secondary-light border border-senary rounded-full w-24 h-24 p-3"
  >
    <div class="flex items-center justify-center bg-white border border-white shadow-lg text-black text-center text-4xl font-bold rounded-full w-full h-full">
      {{ countdown }}
    </div>
  </div>
</template>
