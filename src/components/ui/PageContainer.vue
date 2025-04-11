<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { createCssVar } from '@/utils'
import { computed } from 'vue'

interface Props {
  heading?: string
  subheading?: string
  padding?: string
  showFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  heading: '',
  subheading: '',
  padding: 'px-4',
  showFooter: true,
})

const appStore = useAppStore()

const cssStyles = computed(() => appStore.appUiElementHeights.appFooter && props.showFooter
  ? createCssVar('app-footer', `${appStore.appUiElementHeights.appFooter}px`)
  : '',
)

const cssClasses = computed(() => appStore.appUiElementHeights.appFooter && props.showFooter
  ? 'pb-[var(--app-footer)] max-h-[calc(100%-var(--app-footer))]'
  : '',
)
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
