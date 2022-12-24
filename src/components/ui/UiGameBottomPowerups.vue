<template>
  <cbutton
    v-for="powerup in powerups"
    :key="powerup.id"
    :disabled="isActive"
    :has-background="false"
    icon-only
    class="block relative -mt-24 animate-fade-in"
    @click="activatePowerup(powerup.id)"
  >
    <cicon
      :name="powerup.name"
      size="xxxLarge"
      type="fill"
    />

    <cbadge
      :value="powerup.count"
      class="absolute z-2 bottom-8 right-8"
    />

    <div
      v-if="!isMobile()"
      class="ui-footer__powerup-key"
    >
      {{ powerup.keyboardKey }}
    </div>
  </cbutton>
</template>

<script lang="ts">
import { computed, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { isMobile } from '../../utils/game.utils'
import { useStore } from 'vuex'

interface PowerupButton {
  id: string;
  name: string;
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
    const isActive = computed(() => !!store.getters['game/roundActivePowerupType'])
    const powerups = computed(() => {
      const output: PowerupButton[] = []
      const powerupsCounters = store.getters['game/matchPowerups']

      let count: number = 0
      for (const [key, value] of Object.entries(powerupsCounters)) {
        if (key !== 'life') {
          output.push({
            id: key,
            name: `powerup-${key}`,
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
      if (!isActive.value) {
        store.dispatch('game/activatePoweup', id)
      }
    } 

    // Event Handlers
    const handleKeydown = (event: KeyboardEvent) => {
      for (const powerup of powerups.value) {
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
      powerups
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