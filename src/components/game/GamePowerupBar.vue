<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useGameStore } from '@/stores/game.store'

const store = useGameStore()

const barAnimation = 'a__powerup-cooldown'

const barRef = ref<HTMLElement | null>(null)

const isActive = computed(() => store.roundHasActivePowerup)
const powerupType = computed(() => store.roundActivePowerupType)
const duration = computed(() => store.matchPowerupsDuration)
const cssStyle = computed(() => `animation-duration: ${duration.value}ms;`)

const powerupAsset = computed(() => {
  if (powerupType.value) {
    store.powerups[powerupType.value].asset
  }
})

const cssClass = computed(() => {
  const { fire, ice, wind } = store.powerups
  let color = null

  switch (powerupType.value) {
    case fire.id:
      color = 'warning'
      break

    case ice.id:
      color = 'primary'
      break

    case wind.id:
      color = 'quinary'
      break
  }

  return `bg-${color}`
})

function activatePowerupBar () {
  nextTick(() => {
    barRef.value?.classList.add(barAnimation)
    barRef.value?.addEventListener('animationend', handleAnimationEnd)
  })
}

function deactivatePowerup () {
  store.deactivatePowerup()
}

function handleAnimationEnd () {
  barRef.value?.classList.remove(barAnimation)
  deactivatePowerup()
}

watch(isActive, (newVal) => {
  if (newVal) {
    activatePowerupBar()
  }
})

onBeforeUnmount (() => barRef.value?.removeEventListener('animationend', handleAnimationEnd))
</script>

<template>
  <div
    v-if="isActive"
    class="absolute flex items-center top-112 left-12"
  >
    <div
      :class="cssClass"
      class=" z-10 border-quinary flex items-center justify-center rounded-full w-32 h-32"
    >
      <Icon
        :name="powerupAsset"
        size="md"
        type="fill"
      />
    </div>

    <div class="-ml-2 relative rounded-tr-full rounded-br-full w-48 h-4">
      <div
        ref="barRef"
        :class="cssClass"
        :style="cssStyle"
        class="rounded-tr-full rounded-br-full w-full h-full"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes powerupCooldown {
  0% {
    width: 100%;
  }

  100% {
    width: 0;
  }
}

.a__powerup-cooldown {
  animation-name: powerupCooldown;
  animation-timing-function: ease-out;
  animation-direction: forwards;
}
</style>
