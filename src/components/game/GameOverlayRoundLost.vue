<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameUIStore } from '@/stores/gameUI.store'
import { useGameStore } from '@/stores/game.store'
import UiGameOverlayContent from '@/components/game/GameOverlayContent.vue'

const gameUIStore = useGameUIStore()
const gameStore = useGameStore()

function hideOverlay() {
  gameUIStore.setOverlayFadeOut()
}

function showOverlay() {
  gameUIStore.setOverlayFadeIn()
}

function handleGameCancelation() {
  gameStore.setGameReset()
  hideOverlay()
}

function handleGameRetry() {
  alert('not coded yet')
}

onMounted(() => showOverlay())
</script>

<template>
  <UiGameOverlayContent heading="Out of Lifes!">
    <div class="flex items-center justify-center bg-center bg-no-repeat mb-2">
      <img src="/images/character/MouthDislike.svg">
    </div>

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
      <Button @click="handleGameRetry">
        Retry
      </Button>
    </template>
  </UiGameOverlayContent>
</template>
