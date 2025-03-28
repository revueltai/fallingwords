<script setup lang="ts">
interface Props {
  heading: string
  byline: string
  iconName?: IconName | null
  iconType?: IconType
}

withDefaults(defineProps<Props>(), {
  iconName: null,
  iconType: 'fill',
})
</script>

<template>
  <div class="flex flex-col gap-2 items-center justify-center text-center p-10 h-full">
    <Icon
      :name="iconName"
      :type="iconType"
      size="xl"
      class="mb-1"
    />

    <h3 class="text-white">
      {{ heading }}
    </h3>

    <p class="text-sm text-senary-light mt-1">
      {{ byline }}
    </p>
  </div>
</template>
