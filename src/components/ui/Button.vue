<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { createCssVar } from '@/utils'
import { computed } from 'vue'

type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  size?: ButtonSize
  backgroundColor?: Color
  borderColor?: Color
  textColor?: Color
  cssClasses?: string
  textAlignment?: 'center'
  to?: RouteLocationRaw | null
  disabled?: boolean
  iconOnly?: boolean
  hasIcon?: boolean
  hasBackground?: boolean
  isRounded?: boolean
  isSquared?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  backgroundColor: 'primary',
  borderColor: 'primary-light',
  textColor: 'white',
  textSize: 'h5',
  cssClasses: '',
  textAlignment: 'center',
  to: null,
  disabled: false,
  iconOnly: false,
  hasIcon: false,
  hasBackground: true,
  isRounded: false,
  isSquared: false,
})

const emit = defineEmits(['click'])

const isRouterLink = computed(() => props.to)

const cssClasses = computed(() => {
  const payload = [
    `hover:scale-105 transition-all disabled:opacity-50 focus:outline-none inline-flex justify-center items-center text-${props.textAlignment} ${props.cssClasses}`,
  ]

  if (props.hasBackground) {
    payload.push(`shadow border-2 border-${props.borderColor} bg-${props.backgroundColor} text-${props.textColor}`)
  }

  payload.push(
    props.iconOnly
      ? 'p-2'
      : 'py-2 px-4',
  )

  payload.push(
    props.isRounded
      ? 'rounded-2'
      : props.isSquared
        ? 'rounded-none'
        : 'rounded-full',
  )

  if (props.hasIcon) {
    payload.push('gap-2')
  }

  switch (props.size) {
    case 'sm':
      payload.push('text-s')
      break

    case 'md':
      payload.push('text-p')
      break

    case 'lg':
      payload.push('text-h5')
      break
  }

  return payload.join(' ')
})

const cssStyles = computed(() => [
  createCssVar('color-shadow-top', `var(--color-${props.borderColor})`),
  createCssVar('color-shadow', `var(--color-${props.backgroundColor})`),
])

function onClick(event: Event) {
  emit('click', event)
}
</script>

<template>
  <RouterLink
    v-if="isRouterLink"
    :class="cssClasses"
    :style="cssStyles"
    :to="to ?? ''"
  >
    <slot />
  </RouterLink>

  <button
    v-else
    role="button"

    :class="cssClasses"
    :disabled="disabled"
    :style="cssStyles"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.shadow {
  box-shadow: 0px 4px 0px var(--color-shadow-top),
              0px 4px 4px var(--color-shadow);
}
</style>
