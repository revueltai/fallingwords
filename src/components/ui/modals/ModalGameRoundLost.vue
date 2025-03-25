<script setup lang="ts">
import ModalGameRoundEnd from '@/components/ui/modals/ModalGameRoundEnd.vue'
import { useGameStore } from '@/stores/game.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameUIStore = useGameUIStore()
const gameStore = useGameStore()

function hideOverlay() {
  gameUIStore.fadeOutOverlay()
}

function handleGameCancelation() {
  gameStore.setGameReset()
  hideOverlay()
  router.push('/')
}

function handleGameRetry() {
  const words = gameStore.gameWordsList
  const locales = gameStore.gameLocales

  gameStore.setGameReset()
  // gameStore.prepareGame({ words, locales })
}

onMounted(() => gameUIStore.fadeInGameModal())
</script>

<template>
  <ModalGameRoundEnd
    heading="Out of Lives!"
    result="lost"
    :has-close-button="false"
  >
    <img
      src="/images/game/gameLost.svg"
      class="w-40 h-40"
    >

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
      <Button @click="handleGameRetry">
        Restart
      </Button>
    </template>
  </ModalGameRoundEnd>
</template>
