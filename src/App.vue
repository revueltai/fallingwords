<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div 
        ref="appWrapper"
        class="app__wrapper"
      >
        <component
          v-if="isLoaded"
          :is="Component" 
        />
      </div>
    </transition>
  </router-view>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue'
import { vAnimController } from 'vue-simple-transitions'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore()

    const appWrapper = ref(null)
    const isLoaded = ref(false)

    const canvasMaxWidth = computed(() => store.getters['app/canvasMaxWidth'])
    const canvasMaxHeight = computed(() => store.getters['app/canvasMaxHeight'])

    const setCanvasSize = () => {
      const canvas = appWrapper.value
      canvas.style.maxWidth = `${canvasMaxWidth.value}px`
      canvas.style.maxHeight = `${canvasMaxHeight.value}px`
    }

    const initialize = () => {
      vAnimController()
      setCanvasSize()
      store.dispatch('app/setElement', appWrapper.value)
      isLoaded.value = true
    }

    onMounted(() => {
      initialize()
    })

    return {
      appWrapper,
      isLoaded
    }
  }
})
</script>

<style>
.app__wrapper {
  @apply relative w-full h-full overflow-visible bg-secondary border rounded-xl border-tertiary;
}
</style>
