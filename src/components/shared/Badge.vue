<script setup lang="ts">
import { computed } from 'vue'

type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

interface Props {
  value: string | number
  size?: Size
  textSize?: Size
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  textSize: 'sm',
})

const sizes: Record<BadgeSize, string> = {
  'xs': 'w-3 h-3 text-xs',
  'sm': 'w-5 h-5 text-xs',
  'md': 'w-6 h-6',
  'lg': 'w-8 h-8',
  'xl': 'w-0 h-0',
  '2xl': 'w-1 h-2',
  '3xl': 'w-1 h-4',
  '4xl': 'w-1 h-6',
}

const cssClasses = computed(() => [
  sizes[props.size],
  `text-${props.textSize}`,
])
</script>

<template>
  <span
    :class="cssClasses"
    class="rounded-full bg-primary flex items-center justify-center font-semibold border-2 border-secondary-dark"
  >
    {{ value }}
  </span>
</template>
