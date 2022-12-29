<template>
  <section 
    v-show="visible"
    ref="gameOverlayRef"
    class="ui-game-overlay"
  >
    <div class="ui-game-overlay__wrapper">
      <div class="ui-game-overlay__bg" />
      <div class="ui-game-overlay__content">
        <component :is="overlayComponent" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { UI } from '@/configs/constants'
import UiGameOverlayInitCount from './UiGameOverlayInitCount.vue'
import UiGameOverlayPause from './UiGameOverlayPause.vue'
// import UiGameOverlayPowerupTriggered from './UiGameOverlayPowerupTriggered.vue'

export default defineComponent({
  name: 'UiGameOverlay',
  components: {
    UiGameOverlayInitCount,
    UiGameOverlayPause
    // UiGameOverlayPowerupTriggered
  },
  setup() {

    // Injects
    const store = useStore()

    // Refs
    const gameOverlayRef = ref(null)
    const visible = ref(false)

    // Computed
    const overlayState = computed(() => store.getters['gameUI/overlayState'])
    const overlayComponent = computed(() => store.getters['gameUI/overlayComponent'])
    
    // Watchers
    watch(overlayState, (newState) => {
      const el = gameOverlayRef.value
      
      switch (newState) {
        case UI.overlayStates.fadeIn:
          visible.value = true
          el.classList.add('anim-fade-in')
          break
        
          case UI.overlayStates.fadeOut:
          el.classList.add('anim-fade-out')
          break
      }
    })

    const handleAnimationEnd = (event: AnimationEvent) => {
      event.stopPropagation()
      gameOverlayRef.value.classList.remove('anim-fade-in', 'anim-fade-out')

      if (event.animationName === 'fade-out') {
        visible.value = false
      }
    }

    onMounted(() => {
      gameOverlayRef.value.addEventListener('animationend', handleAnimationEnd)
    })
    
    onBeforeUnmount(() => {
      if (gameOverlayRef.value) {
        gameOverlayRef.value.removeEventListener('animationend', handleAnimationEnd)
      }
    })

    return {
      gameOverlayRef,
      overlayState,
      visible,
      overlayComponent
    }
  }
})
</script>

<style scoped>
.ui-game-overlay {
  @apply w-full h-full absolute left-0 top-0;
}

.ui-game-overlay__wrapper {
  @apply relative w-full h-full;
}

.ui-game-overlay__bg {
  @apply z-0 absolute w-full h-full bg-secondary opacity-70 left-0 top-0;
}

.ui-game-overlay__content {
  @apply z-10 flex items-center justify-center relative w-full h-full;
}
</style>