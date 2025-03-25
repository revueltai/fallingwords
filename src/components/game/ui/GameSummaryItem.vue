<script setup lang="ts">
interface Props {
  word: GameWord
  summary: GameSummaryItem
}

defineProps<Props>()
</script>

<template>
  <div class="relative overflow-hidden cursor-pointer rounded-2xl p-4 border border-secondary-light transition-colors flex justify-between w-full gap-4">
    <div class="flex flex-col items-start gap-1">
      <div class="flex justify-center gap-2">
        <Flag :country-code="word.locales?.original" />

        <span class="text-lg">
          {{ word.original }}
        </span>
      </div>

      <div class="flex justify-center gap-2">
        <Flag :country-code="word.locales?.learn" />

        <span class="text-lg">
          {{ word.learn }}
        </span>
      </div>
    </div>

    <div class="text-xs text-end flex flex-col justify-between">
      <p>
        <strong class="block">Duration</strong>
        <span class="text-senary">
          {{ summary.duration }}
        </span>
      </p>

      <p>
        <strong class="block">Score</strong>
        <span class="text-senary">
          {{ summary.score }}
        </span>
      </p>
    </div>
  </div>
</template>
