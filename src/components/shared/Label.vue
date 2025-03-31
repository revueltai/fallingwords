<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  label?: string
  name?: string
  color?: Color
}

withDefaults(defineProps<Props>(), {
  label: '',
  color: 'senary-light',
})
</script>

<template>
  <label
    :for="name"
    class="text-start text-sm"
    :class="`text-${color}`"
  >
    {{ label }}
  </label>
</template>
