<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  label?: string
  name?: string
}

withDefaults(defineProps<Props>(), {
  label: '',
})
</script>

<template>
  <label
    :for="name"
    class="text-start text-senary-light text-sm"
  >
    {{ label }}
  </label>
</template>
