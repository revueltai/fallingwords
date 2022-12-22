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

<script lang="ts">
import { defineComponent } from 'vue'
import { computed } from 'vue'

const sizes = {
  xSmall: 8,
  small: 16,
  medium: 24,
  large: 32,
  xLarge: 40,
  xxLarge: 48,
  xxxLarge: 56
}

const types = {
  fill: 'fill',
  stroke: 'stroke'
}

export default defineComponent({
  name: 'CIcon',
  props: {
    iconset: {
      default: '/iconset.svg'
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'stroke'
    },
    size: {
      type: String,
      default: 'small'
    },
    color: {
      type: String,
      default: 'white'
    }
  },
  setup (props) {
    const cssClasses = computed(() => {
      const size = sizes[props.size]
      const type = types[props.type]

      const payload = [
        `inline-flex ${type}-current text-${props.color}`,
        `w-${size} h-${size}`
      ]

      if (props.type === 'stroke') {
        payload.push('stroke-2')
      }

      return payload
    })

    return {
      cssClasses
    }
  }
})
</script>
