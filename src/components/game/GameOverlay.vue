<script setup lang="ts">
import GameOverlayInitCount from '@/components/game/GameOverlayInitCount.vue'
import GameOverlayPause from '@/components/game/GameOverlayPause.vue'
import GameOverlayRoundLost from '@/components/game/GameOverlayRoundLost.vue'
import GameOverlayRoundWon from '@/components/game/GameOverlayRoundWon.vue'
import { UI } from '@/configs/constants'
import { useGameUIStore } from '@/stores/gameUI.store'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const store = useGameUIStore()

const overlayComponentMap = {
  countdown: GameOverlayInitCount,
  pause: GameOverlayPause,
  roundwon: GameOverlayRoundWon,
  roundlost: GameOverlayRoundLost,
}

const gameOverlayRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const animationName = {
  start: 'fadeIn',
  end: 'fadeOut',
}
const animationClasses = {
  in: UI.animationClasses.fadeIn,
  out: UI.animationClasses.fadeOut,
}

const overlayState = computed(() => store.overlayState)
const overlayComponent = computed(() => (overlayComponentMap as any)[store.overlayComponent as OverlayComponentMapKey] || null)

watch(overlayState, (newState) => {
  const { fadeIn, fadeOut } = UI.overlayStates

  switch (newState) {
    case fadeIn:
      visible.value = true
      gameOverlayRef.value?.classList.add(animationClasses.in)
      break

    case fadeOut:
      gameOverlayRef.value?.classList.add(animationClasses.out)
      break
  }
})

function handleAnimationEnd(event: AnimationEvent) {
  event.stopPropagation()
  gameOverlayRef.value?.classList.remove(animationClasses.in, animationClasses.out)

  if (event.animationName === animationName.end) {
    visible.value = false
    store.setOverlayHidden()
  }
}

onMounted(() => gameOverlayRef.value?.addEventListener('animationend', handleAnimationEnd))

onBeforeUnmount(() => {
  if (gameOverlayRef.value) {
    gameOverlayRef.value.removeEventListener('animationend', handleAnimationEnd)
  }
})
</script>

<template>
  <section
    v-show="visible"
    ref="gameOverlayRef"
    class="w-full h-full absolute left-0 top-0"
  >
    <div class="relative w-full h-full">
      <div class="z-0 absolute w-full h-full bg-secondary opacity-70 left-0 top-0" />
      <div class="z-30 flex items-center justify-center relative w-full h-full">
        <Component :is="overlayComponent" />
      </div>
    </div>
  </section>
</template>
