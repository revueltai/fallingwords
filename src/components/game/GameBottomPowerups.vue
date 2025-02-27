<script setup lang="ts">
import { UI } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { isMobile } from '@/utils'
import { computed, onBeforeUnmount, onMounted } from 'vue'

interface PowerupButton {
  id: PowerupName
  asset: string
  count: number
  keyboardKey: string
}

const store = useGameStore()

const keyboardKeys = ['1', '2', '3']

const isPlaying = computed(() => store.roundIsPlaying)
const activePowerupType = computed(() => store.roundActivePowerupType)
const isActive = computed(() => !!activePowerupType.value)

const powerupButtons = computed(() => {
  const output: PowerupButton[] = []

  if (store.matchPowerups) {
    const powerups = store.powerups
    let count: number = 0

    for (const [key, value] of Object.entries(store.matchPowerups)) {
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
    ? UI.animationClasses.highlight
    : ''
}

function isActivePowerup(id: PowerupName): boolean {
  return isActive.value && id === activePowerupType.value
}

function hasPowerups(count: number): string {
  return count > 0
    ? 'opacity-100'
    : 'opacity-50'
}

function activatePowerup(type: PowerupName) {
  if (!isActive.value && isPlaying.value) {
    store.activatePowerup(type)
  }
}

function handleKeydown(event: KeyboardEvent) {
  for (const powerup of powerupButtons.value) {
    if (event.key === powerup.keyboardKey) {
      activatePowerup(powerup.id as PowerupName)
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
      :disabled="isActive"
      :has-background="false"
      :class="hasPowerups(powerupButton.count)"
      class="relative -mt-6 transition-opacity"
      icon-only
      @click="activatePowerup(powerupButton.id)"
    >
      <Icon
        :name="powerupButton.asset"
        :class="getPowerupClasses(powerupButton.id)"
        size="3xl"
        type="fill"
      />

      <Badge
        :value="powerupButton.count"
        class="absolute z-0 bottom-2 right-2"
      />

      <div
        v-if="!isMobile()"
        class="absolute bottom-3 left-1.5 w-4 h-4 bg-secondary border border-quinary rounded flex items-center justify-center ui-footer__powerup-key "
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
