<script setup lang="ts">
interface Props {
  word: string
  countryCode: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-2 items-center">
    <Flag :country-code="countryCode" />

    <h3 class="text-white truncate max-w-28 text-sm sm:text-p md:max-w-none">
      {{ word }}
    </h3>
  </div>
</template>
