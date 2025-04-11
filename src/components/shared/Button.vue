<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { useSoundStore } from '@/stores/sounds.store'
import { createCssVar } from '@/utils'
import { computed } from 'vue'

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonType = 'submit' | 'button' | 'link'
type ButtonFormTypes = 'submit' | 'button' | 'reset' | undefined

interface Props {
  size?: ButtonSize
  type?: ButtonType
  backgroundColor?: Color
  borderColor?: Color
  borderStrokeWidth?: 0 | 1 | 2 | '0' | '1' | '2'
  textColor?: Color
  cssClasses?: string
  activeClass?: string
  textAlignment?: 'center'
  to?: RouteLocationRaw | string | null
  disabled?: boolean
  iconOnly?: boolean
  hasIcon?: boolean
  hasShadow?: boolean
  hasBackground?: boolean
  isRounded?: boolean
  isSquared?: boolean
  isUnstyled?: boolean
  triggerKey?: string // New prop for the key to trigger click
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
  activeClass: '',
  textAlignment: 'center',
  to: null,
  disabled: false,
  iconOnly: false,
  hasIcon: false,
  hasShadow: true,
  hasBackground: true,
  isRounded: false,
  isSquared: false,
  isUnstyled: false,
  triggerKey: 'Enter',
})

const emit = defineEmits(['click'])

const soundStore = useSoundStore()

const isButton = computed(() => (props.type === 'button' || props.type === 'submit') && !props.to)
const isLink = computed(() => props.type === 'link')
const isExternalLink = computed(() => isLink.value && props.to && (props.to as string)?.startsWith('https'))
const isRouterLink = computed(() => !(isButton.value || isExternalLink.value))

const cssClasses = computed(() => {
  if (props.isUnstyled) {
    return 'inline-flex items-center text-inherit no-underline hover:underline'
  }

  const payload = [
    `inline-flex justify-center items-center disabled:grayscale disabled:opacity-50 focus:outline-none text-${props.textAlignment} ${props.cssClasses}`,
  ]

  if (props.hasBackground && !isLink.value) {
    payload.push(`bg-${props.backgroundColor} text-${props.textColor}`)

    if (props.borderColor !== 'none') {
      payload.push(`border-${props.borderColor}`)

      payload.push(Number(props.borderStrokeWidth) === 1
        ? 'border'
        : `border-${props.borderStrokeWidth}`,
      )
    }

    if (props.hasShadow) {
      payload.push('shadow active:shadow-none active:translate-y-1')
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
  } else if (isExternalLink.value) {
    switch (props.size) {
      case 'xs':
        payload.push('text-xs')
        break

      case 'sm':
        payload.push('text-sm')
        break

      case 'md':
        payload.push('text-sm sm:text-p')
        break

      case 'lg':
        payload.push('text-p sm:text-h5')
        break

      case 'xl':
        payload.push('text-p sm:text-h5')
        break
    }
  } else if (!isLink.value) {
    switch (props.size) {
      case 'xs':
        payload.push('text-xs py-1 px-2')
        break

      case 'sm':
        payload.push('text-sm py-1 px-2')
        break

      case 'md':
        payload.push('text-sm sm:text-p py-2 px-4')
        break

      case 'lg':
        payload.push('text-p sm:text-h5 py-2 px-4')
        break

      case 'xl':
        payload.push('text-h6 sm:text-h5 py-4 px-6')
        break
    }
  }

  return payload.join(' ')
})

const cssStyles = computed(() => [
  createCssVar('color-shadow-top', `var(--color-${props.borderColor})`),
  createCssVar('color-shadow', `var(--color-${props.backgroundColor})`),
])

function handleSound() {
  soundStore.playSoundEffect('buttonClick')
}

function handleClick(event: Event) {
  handleSound()
  emit('click', event)
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === props.triggerKey) {
    handleClick(event as Event)
  }
}
</script>

<template>
  <RouterLink
    v-if="isRouterLink"
    :class="cssClasses"
    :exact-active-class="activeClass"
    :active-class="activeClass"
    :style="cssStyles"
    :to="to ?? ''"
    @click="handleClick"
    @keydown="handleKeyPress"
  >
    <slot />
  </RouterLink>

  <a
    v-else-if="isExternalLink"
    :href="String(to)"
    :class="cssClasses"
    :style="cssStyles"
    target="_blank"
    rel="noopener noreferrer"
    @keydown="handleKeyPress"
  >
    <slot />
  </a>

  <button
    v-else
    role="button"
    :type="(type as ButtonFormTypes)"
    :class="cssClasses"
    :disabled="disabled"
    :style="cssStyles"
    @click="handleClick"
    @keydown="handleKeyPress"
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
