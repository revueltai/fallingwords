<script setup lang="ts">
import { UI } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useSoundStore } from '@/stores/sounds.store'
import { isMobile } from '@/utils'
import { computed, onBeforeUnmount, onMounted } from 'vue'

interface PowerupButton {
  id: PowerupName
  asset: string
  count: number
  keyboardKey: string
}

const soundStore = useSoundStore()
const gameStore = useGameStore()
const gameRoundstore = useGameRoundStore()

const keyboardKeys = ['1', '2', '3']

const isActive = computed(() => !!gameRoundstore.roundActivePowerupType)

const powerupButtons = computed(() => {
  const output: PowerupButton[] = []

  if (gameStore.gamePowerups) {
    const powerups = gameRoundstore.powerups
    let count: number = 0

    for (const [key, value] of Object.entries(gameStore.gamePowerups)) {
      if (key !== powerups.life.id) {
        output.push({
          id: key as PowerupName,
          asset: `powerup-${key}`,
          count: value as number,
          keyboardKey: keyboardKeys[count],
        })

        count++
      }
    }
  }

  return output
})

function getPowerupClasses(id: string) {
  return isActivePowerup(id as PowerupName)
    ? UI.animationClasses.timed.highlight
    : ''
}

function isActivePowerup(id: PowerupName): boolean {
  return isActive.value && id === gameRoundstore.roundActivePowerupType
}

function hasPowerup(count: number): string {
  return count > 0
    ? 'opacity-100'
    : 'opacity-50'
}

function activatePowerup(powerupButton: PowerupButton) {
  if (
    !isActive.value
    && gameRoundstore.roundIsPlaying
    && powerupButton.count
  ) {
    soundStore.playSoundEffect(powerupButton.id as GameSoundName)
    gameRoundstore.activatePowerup(powerupButton.id)
  }
}

function handleKeydown(event: KeyboardEvent) {
  for (const powerup of powerupButtons.value) {
    if (event.key === powerup.keyboardKey) {
      activatePowerup(powerup)
    }
  }
}

onMounted(() => {
  if (!isMobile()) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (!isMobile()) {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="block">
    <Button
      v-for="powerupButton in powerupButtons"
      :key="powerupButton.id"
      :disabled="isActive || !powerupButton.count"
      :has-background="false"
      :class="hasPowerup(powerupButton.count)"
      class="relative -mt-6 transition-opacity"
      icon-only
      @click="activatePowerup(powerupButton)"
    >
      <Icon
        :name="powerupButton.asset"
        :class="getPowerupClasses(powerupButton.id)"
        :size="isMobile() ? 'xl' : '3xl'"
        type="fill"
      />

      <Badge
        :value="powerupButton.count"
        :size="isMobile() ? 'sm' : 'md'"
        class="absolute z-0 bottom-2 right-2"
      />

      <div
        v-if="!isMobile()"
        class="absolute bottom-3 left-1.5 w-4 h-4 bg-secondary-dark border border-secondary-light rounded flex items-center justify-center ui-footer__powerup-key"
      >
        {{ powerupButton.keyboardKey }}
      </div>
    </Button>
  </div>
</template>

<style scoped>
@keyframes highlight {
  0%, 28%, 70% {
    transform: scale(1);
  }

  14%, 42% {
    transform: scale(1.3);
  }
}

.ui-footer__powerup-key {
  font-size: 8px;
  line-height: normal;
}

.anim-highlight {
  animation: highlight .5s ease-in-out both;
}
</style>
