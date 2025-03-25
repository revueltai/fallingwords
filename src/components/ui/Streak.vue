<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'

const todayIndex = new Date().getDay()

const appStore = useAppStore()

function getClasses(state: UserStreakState, index: number) {
  if (todayIndex === index) {
    return 'shadow-lg border-primary-light bg-primary'
  }

  if (todayIndex < index) {
    return 'border-secondary-light'
  }

  switch (state) {
    case 'done':
      return 'border-tertiary-light'

    case 'missing':
      return 'border-quaternary'

    case 'unknown':
      return 'border-secondary-light'
  }
}

function getIconName(state: UserStreakState, index: number) {
  if (todayIndex <= index) {
    return 'question'
  }

  switch (state) {
    case 'done':
      return 'check'

    case 'missing':
      return 'cross'

    case 'unknown':
      return 'question'
  }
}

function getIconColor(state: UserStreakState, index: number) {
  if (state === 'done' || todayIndex === index) {
    return 'white'
  }

  if (todayIndex < index || state === 'unknown') {
    return 'secondary-light'
  }

  return 'quaternary-light'
}
</script>

<template>
  <div class="max-w-80 rounded-xl flex items-center justify-center gap-4 overflow-hidden px-2 py-3 bg-secondary border border-secondary-light w-full">
    <div
      v-for="({ state, day }, index) in appStore.streak"
      :id="`streakDay${index}`"
      :key="index"
      class="text-center"
      :class="todayIndex < index && 'opacity-20'"
    >
      <h4 class="text-xs mb-1">
        {{ day }}
      </h4>

      <div
        class="flex justify-center items-center rounded-full w-7 h-7 overflow-hidden border"
        :class="getClasses(state, index)"
      >
        <Icon
          :name="getIconName(state, index)"
          :color="getIconColor(state, index)"
          stroke-width="4"
        />
      </div>
    </div>
  </div>
</template>
