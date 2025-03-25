<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import Toast from './components/shared/Toast.vue'
import { useAppStore } from './stores/app.store'
import { useSoundStore } from './stores/sounds.store'
import 'movinblocks/styles'

const soundStore = useSoundStore()
const appStore = useAppStore()

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
        <component
          :is="Component"
          v-if="isLoaded"
        />

        <div id="modal" />

        <Toast />
      </div>
    </transition>
  </RouterView>
</template>
