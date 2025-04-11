<script setup lang="ts">
import { APP_MENU } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { sanitizeRoute } from '@/utils'
import { onMounted, ref } from 'vue'

const appStore = useAppStore()

const activeClass = 'border bg-secondary-light border-senary-light'

const activeItem = ref('')
const appFooterRef = ref<RefElement>(null)

function isActiveItem(item: AppMenuItem) {
  return item.id === activeItem.value
}

function handleClick(item: AppMenuItem) {
  activeItem.value = item.id
}

onMounted(() => {
  if (appFooterRef.value) {
    appStore.setAppUiElementHeights('appFooter', appFooterRef.value.offsetHeight)
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
      class="transition-colors rounded-lg hover:bg-secondary-light hover:border-senary-light"
      :class="!isActiveItem(item) ? 'border border-transparent' : ''"
      :css-classes="isActiveItem(item) ? activeClass : ''"
      :active-class="activeClass"
      is-unstyled
      @click="handleClick(item)"
    >
      <Icon
        :name="item.iconName"
        type="fill"
        size="xl"
      />
    </Button>
  </footer>
</template>
