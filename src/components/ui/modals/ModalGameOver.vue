<script setup lang="ts">
import GameResultsItem from '@/components/game/ui/GameResultsItem.vue'
import ModalGameRoundEnd from '@/components/ui/modals/ModalGameRoundEnd.vue'
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameUIStore = useGameUIStore()
const gameRoundStore = useGameRoundStore()
const gameStore = useGameStore()

function handlePlayAgain() {
  router.push('/gameResults')
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
        <span class="block text-md">Good Job!</span>
        <span class="text-sm text-primary-light">You Mastered</span>
      </p>

      <div class="relative max-h-80 overflow-y-auto">
        <div class="grid gap-3 items-start auto-rows-min h-max anim-fade-in-timed">
          {{ gameRoundStore.roundWordsList }}
          <GameResultsItem
            v-for="(word, index) in gameRoundStore.roundWordsList"
            :key="index"
            :word="word"
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
