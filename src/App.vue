<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app.store'

const appStore = useAppStore()

const appWrapperRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)

const canvasMaxWidth = computed(() => appStore.canvasMaxWidth)
const canvasMaxHeight = computed(() => appStore.canvasMaxHeight)

function setCanvasSize() {
  if (appWrapperRef.value) {
    appWrapperRef.value.style.maxWidth = `${canvasMaxWidth.value}px`
    appWrapperRef.value.style.maxHeight = `${canvasMaxHeight.value}px`
  }
}

function initialize() {
  if (appWrapperRef.value) {
    setCanvasSize()
    appStore.setElement(appWrapperRef.value)
    isLoaded.value = true
  }
}

onMounted(() => initialize())
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <div
        v-show="isLoaded"
        ref="appWrapperRef"
        class="relative w-full h-full overflow-hidden bg-secondary border rounded-xl border-tertiary"
      >
        <component
          :is="Component"
          v-if="isLoaded"
        />
      </div>
    </transition>
  </RouterView>
</template>
