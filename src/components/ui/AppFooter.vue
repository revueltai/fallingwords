<script setup lang="ts">
import { APP_MENU } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { sanitizeRoute } from '@/utils'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appStore = useAppStore()

const activeClass = 'border bg-secondary-light border-senary-light'

let resizeObserver: ResizeObserver | null = null

const appFooterRef = ref<RefElement>(null)

const activeItem = computed(() => {
  if (route.name === 'Collection') {
    return 'collections'
  }

  return route.name as string
})

function updateHeight() {
  if (appFooterRef.value) {
    appStore.setAppUiElementHeights('appFooter', appFooterRef.value.offsetHeight)
  }
}

function isActiveItem(item: AppMenuItem) {
  return item.id === activeItem.value
}

onMounted(() => {
  updateHeight()
  resizeObserver = new ResizeObserver(updateHeight)

  if (appFooterRef.value) {
    resizeObserver.observe(appFooterRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <footer
    ref="appFooterRef"
    class="w-full absolute bottom-0 flex justify-center px-4 py-3 bg-secondary border-t border-secondary-light gap-3 sm:gap-5"
  >
    <Button
      v-for="(item, index) in APP_MENU"
      :key="index"
      :to="sanitizeRoute(item.url)"
      :exact="isActiveItem(item)"
      class="transition-colors rounded-lg hover:bg-secondary-light hover:border-senary-light"
      :class="!isActiveItem(item) ? 'border border-transparent' : ''"
      :css-classes="isActiveItem(item) ? activeClass : ''"
      :active-class="activeClass"
      is-unstyled
    >
      <Icon
        :name="item.iconName"
        type="fill"
        size="xl"
      />
    </Button>
  </footer>
</template>
