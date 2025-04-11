<script setup lang="ts">
import ModalGameRoundEnd from '@/components/ui/modals/ModalGameRoundEnd.vue'
import { UI } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { getRoundStars, isMobile } from '@/utils'
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameUIStore = useGameUIStore()
const gameRoundStore = useGameRoundStore()
const gameStore = useGameStore()

const roundStars = computed(() => getRoundStars(gameRoundStore.roundScorePercentage))

function getStarSize(index: number) {
  return index === 2 ? 64 : 48
}

function hideOverlay() {
  gameUIStore.fadeOutOverlay()
}

function handleGameCancelation() {
  gameStore.setGameReset()
  hideOverlay()
  router.push('/')
}

function handleGameIncreaseRound() {
  hideOverlay()
}

watch(
  () => gameUIStore.modalState,
  (newState) => {
    if (newState === UI.modalStates.hidden) {
      gameStore.increaseGameRound()
      gameRoundStore.prepareRound()
    }
  },
)

onMounted(() => gameUIStore.fadeInGameModal())
</script>

<template>
  <ModalGameRoundEnd
    :has-close-button="false"
    :heading="$t('roundComplete')"
  >
    <template #header>
      <div class="flex items-end justify-center w-full -mb-6 stars">
        <img
          v-for="(star, index) in roundStars"
          :id="`star${index}`"
          :key="index"
          :src="`/images/game/gameWon${star}.svg`"
          class="star"
          :class="index === 1 ? 'order-3' : ''"
          :width="getStarSize(index)"
          :height="getStarSize(index)"
        >
      </div>
    </template>

    <div>
      <img
        src="/images/game/gameWon.svg"
        width="160"
        height="160"
      >

      <span class="relative z-30 rounded-xl border border-senary-light shadow-sm bg-secondary-light text-center text-xl pt pb-1 px-2 block mx-auto -mt-12 mb-2 w-[120px]">
        <span class="block text-sm mt-2 text-primary-light uppercase">{{ $t('yourTime') }}</span>
        {{ gameRoundStore.roundTotalTime }}
      </span>
    </div>

    <template #footerLeft>
      <Button
        background-color="quaternary"
        border-color="quaternary-light"
        icon-only
        @click="handleGameCancelation"
      >
        <Icon
          name="home"
          type="both"
          :size="isMobile() ? 'md' : 'lg'"
        />
      </Button>
    </template>

    <template #footerCenter>
      <Button @click="handleGameIncreaseRound">
        {{ $t('nextRound') }}
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
