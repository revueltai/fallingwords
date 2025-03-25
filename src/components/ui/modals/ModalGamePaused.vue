<script setup lang="ts">
import ModalGameContent from '@/components/ui/modals/ModalGameContent.vue'
import Settings from '@/components/ui/Settings.vue'
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

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
  gameRoundStore.resumeRound()
  hideOverlay()
}

onMounted(() => gameUIStore.fadeInGameModal())
</script>

<template>
  <ModalGameContent
    heading="Game Paused"
    @close="handleGameResume"
  >
    <Settings />

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
  </ModalGameContent>
</template>
