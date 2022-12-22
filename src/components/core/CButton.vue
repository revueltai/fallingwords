<template>
  <router-link
    :class="cssClasses"
    :to="to"
    v-if="isRouterLink"
  >
    <slot />
  </router-link>

  <button
    role="button"
    :disabled="disabled"
    :class="cssClasses"
    @click="onClick"
    v-else
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'CButton',
  emits: ['click'],
  props: {
    size: {
      type: String,
      default: 'large'
    },
    color: {
      type: String,
      default: 'primary'
    },
    textAlignment: {
      type: String,
      default: 'center'
    },
    to: {
      type: Object,
      default: null
    },
    disabled: {
      type: [Object, Boolean],
      default: false
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    hasBackground: {
      type: Boolean,
      default: true
    },
    isRounded: {
      type: Boolean,
      default: false
    },
    isSquared: {
      type: Boolean,
      default: false
    },
  },
  setup (props, context) {
    const isRouterLink = computed(() => {
      return props.to
    })

    const cssClasses = computed(() => {
      const payload = [
        `disabled:opacity-50 focus:outline-none inline-flex items-center text-${props.textAlignment}`
      ]

      if (props.hasBackground) {
        payload.push(`bg-primary border border-${props.color}-lighter bg-${props.color}`)
      }

      payload.push(
        props.iconOnly
          ? 'p-8'
          : 'py-8 px-16'
      )

      payload.push(
        props.isRounded
          ? 'rounded-8'
          : props.isSquared
          ? 'rounded-none'
          : 'rounded-full'
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

    const onClick = (event: Event) => {
      context.emit('click', event)
    }

    return {
      isRouterLink,
      cssClasses,
      onClick
    }
  }
})
</script>
