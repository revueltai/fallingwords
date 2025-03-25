<script setup lang="ts">
import ModalGameInitCountdown from '@/components/ui/modals/ModalGameInitCountdown.vue'
import ModalGameOver from '@/components/ui/modals/ModalGameOver.vue'
import ModalGamePaused from '@/components/ui/modals/ModalGamePaused.vue'
import ModalGameRoundLost from '@/components/ui/modals/ModalGameRoundLost.vue'
import ModalGameRoundWon from '@/components/ui/modals/ModalGameRoundWon.vue'
import { UI } from '@/configs/constants'
import { useGameUIStore } from '@/stores/gameUI.store'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const gameUIStore = useGameUIStore()

const modalComponentMap = {
  countdown: ModalGameInitCountdown,
  paused: ModalGamePaused,
  roundwon: ModalGameRoundWon,
  roundlost: ModalGameRoundLost,
  gameover: ModalGameOver,
}

const gameOverlayRef = ref<ElementRef>(null)
const visible = ref(false)
const animationName = {
  start: 'fadeIn',
  end: 'fadeOut',
}
const animationClasses = {
  in: UI.animationClasses.timed.fadeIn,
  out: UI.animationClasses.timed.fadeOut,
}

const modalComponent = computed(() => {
  return (modalComponentMap as any)[gameUIStore.modalComponent as GameModalComponentMapKey] || null
})

watch(
  () => gameUIStore.modalState,
  (newState) => {
    const { fadeIn, fadeOut } = UI.modalStates

    switch (newState) {
      case fadeIn:
        visible.value = true
        gameOverlayRef.value?.classList.add(animationClasses.in)
        break

      case fadeOut:
        gameOverlayRef.value?.classList.add(animationClasses.out)
        break
    }
  },
)

function handleAnimationEnd(event: AnimationEvent) {
  event.stopPropagation()
  gameOverlayRef.value?.classList.remove(animationClasses.in, animationClasses.out)

  if (event.animationName === animationName.end) {
    visible.value = false
    gameUIStore.hideOverlay()
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
      <div class="z-0 absolute w-full h-full bg-secondary-dark opacity-70 left-0 top-0" />
      <div class="z-30 flex items-center justify-center relative w-full h-full">
        <Component :is="modalComponent" />
      </div>
    </div>
  </section>
</template>
