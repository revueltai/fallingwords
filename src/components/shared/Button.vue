<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { createCssVar } from '@/utils'
import { computed } from 'vue'

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
  size?: ButtonSize
  type?: 'submit' | 'button'
  backgroundColor?: Color
  borderColor?: Color
  borderStrokeWidth?: 0 | 1 | 2 | '0' | '1' | '2'
  textColor?: Color
  cssClasses?: string
  textAlignment?: 'center'
  to?: RouteLocationRaw | null
  disabled?: boolean
  iconOnly?: boolean
  hasIcon?: boolean
  hasShadow?: boolean
  hasBackground?: boolean
  isRounded?: boolean
  isSquared?: boolean
  isLink?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  type: 'button',
  backgroundColor: 'primary',
  borderColor: 'primary-light',
  borderStrokeWidth: 2,
  textColor: 'white',
  textSize: 'h5',
  cssClasses: '',
  textAlignment: 'center',
  to: null,
  disabled: false,
  iconOnly: false,
  hasIcon: false,
  hasShadow: true,
  hasBackground: true,
  isRounded: false,
  isSquared: false,
  isLink: false,
})

const emit = defineEmits(['click'])

const isRouterLink = computed(() => props.to)

const cssClasses = computed(() => {
  const payload = [
    `transition-all duration-500 inline-flex justify-center items-center hover:scale-105 disabled:grayscale disabled:opacity-50 focus:outline-none text-${props.textAlignment} ${props.cssClasses}`,
  ]

  if (props.hasBackground && !props.isLink) {
    payload.push(`bg-${props.backgroundColor} text-${props.textColor}`)

    if (props.borderColor !== 'none') {
      payload.push(`border-${props.borderColor}`)

      payload.push(Number(props.borderStrokeWidth) === 1
        ? 'border'
        : `border-${props.borderStrokeWidth}`,
      )
    }

    if (props.hasShadow) {
      payload.push('shadow')
    }
  }

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

  if (props.iconOnly) {
    payload.push('p-2')
  } else if (!props.isLink) {
    switch (props.size) {
      case 'xs':
        payload.push('text-xs py-1 px-2')
        break

      case 'sm':
        payload.push('text-sm py-1 px-2')
        break

      case 'md':
        payload.push('text-p py-2 px-4')
        break

      case 'lg':
        payload.push('text-h5 py-2 px-4')
        break
    }
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
    :type="type"
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
