<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div 
        ref="appWrapper"
        class="app__wrapper"
      >
        <component :is="Component" />
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
      store.dispatch('app/setCanvasElement', appWrapper.value)
    }

    onMounted(() => {
      initialize()
    })

    return {
      appWrapper
    }
  }
})
</script>

<style>
.app__wrapper {
  @apply relative w-full h-full overflow-hidden bg-secondary border rounded-xl border-tertiary;
}
</style>
