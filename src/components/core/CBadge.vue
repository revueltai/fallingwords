<template>
  <span class="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-s font-semibold border-secondary border-2">
    {{ value }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CBadge',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  }
})
</script>
