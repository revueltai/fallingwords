<script setup lang="ts">
import AnimatedNumber from '../shared/AnimatedNumber.vue'

interface Props {
  iconName: IconName
  count: number
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-1 items-center cursor-pointer anim-scale-in-timed">
    <Icon
      :name="iconName"
      size="lg"
      type="fill"
    />

    <AnimatedNumber :value="count" class="text-lg" />
  </div>
</template>
