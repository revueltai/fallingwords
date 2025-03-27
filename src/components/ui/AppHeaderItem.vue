<script setup lang="ts">
interface Props {
  iconName: IconName
  count: number
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-1 items-center">
    <Icon
      :name="iconName"
      size="lg"
    />

    <span class="text-lg">
      {{ count }}
    </span>
  </div>
</template>
