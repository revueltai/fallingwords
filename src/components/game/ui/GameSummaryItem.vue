<script setup lang="ts">
import { getRoundStars } from '@/utils'
import { computed } from 'vue'

interface Props {
  word: AppWord
  summary: GameSummaryItem
}

const props = defineProps<Props>()

const roundStars = computed(() => getRoundStars(props.summary.score!))

const wordsData = [
  {
    word: props.word.original,
    countryCode: props.word.locales?.original,
  },
  {
    word: props.word.learn,
    countryCode: props.word.locales?.learn,
  },
]

function isFullStar(star: string) {
  return star === 'StarFull'
}
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl p-4 border border-secondary-light transition-colors flex justify-between w-full gap-2">
    <div class="flex flex-col items-start gap-4">
      <div
        v-for="(wordItem, index) in wordsData"
        :key="index"
        class="flex justify-start items-center gap-2 truncate"
      >
        <Flag :country-code="wordItem.countryCode" />

        <span class="text-sm truncate">
          {{ wordItem.word }}
        </span>
      </div>
    </div>

    <div class="text-xs text-end flex flex-col justify-between">
      <p>
        <strong class="block">Duration</strong>
        <span class="text-primary-light">
          {{ summary.duration }}
        </span>
      </p>

      <p>
        <strong class="block">Score</strong>
        <span class="text-senary flex">
          <Icon
            v-for="(star, index) in roundStars"
            :key="index"
            :type="isFullStar(star) ? 'both' : 'stroke'"
            :color="isFullStar(star) ? 'quinary-light' : 'white'"
            name="star"
            size="sm"
          />
        </span>
      </p>
    </div>
  </div>
</template>
