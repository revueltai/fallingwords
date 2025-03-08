<script setup lang="ts">
import { computed } from 'vue'

type IconType = 'fill' | 'stroke'
type IconSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface Props {
  name: IconName
  type?: IconType
  size?: IconSizeName
  strokeWidth?: 1 | 2 | 3 | 4 | '1' | '2' | '3' | '4'
  color?: Color
  iconset?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconset: `/iconset.svg?v${Date.now()}`,
  type: 'stroke',
  size: 'sm',
  color: 'white',
  strokeWidth: 2,
})

const sizes: Record<IconSizeName, { w: string, h: string }> = {
  'xs': { w: 'w-2', h: 'h-2' },
  'sm': { w: 'w-4', h: 'h-4' },
  'md': { w: 'w-6', h: 'h-6' },
  'lg': { w: 'w-8', h: 'h-8' },
  'xl': { w: 'w-10', h: 'h-10' },
  '2xl': { w: 'w-12', h: 'h-12' },
  '3xl': { w: 'w-14', h: 'h-14' },
}

const types: Record<IconType, string> = {
  fill: 'fill',
  stroke: 'stroke',
}

const cssClasses = computed(() => {
  const { w, h } = sizes[props.size]
  const type = types[props.type]

  const payload = [
    `inline-flex ${type}-current text-${props.color} ${w} ${h}`,
  ]

  if (props.type === 'stroke') {
    payload.push(`stroke-${props.strokeWidth}`)
  }

  return payload
})
</script>

<template>
  <svg
    :class="cssClasses"
    class="icon"
    aria-hidden="true"
    focusable="false"
  >
    <use
      :xlink:href="`${iconset}#${name}`"
      :href="`${iconset}#${name}`"
    />
  </svg>
</template>
