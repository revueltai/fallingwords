<script setup lang="ts">
import { useGameRoundStore } from '@/stores/gameRound.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { computed, ref, watch } from 'vue'

const gameRoundStore = useGameRoundStore()
const gameUIStore = useGameUIStore()

const glowRef = ref<RefElement>(null)

const cssStyle = computed(() => `--offset: ${gameUIStore.elementsHeight?.header}px`)

function setClasses(powerupName: PowerupName) {
  glowRef.value?.classList.add(powerupName)
  setTimeout(() => glowRef.value?.classList.remove(powerupName), 400)
}

watch(
  () => gameRoundStore.roundActivePowerupType,
  newPowerupType => setClasses(newPowerupType as PowerupName),
)
</script>

<template>
  <div
    ref="glowRef"
    :style="cssStyle"
    class="absolute left-0 w-full pointer-events-none opacity-40 powerup-glow"
  />
</template>

<style scoped>
.powerup-glow {
  transition: box-shadow .2s ease-in-out;
  height: calc(100% - var(--offset));
}

.powerup-glow.fire {
  box-shadow: inset 0 0 60px 20px var(--color-quinary-light);
}

.powerup-glow.ice {
  box-shadow: inset 0 0 60px 20px var(--color-primary);
}

.powerup-glow.wind {
  box-shadow: inset 0 0 60px 20px var(--color-senary);
}

.powerup-glow.life {
  box-shadow: inset 0 0 60px 20px var(--color-quaternary-light);
}
</style>
