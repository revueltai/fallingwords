<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  size?: string
  color?: string
  textAlignment?: 'center'
  to?: RouteLocationRaw | null
  disabled?: boolean
  iconOnly?: boolean
  hasBackground?: boolean
  isRounded?: boolean
  isSquared?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  color: 'primary',
  textAlignment: 'center',
  to: null,
  disabled: false,
  iconOnly: false,
  hasBackground: true,
  isRounded: false,
  isSquared: false,
})

const emit = defineEmits(['click'])

const isRouterLink = computed(() => props.to)

const cssClasses = computed(() => {
  const payload = [
    `clink disabled:opacity-50 focus:outline-none inline-flex items-center text-${props.textAlignment}`,
  ]

  if (props.hasBackground) {
    payload.push(`border border-${props.color}lighter bg-${props.color}`)
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

  switch (props.size) {
    case 'small':
      payload.push('text-s')
      break

    case 'medium':
      payload.push('text-p')
      break

    case 'large':
      payload.push('text-h5')
      break
  }

  return payload.join(' ')
})

function onClick(event: Event) {
  emit('click', event)
}
</script>

<template>
  <RouterLink
    v-if="isRouterLink"
    class="link disabled:opacity-50 focus:outline-none bg-primary"
    :class="cssClasses"
    :to="to ?? ''"
  >
    <slot />
  </RouterLink>

  <button
    v-else
    role="button"
    :disabled="disabled"
    :class="cssClasses"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.link {
  border: 1px solid #4BAFFF;
  box-shadow: 0px 2px 0px #4BAFFF,
              0px 2px 4px #038DFB;
}
</style>
