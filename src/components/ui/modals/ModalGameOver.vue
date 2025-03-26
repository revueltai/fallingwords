<script setup lang="ts">
import GameSummaryItem from '@/components/game/ui/GameSummaryItem.vue'
import ModalGameRoundEnd from '@/components/ui/modals/ModalGameRoundEnd.vue'
import { useGameStore } from '@/stores/game.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameUIStore = useGameUIStore()
const gameStore = useGameStore()

function handlePlayAgain() {
  gameStore.replayGame(gameStore.gameCollections)
}

function handleShowDashboard() {
  gameStore.setGameReset()
  gameUIStore.fadeOutOverlay()
  router.push('/')
}

onMounted(() => gameUIStore.fadeInGameModal())
</script>

<template>
  <ModalGameRoundEnd
    :has-close-button="false"
    heading="Game Complete"
    class="w-80"
  >
    <template #header>
      <div class="flex items-end justify-center w-full -mb-px">
        <div class="mx-4 bg-secondary border-secondary-light border border-b-0 rounded-t-full w-1/2 h-8">
          <img
            src="/images/game/gameWon.svg"
            width="160"
            height="160"
            class="block mx-auto -mt-20"
          >
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-2 w-full">
      <h3 class="text-xl text-tertiary-light uppercase font-black">
        Well Done!
      </h3>
      <p class="text-sm text-primary-light">
        You Mastered These Words
      </p>

      <div class="relative">
        <div class="absolute z-10 bottom-0 w-full h-10 bg-gradient-to-b from-transparent to-secondary via-secondary" />
        <div class="absolute z-10 top-0 w-full h-10 bg-gradient-to-b from-secondary to-transparent via-transparent" />

        <div class="grid gap-3 items-start auto-rows-min h-max anim-fade-in-timed max-h-72 overflow-y-auto pt-6 pb-10">
          <GameSummaryItem
            v-for="(word, index) in gameStore.gameWordsList"
            :key="index"
            :word="word"
            :summary="gameStore.gameSummary[index]"
          />
        </div>
      </div>
    </div>

    <template #footerLeft />

    <template #footerCenter>
      <Button
        background-color="quaternary"
        border-color="quaternary-light"
        icon-only
        @click="handleShowDashboard"
      >
        <Icon
          name="home"
          size="lg"
        />
      </Button>

      <Button
        background-color="tertiary"
        border-color="tertiary-light"
        @click="handlePlayAgain"
      >
        Play Again
      </Button>
    </template>
  </ModalGameRoundEnd>
</template>

<style scoped>
.star:nth-child(3) {
  @apply origin-bottom;
  transform: scale(1.2);
}
</style>
