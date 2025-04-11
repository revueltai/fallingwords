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

onMounted(() => gameUIStore.fadeInGameModal())
</script>

<template>
  <ModalGameRoundEnd
    :heading="$t('outOfLives')"
    result="lost"
    :has-close-button="false"
  >
    <div>
      <img
        src="/images/game/gameLost.svg"
        class="w-40 h-40"
      >
    </div>

    <template #footerCenter>
      <Button
        size="md"
        has-icon
        @click="handleGameCancelation"
      >
        <Icon
          name="home"
          type="both"
          size="md"
        />

        {{ $t('goBackToHome') }}
      </Button>
    </template>
  </ModalGameRoundEnd>
</template>
