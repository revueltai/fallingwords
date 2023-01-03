<template>
  <router-link
    v-if="isRouterLink"
    :to="to"
    :class="cssClasses"
    class="clink"
  >
    <slot />
  </router-link>

  <button
    v-else
    role="button"
    :disabled="disabled"
    :class="cssClasses"
    class="cbutton"
    @click="onClick"
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
      type: [String, Object],
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
        `inline-flex items-center text-${props.textAlignment}`
      ]

      if (props.hasBackground) {
        payload.push(`border-${props.color}-lighter bg-${props.color}`)
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
          payload.push('text-sm')
          break

        case 'medium':
          payload.push('text-md')
          break

        case 'large':
          payload.push('text-xl')
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

<style scoped>
.clink,
.cbutton {
 @apply focus:outline-none;
}

.clink {
  @apply disabled:opacity-50 focus:outline-none bg-primary;
  /* background-color: var(--); */
  border: 1px solid #4BAFFF;
  box-shadow: 0px 2px 0px #4BAFFF, 
              0px 2px 4px #038DFB;
}
</style>