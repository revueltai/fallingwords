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
    heading="Game Over"
    class="w-80"
  >
    <div class="flex flex-col gap-5 w-full">
      <p>
        <span class="block text-xl">Good Job!</span>
        <span class="text-sm text-primary-light">You Mastered</span>
      </p>

      <div class="relative max-h-96 overflow-y-auto">
        <div class="grid gap-3 items-start auto-rows-min h-max anim-fade-in-timed">
          <GameSummaryItem
            v-for="(word, index) in gameStore.gameWordsList"
            :key="index"
            :word="word"
            :summary="gameStore.gameSummary[index]"
          />
        </div>
      </div>
    </div>

    <template #footerLeft>
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
    </template>

    <template #footerCenter>
      <div class="flex flex-col gap-2">
        <Button
          background-color="tertiary"
          border-color="tertiary-light"
          @click="handlePlayAgain"
        >
          Play Again
        </Button>
      </div>
    </template>
  </ModalGameRoundEnd>
</template>

<style scoped>
.star:nth-child(3) {
  @apply origin-bottom;
  transform: scale(1.2);
}
</style>
