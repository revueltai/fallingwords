<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useGameUIStore } from '@/stores/gameUI.store'
import { useGameStore } from '@/stores/game.store'
import { UI } from '@/configs/constants'
import UiGameOverlayContent from './GameOverlayContent.vue'

const gameUIStore = useGameUIStore()
const gameStore = useGameStore()

const overlayState = computed(() => gameUIStore.overlayState)

const roundTime = computed(() => gameStore.roundTotalTime)

const roundTimeLabel = computed(() => {
  const time = roundTime.value

  // if (time.minutes < 10) {
  //   time.minutes = Number('0' + time.minutes)
  // }

  // if (time.seconds < 10) {
  //   time.seconds = Number('0' + time.seconds)
  // }

  return `${time.minutes}:${time.seconds}`
})

const roundPercentage = computed(() => {
  const roundWordGuess = gameStore.roundWordGuess
  const secondsMultiplier = 4
  const rank = roundWordGuess.length * secondsMultiplier
  const totalTime = getRoundTimeInSeconds()
  return (rank / totalTime) * 100
})

const roundStars = computed(() => {
  const output = []
  output.push({ name: 'starFull' })

  if (roundPercentage.value > 50) {
    output.push({ name: 'starFull' })
  } else {
    output.push({ name: 'starEmpty' })
  }

  if (roundPercentage.value > 80) {
    output.push({ name: 'starFull' })
  } else {
    output.push({ name: 'starEmpty' })
  }

  return output
})

const expression = computed(() => {
  const baseUrl = '/images/character/'

  if (roundPercentage.value > 80) {
    return baseUrl + 'MouthLikeHeart.svg'
  }

  if (roundPercentage.value > 50) {
    return baseUrl + 'MouthLike.svg'
  }

  return baseUrl + 'MouthIdle.svg'
})

watch(overlayState, (newState) => {
  if (newState === UI.overlayStates.hidden) {
    gameStore.increaseRound()
    gameStore.prepareRound()
  }
})

function getRoundTimeInSeconds () {
  const { seconds, minutes } = roundTime.value
  return seconds + (minutes * 60)
}

function hideOverlay () {
  gameUIStore.setOverlayFadeOut()
}

function showOverlay () {
  gameUIStore.setOverlayFadeIn()
}

function handleGameCancelation () {
  gameStore.setGameReset()
  hideOverlay()
}

function handleGameIncreaseRound () {
  hideOverlay()
}

onMounted(() => showOverlay())
</script>

<template>
  <UiGameOverlayContent
    heading="Round Complete!"
  >
    <div class="absolute top-0 left-0 w-full stars">
      <div class="inline-flex gap-2">
        <Icon
          v-for="(star, index) in roundStars"
          :key="index"
          :name="star.name"
          size="2xl"
          class="star"
        />
      </div>
    </div>

    <div class="deco flex items-center justify-center bg-center bg-no-repeat mb-2">
      <img :src="expression">
    </div>

    <div>
      <span class="rounded-full bg-quinary text-center text-xl py-2 px-4 block mx-auto mb-2 time">{{ roundTimeLabel }}</span>
      <span class="text-s mt-2">TIME</span>
    </div>

    <template #footerLeft>
      <Button
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
        Continue
      </Button>
    </template>
  </UiGameOverlayContent>
</template>

<style scoped>
.deco {
  background-image: url('/images/ui/sunray.svg');
  background-size: 140px;
  height: 140px;
}

.time {
  width: 100px;
}

.stars {
  transform: translateY(-50%);
}

.star:nth-child(2) {
  @apply origin-bottom;
  transform: scale(1.2);
}
</style>
