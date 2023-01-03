<template>
  <span 
    :class="cssClasses"
    class="cbadge"
  >
    {{ value }}
  </span>
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

export default defineComponent({
  name: 'CBadge',
  props: {
    size: {
      type: String,
      default: 'md'
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {

    // Computed
    const cssClasses = computed(() => {
      const size = sizes[props.size]
      return `w-${size} h-${size}`
    })
    
    return {
      cssClasses
    }
  }
})
</script>

<style scoped>
.cbadge {
  @apply rounded-full bg-primary flex items-center justify-center text-xs font-semibold border-secondary border-2;
}
</style>
