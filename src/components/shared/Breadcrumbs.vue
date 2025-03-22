<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  breadcrumbs: string[]
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2 text-white font-semibold">
    <span
      v-for="(part, index) in breadcrumbs"
      :key="index"
      class="flex items-center gap-2"
    >
      <span>{{ part }}</span>

      <Icon
        v-if="index < breadcrumbs.length - 1"
        name="chevronRight"
        color="senary-light"
      />
    </span>
  </div>
</template>
