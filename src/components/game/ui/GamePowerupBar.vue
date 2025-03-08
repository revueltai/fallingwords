<script setup lang="ts">
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const gameStore = useGameStore()
const gameRoundStore = useGameRoundStore()

const barAnimation = 'anim-powerupCooldown'

const barRef = ref<ElementRef>(null)

const cssStyles = computed(() => `animation-duration: ${gameStore.gamePowerupsDuration}ms;`)

const powerupAsset = computed(() => gameRoundStore.powerups[gameRoundStore.roundActivePowerupType!].asset)

const cssClasses = computed(() => {
  const { fire, ice, wind } = gameRoundStore.powerups
  let color = null

  switch (gameRoundStore.roundActivePowerupType) {
    case fire.id:
      color = 'quinary'
      break

    case ice.id:
      color = 'primary'
      break

    case wind.id:
      color = 'senary'
      break
  }

  return `bg-${color}`
})

function activatePowerupBar() {
  nextTick(() => {
    barRef.value?.classList.add(barAnimation)
    barRef.value?.addEventListener('animationend', handleAnimationEnd)
  })
}

function handleAnimationEnd() {
  barRef.value?.classList.remove(barAnimation)
  gameRoundStore.deactivatePowerup()
}

watch(
  () => gameRoundStore.roundIsPaused,
  (isPaused) => {
    if (isPaused) {
      barRef.value?.classList.add('paused')
    } else {
      barRef.value?.classList.remove('paused')
    }
  },
)

watch(
  () => gameRoundStore.roundHasActivePowerup,
  (newVal) => {
    if (newVal) {
      activatePowerupBar()
    }
  },
)

onBeforeUnmount (() => barRef.value?.removeEventListener('animationend', handleAnimationEnd))
</script>

<template>
  <div
    v-if="gameRoundStore.roundHasActivePowerup"
    class="absolute flex items-center top-28 left-3"
  >
    <div
      :class="cssClasses"
      class="z-10 border-secondary-light flex items-center justify-center rounded-full w-8 h-8"
    >
      <Icon
        :name="powerupAsset"
        size="md"
        type="fill"
      />
    </div>

    <div class="-ml-2 relative rounded-tr-full rounded-br-full w-16 h-4 border border-secondary-light bg-secondary-dark">
      <div
        ref="barRef"
        :class="cssClasses"
        :style="cssStyles"
        class="rounded-tr-full rounded-br-full w-full h-full"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes powerupCooldown {
  0% {
    width: 100%;
  }

  100% {
    width: 0;
  }
}

.paused {
  animation-play-state: paused;
}

.anim-powerupCooldown {
  animation-name: powerupCooldown;
  animation-timing-function: ease-out;
  animation-direction: forwards;
}
</style>
