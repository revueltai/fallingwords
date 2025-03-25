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
    heading="Good Job"
    class="w-80"
  >
    <div class="flex flex-col gap-2 w-full">
      <p class="text-md text-primary-light">
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
