<template>
  <div
    class="ui-game-footer-powerups"
  >
    <cbutton
      v-for="powerupButton in powerupButtons"
      :key="powerupButton.id"
      :disabled="isActive"
      :has-background="false"
      :class="hasPowerups(powerupButton.count)"
      class="ui-game-footer-powerups__powerup"
      icon-only
      @click="activatePowerup(powerupButton.id)"
    >
      <cicon
        :name="powerupButton.asset"
        :class="isActivePowerup(powerupButton.id) ? 'anim-highligh' : ''"
        size="3xl"
        type="fill"
      />

      <cbadge
        :value="powerupButton.count"
        class="ui-game-footer-powerups__badge"
      />

      <div
        v-if="!isMobile()"
        class="ui-footer__powerup-key"
      >
        {{ powerupButton.keyboardKey }}
      </div>
    </cbutton>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import type { PowerupTypes } from '@project/interfaces'
import { isMobile } from '../../utils/game.utils'
import { useStore } from 'vuex'

interface PowerupButton {
  id: string;
  asset: string;
  count: number;
  keyboardKey: string;
}

export default defineComponent({
  name: 'UiGameBottomPowerups',
  setup () {
    // Injects
    const store = useStore()

    const keyboardKeys = ['1', '2', '3']

    // Computed
    const isPlaying = computed(() => store.getters['game/matchIsPlaying'])
    const activePowerupType = computed(() => store.getters['game/roundActivePowerupType'])
    const isActive = computed(() => !!activePowerupType.value)
    const powerupButtons = computed(() => {
      const output: PowerupButton[] = []
      const powerups = store.getters['game/powerups']
      const powerupsCounters = store.getters['game/matchPowerups']

      let count: number = 0
      for (const [key, value] of Object.entries(powerupsCounters)) {
        if (key !== powerups.life.id) {
          output.push({
            id: key,
            asset: `powerup-${key}`,
            count: value as number,
            keyboardKey: keyboardKeys[count]
          })

          count++
        }
      }

      return output
    })
    
    // Methods
    const isActivePowerup = (id: PowerupTypes) => {
      return isActive.value && id === activePowerupType.value
    }

    const hasPowerups = (count: number) => {
      return count > 0 
        ? 'opacity-100'
        : 'opacity-50'
    }
    
    const activatePowerup = (id: string) => {
      if (!isActive.value && isPlaying.value) {
        store.dispatch('game/activatePoweup', id)
      }
    }

    // Event Handlers
    const handleKeydown = (event: KeyboardEvent) => {
      for (const powerup of powerupButtons.value) {
        if (event.key === powerup.keyboardKey) {
          activatePowerup(powerup.id)
        }
      }
    }

    // Hooks
    onMounted(() => {
      if (!isMobile()) {
        window.addEventListener('keydown', handleKeydown)
      }
    })

    onBeforeUnmount(() => {
      if (!isMobile()) {
        window.removeEventListener('keydown', handleKeydown)
      }
    })
    
    return {
      isActive,
      isMobile,
      isActivePowerup,
      activatePowerup,
      hasPowerups,
      powerupButtons
    }
  }
})
</script>

<style scoped>
@keyframes highlight {
  0%,
  28%,
  70% {
    transform: scale(1);
  }

  14%,
  42% {
    transform: scale(1.3);
  }
}

.ui-game-footer-powerups {
  @apply block; 
}

.ui-game-footer-powerups__powerup {
  @apply relative -mt-24 transition-opacity;
}

.ui-game-footer-powerups__badge {
  @apply absolute z-0 bottom-8 right-8;
}

.ui-footer__powerup-key {
  @apply absolute bottom-3 left-1.5 w-16 h-16 bg-secondary border border-quinary rounded-4 flex items-center justify-center;
  font-size: 8px;
  line-height: normal;
}

.anim-highligh {
  animation: highlight .5s ease-in-out both;
}
</style>