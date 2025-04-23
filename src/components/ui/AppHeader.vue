<script setup lang="ts">
import AppHeaderItem from '@/components/ui/AppHeaderItem.vue'
import ModalHeaderLives from '@/components/ui/modals/ModalHeaderLives.vue'
import { MODAL_NAMES } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { useStreakStore } from '@/stores/streak.store'
import { useUserStore } from '@/stores/user.store'
import { sanitizeRoute } from '@/utils'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const streakStore = useStreakStore()
const modalStore = useModalStore()

let resizeObserver: ResizeObserver | null = null
const appHeaderRef = ref<RefElement>(null)

function updateHeight() {
  if (appHeaderRef.value) {
    appStore.setAppUiElementHeights('appHeader', appHeaderRef.value.offsetHeight)
  }
}

function handleShowModalLives() {
  modalStore.openModal(MODAL_NAMES.headerLives)
}

function handleGoto(name: string) {
  router.push(sanitizeRoute(name))
}

onMounted(() => {
  updateHeight()
  resizeObserver = new ResizeObserver(updateHeight)

  if (appHeaderRef.value) {
    resizeObserver.observe(appHeaderRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <header
    ref="appHeaderRef"
    class="w-full relative flex justify-between px-4 py-3"
  >
    <AppHeaderItem
      icon-name="streakStroke"
      :count="streakStore.currentStreak"
      @click="handleGoto('streak')"
    />

    <div class="flex gap-4">
      <AppHeaderItem
        icon-name="gemStroke"
        :count="userStore.gems"
        @click="handleGoto('shop')"
      />

      <AppHeaderItem
        icon-name="heartStroke"
        :count="userStore.lives"
        @click="handleShowModalLives"
      />
    </div>
  </header>

  <Modal
    :heading="$t('yourLives')"
    :name="MODAL_NAMES.headerLives"
  >
    <ModalHeaderLives />
  </Modal>
</template>
