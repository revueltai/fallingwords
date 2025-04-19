<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { onMounted, onUnmounted, ref } from 'vue'

const userStore = useUserStore()

const timeRemaining = ref('')
let countdownInterval: NodeJS.Timeout | null = null

function updateCountdown() {
  if (!userStore.lastLifeAddedAt) {
    return
  }

  const timeNow = Date.now()
  const lastAddedAt = userStore.lastLifeAddedAt || timeNow
  const timeElapsed = timeNow - lastAddedAt
  const remainingTime = 30 * 60 * 1000 - timeElapsed

  if (remainingTime > 0) {
    const minutes = Math.floor(remainingTime / (60 * 1000))
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000)
    timeRemaining.value = `${minutes}m ${seconds}s`
  } else {
    timeRemaining.value = '0m 0s'
  }
}

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<template>
  <p
    v-if="userStore.lastLifeAddedAt"
    class="mt-4 p-3 border-secondary-light border bg-secondary-dark rounded-full"
  >
    {{ $t('nextLifeIn') }}:
    <span class="inline-block ml-2 text-senary-light">
      {{ timeRemaining }}
    </span>
  </p>
</template>
