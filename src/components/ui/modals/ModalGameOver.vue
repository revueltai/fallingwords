<script setup lang="ts">
import ModalGameRoundEnd from '@/components/ui/modals/ModalGameRoundEnd.vue'
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
      gameRoundStore.prepareRound()
    }
  },
)

onMounted(() => gameUIStore.fadeInOverlay())
</script>

<template>
  <ModalGameRoundEnd
    :has-close-button="false"
    heading="Game Over!"
  >
    asdasd
  </ModalGameRoundEnd>
</template>

<style scoped>
.star:nth-child(3) {
  @apply origin-bottom;
  transform: scale(1.2);
}
</style>
