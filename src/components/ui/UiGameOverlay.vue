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
import UiGameOverlayRoundWon from './UiGameOverlayRoundWon.vue'
import UiGameOverlayRoundLost from './UiGameOverlayRoundLost.vue'

export default defineComponent({
  name: 'UiGameOverlay',
  components: {
    UiGameOverlayInitCount,
    UiGameOverlayPause,
    UiGameOverlayRoundWon,
    UiGameOverlayRoundLost
  },
  setup() {

    // Injects
    const store = useStore()

    // Refs
    const gameOverlayRef = ref(null)
    const visible = ref(false)
    const animationName = {
      start: 'fade-in',
      end: 'fade-out'
    }
    const animationClasses = {
      in: 'anim-fade-in',
      out: 'anim-fade-out'
    }

    // Computed
    const overlayState = computed(() => store.getters['gameUI/overlayState'])
    const overlayComponent = computed(() => store.getters['gameUI/overlayComponent'])
    
    // Watchers
    watch(overlayState, (newState) => {
      const el = gameOverlayRef.value
      
      switch (newState) {
        case UI.overlayStates.fadeIn:
          visible.value = true
          el.classList.add(animationClasses.in)
          break
      
        case UI.overlayStates.fadeOut:
          el.classList.add(animationClasses.out)
          break
      }
    })

    const handleAnimationEnd = (event: AnimationEvent) => {
      event.stopPropagation()
      gameOverlayRef.value.classList.remove(animationClasses.in, animationClasses.out)
      
      if (event.animationName === animationName.end) {
        visible.value = false
        store.dispatch('gameUI/setOverlayHidden')
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
  @apply z-30 flex items-center justify-center relative w-full h-full;
}
</style>