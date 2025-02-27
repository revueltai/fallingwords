<script setup lang="ts">
import { UI } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const gameStore = useGameStore()
const gameUIStore = useGameUIStore()

const countdown = ref(3)
const counterRef = ref<HTMLElement | null>(null)

function hideOverlay() {
  gameUIStore.setOverlayFadeOut()
  gameStore.initRound()
}

function showOverlay() {
  gameUIStore.setOverlayFadeIn()

  const intervalId = setInterval(() => {
    if (countdown.value <= 1) {
      countdown.value = 0
      clearInterval(intervalId)
      hideOverlay()
      return
    }

    countdown.value--
    counterRef.value?.classList.add(UI.animationClasses.scaleIn)
    counterRef.value?.addEventListener('animationend', handleAnimationEnd)
  }, 1000)
}

function handleAnimationEnd(event: AnimationEvent) {
  event.stopPropagation()

  if (event.animationName === 'scaleIn') {
    (event.target as HTMLElement).classList.remove(UI.animationClasses.scaleIn)
  }
}

onMounted(() => showOverlay())

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
    class="flex items-center justify-center bg-quinary border border-info rounded-full w-24 h-24 p-3"
  >
    <div class="flex items-center justify-center bg-quaternary border border-white shadow-lg text-black text-center text-4xl font-bold rounded-full w-full h-full">
      {{ countdown }}
    </div>
  </div>
</template>
