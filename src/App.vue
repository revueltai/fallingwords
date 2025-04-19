<script setup lang="ts">
import ModalContainer from '@/components/shared/ModalContainer.vue'
import Toast from '@/components/shared/Toast.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import AppHeader from '@/components/ui/AppHeader.vue'
import { useUserStore } from '@/stores/user.store'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAppStore } from './stores/app.store'
import { useSoundStore } from './stores/sounds.store'
import { useStreakStore } from './stores/streak.store'
import 'movinblocks/styles'

const router = useRouter()
const streakStore = useStreakStore()
const userStore = useUserStore()
const soundStore = useSoundStore()
const appStore = useAppStore()

const appWrapperRef = ref<RefElement>(null)
const isLoaded = ref(false)
const isFocused = ref(false)

const canvasMaxWidth = computed(() => appStore.canvasMaxWidth)

const canvasMaxHeight = computed(() => appStore.canvasMaxHeight)

const isAppPage = computed(() => {
  const { path } = router.currentRoute.value
  return !['/game', '/welcome', '/'].includes(path)
})

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

function handleRouterViewClick() {
  appStore.setFullscreen()
}

watch(isFocused, (newFocusState: boolean) => {
  if (newFocusState) {
    handleSoundLoading()
  }
})

async function initializeCollections() {
  if (userStore.isAuthenticated) {
    const rs = await appStore.fetchCollections()

    if (!rs) {
      userStore.logout()
    }
  }
}

onMounted(async () => {
  // await initializeCollections()
  userStore.startLifeRegeneration()
  streakStore.setStreakLength()

  window.addEventListener('focus', () => handleWindowFocus)
  handleSoundLoading()

  if (appWrapperRef.value) {
    setCanvasSize()
    appStore.setCanvasElement(appWrapperRef.value)
    isLoaded.value = true
  }

  router.push({ name: 'Splash' })
})

onUnmounted(() => window.removeEventListener('focus', handleWindowFocus))
</script>

<template>
  <RouterView
    v-slot="{ Component }"
    @click="handleRouterViewClick"
  >
    <div
      v-show="isLoaded"
      ref="appWrapperRef"
      class="relative w-full h-full overflow-hidden bg-secondary-dark border border-secondary sm:rounded-xl"
    >
      <div class="flex flex-col h-full">
        <AppHeader v-if="isAppPage" />

        <Transition name="fade" mode="out-in">
          <Component
            :is="Component"
            v-if="isLoaded"
          />
        </Transition>

        <AppFooter v-if="isAppPage" />
      </div>

      <ModalContainer />
      <Toast />
    </div>
  </RouterView>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  @apply transition-opacity duration-300 ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
