<script setup lang="ts">
import GameOverlayRoundEnd from '@/components/game/overlays/GameOverlayRoundEnd.vue'
import { UI } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameUIStore = useGameUIStore()
const gameRoundStore = useGameRoundStore()
const gameStore = useGameStore()

const btnText = computed(() => {
  return gameStore.isGameOver
    ? 'Continue'
    : 'Next Round'
})

const roundTimeLabel = computed(() => {
  const { minutes, seconds } = gameRoundStore.roundTotalTime
  const output = [String(minutes), String(seconds)]

  if (minutes < 10) {
    output[0] = `0${minutes}`
  }

  if (seconds < 10) {
    output[1] = `0${seconds}`
  }

  return `${output[0]}:${output[1]}`
})

const roundStars = computed(() => {
  const roundPercentage = getRoundPercentage()
  return [
    'StarFull',
    roundPercentage > 50 ? 'StarFull' : 'StarEmpty',
    roundPercentage > 80 ? 'StarFull' : 'StarEmpty',
  ]
})

function getRoundPercentage() {
  const roundWordGuess = gameRoundStore.roundWordGuess
  const secondsMultiplier = 4
  const rank = roundWordGuess.length * secondsMultiplier

  const { seconds, minutes } = gameRoundStore.roundTotalTime
  const totalTime = seconds + (minutes * 60)

  return (rank / totalTime) * 100
}

function getStarSize(index: number) {
  return index === 2 ? 64 : 48
}

function hideOverlay() {
  gameUIStore.fadeOutOverlay()
}

function handleGameCancelation() {
  gameStore.setGameReset()
  hideOverlay()
  router.push('/')
}

function handleGameIncreaseRound() {
  hideOverlay()
}

watch(
  () => gameUIStore.overlayState,
  (newState) => {
    if (newState === UI.overlayStates.hidden) {
      gameStore.increaseGameRound()
      gameRoundStore.setRoundStart()
    }
  },
)

onMounted(() => gameUIStore.fadeInOverlay())
</script>

<template>
  <GameOverlayRoundEnd
    :has-close-button="false"
    heading="Round Complete!"
  >
    <template #header>
      <div class="flex items-end justify-center">
        <img
          v-for="(star, index) in roundStars"
          :id="`star${index}`"
          :key="index"
          :src="`/images/ui/gameWon${star}.svg`"
          class="star"
          :class="index === 1 ? 'order-3' : ''"
          :width="getStarSize(index)"
          :height="getStarSize(index)"
        >
      </div>
    </template>

    <div class="">
      <img
        src="/images/ui/gameWon.svg"
        width="160"
        height="160"
      >

      <span class="relative z-30 rounded-xl border border-senary-light shadow-sm bg-secondary-light text-center text-xl pt pb-1 px-2 block mx-auto -mt-12 mb-2 w-[120px]">
        <span class="block text-s mt-2 text-primary-light uppercase">Your time</span>
        {{ roundTimeLabel }}
      </span>
    </div>

    <template #footerLeft>
      <Button
        background-color="quaternary"
        border-color="quaternary-light"
        icon-only
        @click="handleGameCancelation"
      >
        <Icon
          name="home"
          size="lg"
        />
      </Button>
    </template>

    <template #footerCenter>
      <Button @click="handleGameIncreaseRound">
        {{ btnText }}
      </Button>
    </template>
  </GameOverlayRoundEnd>
</template>

<style scoped>
.star:nth-child(3) {
  @apply origin-bottom;
  transform: scale(1.2);
}
</style>
