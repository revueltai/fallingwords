<script setup lang="ts">
import { MouthIdle, MouthSweat, StreakMissingExpression } from '@/configs/assets.config'
import { useStreakStore } from '@/stores/streak.store'
import { getToday, isMobile } from '@/utils'
import { computed } from 'vue'

const streakStore = useStreakStore()

const weekStreak = computed(() => streakStore.getStreakResultsForCurrentWeek())

const hasStreak = computed(() => streakStore.currentStreak > 0)

const assetExpresion = computed(() => {
  if (!streakStore.hasPlayedToday) {
    return MouthSweat
  }

  if (!hasStreak.value) {
    return StreakMissingExpression
  }

  return MouthIdle
})

function getClasses(day: UserStreak) {
  if (day.isToday && !streakStore.hasPlayedToday) {
    return 'shadow-lg border-primary-light bg-primary anim-beat-timed'
  }

  switch (day.state) {
    case 'completed':
      return 'border-tertiary-light'

    case 'missing':
      return 'border-quaternary'

    case 'unknown':
      return 'border-secondary-light'
  }
}

function getIconName(day: UserStreak) {
  if (day.state !== 'completed' && !streakStore.hasPlayedToday) {
    return 'question'
  }

  switch (day.state) {
    case 'completed':
      return 'check'

    case 'missing':
      return 'cross'
  }
}

function getIconColor(day: UserStreak) {
  if ((day.state === 'completed' && day.date <= getToday()) || day.isToday) {
    return 'white'
  }

  if (day.state === 'unknown') {
    return 'secondary-light'
  }

  return 'quaternary-light'
}

function getStreakClasses(day: UserStreak) {
  return (day.date < getToday() && day.state === 'unknown') && 'opacity-30'
}
</script>

<template>
  <div class="flex justify-start items-center bg-secondary border border-secondary-light w-full overflow-hidden rounded-full pr-7 gap-5 sm:pr-8">
    <img
      :src="assetExpresion"
      width="80"
      height="80"
      class="sm:w-24 sm:h-24"
    >

    <div class="flex flex-col w-full h-full gap-3 justify-start">
      <div class="rounded-xl flex items-start justify-start gap-2 xs:gap-2.5">
        <div
          v-for="(day, index) in weekStreak"
          :id="`sd${index}`"
          :key="index"
          class="text-center"
          :data-date="day.date"
          :class="getStreakClasses(day)"
        >
          <h4 class="text-xs mb-1">
            {{ $t(day.dayName).slice(0, 3) }}
          </h4>

          <div
            class="flex justify-center items-center rounded-full overflow-hidden border w-5 h-5 sm:w-7 sm:h-7"
            :class="getClasses(day)"
          >
            <Icon
              v-if="day.state !== 'unknown' || day.isToday"
              :size="isMobile() ? 'xs' : 'sm'"
              :name="getIconName(day)"
              :color="getIconColor(day)"
              stroke-width="4"
            />
          </div>
        </div>
      </div>

      <p
        v-if="!hasStreak"
        class="text-xs text-primary"
      >
        {{ $t('haventPlayedYet') }}
      </p>
    </div>
  </div>
</template>
