<script setup lang="ts">
import { onMounted } from 'vue'
import UiGameOverlayContent from './GameOverlayContent.vue'
import { useGameUIStore } from '@/stores/gameUI.store'
import { useGameStore } from '@/stores/game.store'

const gameStore = useGameStore()
const gameUIStore = useGameUIStore()

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

function handleGameResume () {
  gameStore.setGamePlaying()
  hideOverlay()
}

onMounted(() => showOverlay())
</script>

<template>
  <UiGameOverlayContent
    ref="pauseRef"
    heading="Game Paused"
  >
    <template #footerLeft>
      <Button
        iconOnly
        @click="handleGameCancelation"
      >
        <Icon
          name="home"
          size="lg"
        />
      </Button>
    </template>

    <template #footerCenter>
      <Button @click="handleGameResume">
        Resume
      </Button>
    </template>
  </UiGameOverlayContent>
</template>
