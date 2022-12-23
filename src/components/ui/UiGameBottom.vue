<template>
  <div
    ref="footer"
    class="ui-footer"
  >
    <div class="ui-footer__left">
      <cbutton
        :has-background="false"
        icon-only
      >
        <cicon
          size="large"
          type="fill"
          name="info"
        />
      </cbutton>
    </div>

    <div class="ui-footer__center">
      <cbutton
        v-for="powerup in powerups"
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
    </div>

    <div class="ui-footer__right">
      <cbutton
        :has-background="false"
        icon-only
      >
        <cicon
          size="large"
          name="skip"
        />
      </cbutton>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { isMobile } from '../../utils/game.utils'

interface PowerupButton {
  id: string;
  name: string;
  count: number;
  keyboardKey: string;
}

export default defineComponent({
  name: 'UiGameBottom',
  setup () {
    // Injects
    const store = useStore()

    // Refs
    const footer = ref(null)
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
      store.dispatch('game/activatePoweup', id)
    }

    // Event Handlers
    const handleKeydown = (event: KeyboardEvent) => {
      for (const powerup of powerups.value) {
        if (event.key === powerup.keyboardKey) {
          activatePowerup(powerup.id);
        }
      }
    }

    // Hooks
    onMounted(() => {
      if (!isMobile()) {
        window.addEventListener('keydown', handleKeydown)
      }

      store.dispatch('game/setUIElementHeight', {
        footer: footer.value.getBoundingClientRect().height
      })
    })

    onBeforeUnmount(() => {
      if (!isMobile()) {
        window.removeEventListener('keydown', handleKeydown)
      }
    })

    return {
      footer,
      powerups,
      isMobile,
      isActive,
      activatePowerup
    }
  }
})
</script>

<style scoped>
.ui-footer {
  @apply fixed flex justify-between w-full bottom-0;
}

.ui-footer__left,
.ui-footer__right,
.ui-footer__center {
  @apply bg-tertiary border-t border-quinary;
}

.ui-footer__left {
  @apply border-r rounded-tr-24;
}

.ui-footer__center {
  @apply border-l border-r rounded-tl-24 rounded-tr-24 px-16;
}

.ui-footer__right {
  @apply border-l rounded-tl-24;
}
.ui-footer__powerup-key {
  @apply absolute bottom-3 left-1.5 w-16 h-16 bg-secondary border border-quinary rounded-4 flex items-center justify-center;
  font-size: 8px;
  line-height: normal;
}
</style>
