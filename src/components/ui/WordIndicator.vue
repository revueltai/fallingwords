<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-1 px-2 py-1 rounded-l-full border ">
    <Icon
      name="chevronLeftDouble"
      size="sm"
      stroke-width="3"
    />

    <span class="text-white uppercase text-sm">
      {{ text }}
    </span>
  </div>
</template>
