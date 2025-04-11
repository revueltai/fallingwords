<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col justify-end">
    <p class="text-sm flex items-start gap-1">
      <slot />
    </p>

    <p class="text-grey text-xs mt-1">
      {{ $t(text) }}
    </p>
  </div>
</template>
