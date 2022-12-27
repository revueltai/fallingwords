<template>
  <div
    v-if="isActive"
    class="ui-powerup-bar"
  >
    <div
      :class="cssClass"
      class="ui-powerup-bar__icon"
    >
      <cicon
        :name="powerupAsset"
        size="medium"
        type="fill"
      />
    </div>

    <div class="ui-powerup-bar__bar">
      <div
        ref="bar"
        :class="cssClass"
        :style="cssStyle"
        class="ui-powerup-bar__bar-timer"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'UiGamePowerupBar',
  setup () {
    
    // Injects
    const store = useStore()

    // Refs
    const barAnimation = 'a__powerup-cooldown'
    const bar = ref(null)

    // Computed
    const powerups = computed(() => store.getters['game/powerups'])
    const isActive = computed(() => store.getters['game/roundHasActivePowerup'])
    const powerupType = computed(() => store.getters['game/roundActivePowerupType'])
    const duration = computed(() => store.getters['game/matchPowerupsDuration'])
    const powerupAsset = computed(() => powerups.value[powerupType.value].asset)
    const cssClass = computed(() => {
      const { fire, ice, wind } = powerups.value
      let color = null

      switch (powerupType.value) {
        case fire.id:
          color = 'warning'
          break

        case ice.id:
          color = 'primary'
          break

        case wind.id:
          color = 'quinary'
          break
      }

      return `bg-${color}`
    })
    const cssStyle = computed(() => {
      return `animation-duration: ${duration.value}ms;`
    })

    // Methods
    const activatePowerupBar = () => {
      nextTick(() => {
        const barRef: HTMLElement = bar.value
        barRef.classList.add(barAnimation)
        barRef.addEventListener('animationend', handleAnimationEnd)
      })
    }

    const deactivatePowerup = () => {
      store.dispatch('game/deactivatePowerup')
    }

    // Watchers
    watch(isActive, (newVal) => {
      if (newVal) {
        activatePowerupBar()
      }
    })

    // Event Handlers
    const handleAnimationEnd = () => {
      bar.value.classList.remove(barAnimation)
      deactivatePowerup()
    }

    // Hooks
    onBeforeUnmount (() => {
      const barRef: HTMLElement = bar.value
      if (barRef) {
        barRef.removeEventListener('animationend', handleAnimationEnd)
      }    
    })

    return {
      bar,
      isActive,
      powerupAsset,
      duration,
      cssClass,
      cssStyle
    }
  }
})
</script>

<style scoped>
@keyframes powerupCooldown {
  0% {
    width: 100%;
  }

  100% {
    width: 0;
  }
}

.a__powerup-cooldown {
  animation-name: powerupCooldown;
  animation-timing-function: ease-out;
  animation-direction: forwards;
}

.ui-powerup-bar {
  @apply absolute flex items-center top-112 left-12;
}

.ui-powerup-bar__icon {
  @apply z-10 border-quinary flex items-center justify-center rounded-full w-32 h-32;
}

.ui-powerup-bar__bar {
  @apply -ml-2 relative rounded-tr-full rounded-br-full w-48 h-16;
}

.ui-powerup-bar__bar-timer {
  @apply rounded-tr-full rounded-br-full w-full h-full;
}
</style>