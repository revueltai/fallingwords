<script setup lang="ts">
import ModalContainer from '@/components/shared/ModalContainer.vue'
import Toast from '@/components/shared/Toast.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app.store'
import { useSoundStore } from './stores/sounds.store'
import { useUserStore } from './stores/user.store'
import 'movinblocks/styles'

const soundStore = useSoundStore()
const appStore = useAppStore()
const userStore = useUserStore()

const appWrapperRef = ref<ElementRef>(null)
const isLoaded = ref(false)
const isFocused = ref(false)

const canvasMaxWidth = computed(() => appStore.canvasMaxWidth)
const canvasMaxHeight = computed(() => appStore.canvasMaxHeight)

function setCanvasSize() {
  if (appWrapperRef.value) {
    appWrapperRef.value.style.maxWidth = `${canvasMaxWidth.value}px`
    appWrapperRef.value.style.maxHeight = `${canvasMaxHeight.value}px`
  }
}

function handleWindowFocus() {
  isFocused.value = true
}

function handleSoundLoading() {
  soundStore.initializeSounds()
}

watch(isFocused, (newFocusState: boolean) => {
  if (newFocusState) {
    handleSoundLoading()
  }
})

onMounted(async () => {
  await appStore.loadStreak()
  await appStore.loadCollections()

  window.addEventListener('focus', () => handleWindowFocus)
  handleSoundLoading()

  if (appWrapperRef.value) {
    setCanvasSize()
    appStore.setCanvasElement(appWrapperRef.value)
    isLoaded.value = true
  }
})

onUnmounted(() => window.removeEventListener('focus', handleWindowFocus))
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <div
        v-show="isLoaded"
        ref="appWrapperRef"
        class="relative w-full h-full overflow-hidden bg-secondary-dark border rounded-xl border-secondary"
      >
        <div class="flex flex-col gap-8 h-full">
          <AppHeader v-if="appStore.showMenu" />

          <component
            :is="Component"
            v-if="isLoaded"
          />

          <AppFooter v-if="appStore.showMenu" />
        </div>

        <ModalContainer />
        <Toast />
      </div>
    </transition>
  </RouterView>
</template>
