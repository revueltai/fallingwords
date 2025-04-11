<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { createCssVar } from '@/utils'
import { computed } from 'vue'

interface Props {
  heading?: string
  subheading?: string
  padding?: string
}

withDefaults(defineProps<Props>(), {
  heading: '',
  subheading: '',
  padding: 'px-4',
})

const useStore = useAppStore()

const cssStyles = computed(() => useStore.appUiElementHeights.appFooter ? createCssVar('app-footer', `${useStore.appUiElementHeights.appFooter}px`) : '')

const cssClasses = computed(() => useStore.appUiElementHeights.appFooter ? 'pb-[var(--app-footer)] max-h-[calc(100%-var(--app-footer))]' : '')
</script>

<template>
  <div
    class="page-container h-full"
    :style="cssStyles"
    :class="cssClasses"
  >
    <div
      class="flex flex-col gap-4 w-full h-full"
      :class="padding !== 'none' ? padding : ''"
    >
      <TextBlock
        v-if="heading || subheading"
        :heading="heading"
        :subheading="subheading"
      />

      <slot />
    </div>
  </div>
</template>
