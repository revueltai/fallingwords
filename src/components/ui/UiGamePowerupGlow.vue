<template>
  <div 
    ref="glowRef"
    :style="cssStyle"
    class="ui-powerup-glow" 
  />
</template>

<script lang="ts">
import { PowerupTypes } from '@project/interfaces'
import { ref, computed, watch, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'UiGamePowerupGlow',
  setup () {
    
    // Injects
    const store = useStore()

    // Refs
    const glowRef = ref(null)

    // Computed
    const UIElementsHeight = computed(() => store.getters['gameUI/elementsHeight'])
    const powerupType = computed(() => store.getters['game/roundActivePowerupType'])
    const cssStyle = computed(() => {
      return `--offset: ${UIElementsHeight.value.header}px`
    })

    // Methods
    const setClasses = (powerupType: PowerupTypes) => {
      const el: HTMLElement = glowRef.value
      el.classList.add(powerupType)
      
      setTimeout(() => {
        el.classList.remove(powerupType)
      }, 400)
    }
    
    // Watchers
    watch(powerupType, (newPowerupType: PowerupTypes) => {
      setClasses(newPowerupType)
    })

    return {
      glowRef,
      cssStyle
    }
  }
})
</script>

<style scoped>
.ui-powerup-glow {
  @apply absolute left-0 w-full pointer-events-none opacity-10;
  transition: box-shadow .2s ease-in-out;
  height: calc(100% - var(--offset));
}

.ui-powerup-glow.fire {
  box-shadow: inset 0 0 60px var(--c-warning);
}

.ui-powerup-glow.ice {
  box-shadow: inset 0 0 60px var(--c-primary);
}

.ui-powerup-glow.wind {
  box-shadow: inset 0 0 60px var(--c-info);
}

.ui-powerup-glow.life {
  box-shadow: inset 0 0 60px var(--c-success);
}
</style>