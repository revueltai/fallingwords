<script setup lang="ts">
import { getRoundStars, isMobile } from '@/utils'
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
        class="flex justify-start items-center truncate gap-1 sm:gap-2"
      >
        <Flag
          :country-code="wordItem.countryCode"
          :size="isMobile() ? 'sm' : 'md'"
        />

        <span class="truncate text-xs sm:text-sm">
          {{ wordItem.word }}
        </span>
      </div>
    </div>

    <div class="text-xs text-end flex justify-between flex-col gap-1">
      <p>
        <strong class="block">{{ $t('duration') }}</strong>

        <span class="text-primary-light">
          {{ summary.duration }}
        </span>
      </p>

      <p>
        <Icon
          v-for="(star, index) in roundStars"
          :key="index"
          :type="isFullStar(star) ? 'both' : 'stroke'"
          :color="isFullStar(star) ? 'quinary-light' : 'white'"
          name="star"
          size="sm"
        />
      </p>
    </div>
  </div>
</template>
