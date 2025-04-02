<script setup lang="ts">
import ListMessage from '@/components/shared/ListMessage.vue'
import { computed } from 'vue'

interface Props {
  isEmpty: boolean
  columns?: number | string
  emptyHeading?: string
  emptyByline?: string
  emptyIconName?: IconName
}

const props = withDefaults(defineProps<Props>(), {
  columns: 2,
})

const cssClasses = computed(() => {
  return `grid-cols-${props.columns}`
})
</script>

<template>
  <ListMessage
    v-if="isEmpty"
    :icon-name="emptyIconName"
    :heading="emptyHeading || ''"
    :byline="emptyByline || ''"
  />

  <div
    v-else
    class="flex flex-col flex-grow overflow-hidden"
  >
    <div
      class="u-gradient-mask py-2 grid gap-6 items-start auto-rows-min flex-grow overflow-y-auto"
      :class="cssClasses"
    >
      <slot />
    </div>

    <div
      v-if="!isEmpty"
      class="flex items-center mt-8 justify-center flex-shrink-0 pb-4"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
