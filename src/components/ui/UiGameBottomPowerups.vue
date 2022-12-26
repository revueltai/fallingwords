<template>
  <cbutton
    v-for="powerupButton in powerupButtons"
    :key="powerupButton.id"
    :disabled="isActive"
    :has-background="false"
    icon-only
    class="block relative -mt-24 animate-fade-in"
    @click="activatePowerup(powerupButton.id)"
  >
    <cicon
      :name="powerupButton.asset"
      size="xxxLarge"
      type="fill"
    />

    <cbadge
      :value="powerupButton.count"
      class="absolute z-2 bottom-8 right-8"
    />

    <div
      v-if="!isMobile()"
      class="ui-footer__powerup-key"
    >
      {{ powerupButton.keyboardKey }}
    </div>
  </cbutton>
</template>

<script lang="ts">
import { computed, onMounted, onBeforeUnmount, defineComponent } from 'vue'
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
    const isActive = computed(() => !!store.getters['game/roundActivePowerupType'])
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
      activatePowerup,
      powerupButtons
    }
  }
})
</script>

<style scoped>
.ui-footer__powerup-key {
  @apply absolute bottom-3 left-1.5 w-16 h-16 bg-secondary border border-quinary rounded-4 flex items-center justify-center;
  font-size: 8px;
  line-height: normal;
}
</style>