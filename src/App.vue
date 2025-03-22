<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import Toast from './components/shared/Toast.vue'
import { useAppStore } from './stores/app.store'
import 'movinblocks/styles'

const appStore = useAppStore()

const appWrapperRef = ref<ElementRef>(null)
const isLoaded = ref(false)

const canvasMaxWidth = computed(() => appStore.canvasMaxWidth)
const canvasMaxHeight = computed(() => appStore.canvasMaxHeight)

function setCanvasSize() {
  if (appWrapperRef.value) {
    appWrapperRef.value.style.maxWidth = `${canvasMaxWidth.value}px`
    appWrapperRef.value.style.maxHeight = `${canvasMaxHeight.value}px`
  }
}

onMounted(async () => {
  if (appWrapperRef.value) {
    await appStore.setCollections()

    setCanvasSize()
    appStore.setCanvasElement(appWrapperRef.value)
    isLoaded.value = true
  }
})
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
