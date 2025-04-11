<script setup lang="ts">
interface Props {
  percentage: number
}

defineProps<Props>()
</script>

<template>
  <div class="w-full bg-secondary rounded-full h-3">
    <div
      class="bg-tertiary h-full rounded-full transition-all"
      :style="`width: ${percentage}%`"
    />
  </div>
</template>
