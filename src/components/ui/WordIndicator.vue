<script setup lang="ts">
import { isMobile } from '@/utils'

interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-1 px-2 py-1 rounded-l-full border ">
    <Icon
      :size="isMobile() ? 'xs' : 'sm'"
      name="chevronLeftDouble"
      stroke-width="3"
    />

    <span class="text-white uppercase text-xs sm:text-sm">
      {{ text }}
    </span>
  </div>
</template>
