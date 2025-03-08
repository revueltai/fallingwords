<script setup lang="ts">
type StreakState = 'done' | 'missing'

interface Streak {
  day: string
  state: StreakState
}

const todayIndex = new Date().getDay()

const week: Streak[] = [
  { day: 'M', state: 'done' },
  { day: 'T', state: 'done' },
  { day: 'W', state: 'missing' },
  { day: 'T', state: 'missing' },
  { day: 'F', state: 'missing' },
  { day: 'S', state: 'done' },
  { day: 'S', state: 'done' },
]

function getClasses(state: StreakState, index: number) {
  if (todayIndex === index) {
    return 'shadow-lg border-primary-light bg-primary'
  }

  if (todayIndex < index) {
    return 'border-secondary-light'
  }

  return state === 'done'
    ? 'border-tertiary-light'
    : 'border-quaternary'
}

function getIconName(state: StreakState, index: number) {
  if (todayIndex <= index) {
    return 'question'
  }

  return state === 'done'
    ? 'check'
    : 'cross'
}

function getIconColor(state: StreakState, index: number) {
  if (todayIndex < index) {
    return 'secondary-light'
  }

  return state === 'done' || todayIndex === index
    ? 'white'
    : 'quaternary-light'
}
</script>

<template>
  <div class="max-w-80 rounded-xl flex items-center justify-center gap-4 overflow-hidden px-2 py-3 bg-secondary border border-secondary-light w-full">
    <div
      v-for="({ state, day }, index) in week"
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
