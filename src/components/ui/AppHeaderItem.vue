<script setup lang="ts">
import { isMobile } from '@/utils'
import AnimatedNumber from '../shared/AnimatedNumber.vue'

interface Props {
  iconName: IconName
  count: number
}

defineProps<Props>()
</script>

<template>
  <div class="h-auto flex gap-1 items-center cursor-pointer anim-scale-in-timed min-h-4 sm:min-h-10 sm:min-w-10">
    <Icon
      :name="iconName"
      :size="isMobile() ? 'md' : 'lg'"
      type="fill"
    />

    <AnimatedNumber
      :value="count"
      class="text-md sm:text-lg"
    />
  </div>
</template>
