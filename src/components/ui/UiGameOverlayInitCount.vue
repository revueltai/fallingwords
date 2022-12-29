<template>
  <div 
    v-if="countdown"
    ref="counterRef"
    class="ui-game-countdown"
  >
    <div class="ui-game-countdown__wrapper">
      {{ countdown }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { UI } from '../../configs/constants'

export default defineComponent({
  name: 'UiGameOverlayInitCount',
  setup() {

    // Injects
    const store = useStore()

    // Refs
    const countdown = ref(3)
    const counterRef = ref(null)

    // Methods
    const triggerMatchInit = () => {
      store.dispatch('gameUI/setOverlayState', UI.overlayStates.fadeOut)
      store.dispatch('game/initMatch')
    }

    const startCountdown = () => {
      store.dispatch('gameUI/setOverlayState', UI.overlayStates.fadeIn)
      let intervalId: number = setInterval(() => {
        if (countdown.value <= 1) {
          countdown.value = null
          clearInterval(intervalId)
          triggerMatchInit()
          return
        } 

        countdown.value--
        counterRef.value.classList.add('anim-scale-in')
        counterRef.value.addEventListener('animationend', handleAnimationEnd)
      }, 1000)
    }
    
    // Events
    const handleAnimationEnd = (event: AnimationEvent) => {
      event.stopPropagation()
      
      if (event.animationName === 'scale-in') {
        (<HTMLElement>event.target).classList.remove('anim-scale-in')
      }
    }

    onMounted(() => {
      startCountdown()
    })

    onBeforeUnmount(() => {
      if (counterRef.value) {
        counterRef.value.removeEventListener('animationend', handleAnimationEnd)
      }
    })

    return {
      countdown,
      counterRef
    }
  }
})
</script>

<style scoped>
.ui-game-countdown {
  @apply flex items-center justify-center bg-quinary border border-info rounded-full w-96 h-96;
}

.ui-game-countdown__wrapper {
  @apply flex items-center justify-center bg-quaternary border border-white shadow-lg text-black text-center text-4xl font-bold rounded-full w-72 h-72;
}
</style>