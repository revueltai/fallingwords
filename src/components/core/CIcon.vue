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
import { computed, defineComponent } from 'vue'

const sizes = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
  '4xl': 64
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
      type: [String, Number],
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
        `inline-flex ${type}-current text-${props.color} w-${size} h-${size}`
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
