<script setup lang="ts">
interface Props {
  label?: string
  name?: string
  color?: Color
}

withDefaults(defineProps<Props>(), {
  label: '',
  color: 'senary-light',
  name: '',
})
</script>

<template>
  <label
    :for="name"
    class="text-start text-xs sm:text-sm"
    :class="`text-${color} ${name ? 'cursor-pointer' : ''}`"
  >
    {{ label }}
  </label>
</template>
