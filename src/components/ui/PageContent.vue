<script setup lang="ts">
import ListMessage from '@/components/shared/ListMessage.vue'
import { computed } from 'vue'

interface Props {
  isEmpty: boolean
  hasFooter?: boolean
  columns?: number | string
  emptyHeading?: string
  emptyByline?: string
  emptyIconName?: IconName
  emptyIconType?: IconType
  overflow?: 'hidden' | 'visible'
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: 1,
  hasFooter: true,
  overflow: 'hidden',
  emptyHeading: '',
  emptyByline: '',
  isLoading: false,
})

const cssClasses = computed(() => `grid-cols-${props.columns}`)

const cssClassesWrapper = computed(() => `overflow-${props.overflow}`)

const footerIsHidden = computed(() => !props.isEmpty && !props.hasFooter)
</script>

<template>
  <div
    class="flex flex-col flex-grow"
    :class="cssClassesWrapper"
  >
    <Loader v-if="isLoading" />

    <div
      v-else
      class="u-gradient-mask h-full py-2 grid gap-6 items-start auto-rows-min flex-grow overflow-y-auto"
      :class="cssClasses"
    >
      <ListMessage
        v-if="isEmpty"
        :icon-name="emptyIconName"
        :icon-type="emptyIconType"
        :heading="emptyHeading"
        :byline="emptyByline"
      />

      <slot />
    </div>

    <div
      v-if="!footerIsHidden"
      class="flex items-center mt-4 justify-center flex-shrink-0 pb-4"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
