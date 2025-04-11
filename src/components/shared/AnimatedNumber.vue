<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ value: number, duration?: number }>()
const animated = ref(props.value)

watch(() => props.value, (newVal, oldVal) => {
  const start = performance.now()
  const diff = newVal - oldVal
  const dur = props.duration ?? 2000

  const animate = (now: number) => {
    const progress = Math.min((now - start) / dur, 1)
    animated.value = Math.round(oldVal + diff * progress)
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
})
</script>

<template>
  <span>{{ animated }}</span>
</template>
