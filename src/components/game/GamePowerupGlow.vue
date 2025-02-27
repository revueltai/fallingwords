<script setup lang="ts">
import { useGameStore } from '@/stores/game.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { computed, ref, watch } from 'vue'

const gameStore = useGameStore()
const gameUIStore = useGameUIStore()

const glowRef = ref<HTMLElement | null>(null)

const UIElementsHeight = computed(() => gameUIStore.elementsHeight)
const powerupType = computed(() => gameStore.roundActivePowerupType)
const cssStyle = computed(() => `--offset: ${UIElementsHeight.value?.header}px`)

function setClasses(powerupName: PowerupName) {
  glowRef.value?.classList.add(powerupName)
  setTimeout(() => glowRef.value?.classList.remove(powerupName), 400)
}

watch(powerupType, (newPowerupType) => {
  setClasses(newPowerupType as PowerupName)
})
</script>

<template>
  <div
    ref="glowRef"
    :style="cssStyle"
    class="absolute left-0 w-full pointer-events-none opacity-10 powerup-glow"
  />
</template>

<style scoped>
.powerup-glow {
  transition: box-shadow .2s ease-in-out;
  height: calc(100% - var(--offset));
}

.powerup-glow.fire {
  box-shadow: inset 0 0 60px var(--c-warning);
}

.powerup-glow.ice {
  box-shadow: inset 0 0 60px var(--c-primary);
}

.powerup-glow.wind {
  box-shadow: inset 0 0 60px var(--c-info);
}

.powerup-glow.life {
  box-shadow: inset 0 0 60px var(--c-success);
}
</style>
