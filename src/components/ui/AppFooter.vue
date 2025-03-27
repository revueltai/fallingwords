<script setup lang="ts">
import ModalSettings from '@/components/ui/modals/ModalSettings.vue'
import { APP_MENU } from '@/configs/constants'
import { useModalStore } from '@/stores/modal.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const modalStore = useModalStore()

const activeItem = ref('')

function isActiveItem(item: AppMenuItem) {
  return item.id === activeItem.value
}

function getActiveItemClasses(item: AppMenuItem) {
  return isActiveItem(item)
    ? 'primary'
    : 'white'
}

function handleClick(item: AppMenuItem) {
  activeItem.value = item.id

  if (item.id === 'settings') {
    modalStore.openModal()
    return
  }

  router.push(item.url)
}
</script>

<template>
  <footer class="w-full absolute bottom-0 flex justify-center gap-6 px-4 py-3 bg-secondary border-t border-secondary-light">
    <div
      v-for="(item, index) in APP_MENU"
      :key="index"
      @click="() => handleClick(item)"
    >
      <Icon
        :name="item.iconName"
        :color="getActiveItemClasses(item)"
        type="fill"
        size="xl"
        class="transition-colors cursor-pointer border border-transparent rounded-lg hover:bg-secondary-light hover:border-senary-light"
        :class="isActiveItem(item) && 'active'"
      />
    </div>
  </footer>

  <Modal heading="Settings">
    <ModalSettings />
  </Modal>
</template>

<style scoped>
.active {
 @apply bg-secondary-light border-senary-light;
}
</style>
