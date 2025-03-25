<script setup lang="ts">
interface Props {
  word: GameWord
}

defineProps<Props>()
</script>

<template>
  <div class="relative overflow-hidden cursor-pointer rounded-2xl p-4 border border-secondary-light transition-colors flex items-center w-full">
    <div class="flex justify-center gap-2">
      <Flag :country-code="word.locales?.original" />
      {{ word.original }}
    </div>

    <div class="flex justify-center gap-2">
      <Flag :country-code="word.locales?.learn" />
      {{ word.learn }}
    </div>
  </div>
</template>
