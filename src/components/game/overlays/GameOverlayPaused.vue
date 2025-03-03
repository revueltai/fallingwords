<script setup lang="ts">
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GameOverlayContent from './GameOverlayContent.vue'

const router = useRouter()

const gameStore = useGameStore()
const gameRoundStore = useGameRoundStore()
const gameUIStore = useGameUIStore()

function hideOverlay() {
  gameUIStore.fadeOutOverlay()
}

function handleGameCancelation() {
  gameStore.setGameReset()
  hideOverlay()
  router.push('/')
}

function handleGameResume() {
  gameRoundStore.setRoundPlaying()
  hideOverlay()
}

onMounted(() => gameUIStore.fadeInOverlay())
</script>

<template>
  <GameOverlayContent
    heading="Game Paused"
    @close="handleGameResume"
  >
    <template #footerCenter>
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

      <Button @click="handleGameResume">
        Resume
      </Button>
    </template>
  </GameOverlayContent>
</template>
