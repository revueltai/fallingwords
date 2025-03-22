<script setup lang="ts">
interface Props {
  word: string
  countryCode: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-2">
    <Flag :country-code="countryCode" />

    <h3 class="text-white text-p truncate max-w-28 md:max-w-none">
      {{ word }}
    </h3>
  </div>
</template>
