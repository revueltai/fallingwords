<script setup lang="ts">
interface Props {
  heading: string
  subheading?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-1 sm:gap-2">
    <h2 class="text-white text-lg sm:text-2xl">
      {{ heading }}
    </h2>

    <p
      v-if="subheading"
      class="text-primary text-xs sm:text-sm"
    >
      {{ subheading }}
    </p>
  </div>
</template>
