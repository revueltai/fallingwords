<template>
  <div
    ref="footer"
    class="fixed flex justify-between w-full bottom-0"
  >
    <div class="bg-tertiary border-t border-r border-quinary rounded-tr-24">
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

    <div class="bg-tertiary border-t border-l border-r border-quinary rounded-tl-24 rounded-tr-24 px-16">
      <cbutton
        v-for="powerup in powerups"
        :disabled="isActive"
        :has-background="false"
        icon-only
        class="block relative -mt-24"
        @click="handleClick(powerup.id)"
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
      </cbutton>
    </div>

    <div class="bg-tertiary border-t border-l border-quinary rounded-tl-24">
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
import { ref, computed, onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'UiGameBottom',
  setup () {
    // Injects
    const store = useStore()

    // Refs
    const footer = ref(null)

    // Computed
    const isActive = computed(() => !!store.getters['game/roundActivePowerupType'])

    const powerups = computed(() => {
      const output = []
      const powerupsCounters = store.getters['game/matchPowerups']

      for (const [key, value] of Object.entries(powerupsCounters)) {
        if (key !== 'life') {
          output.push({
            id: key,
            name: `powerup-${key}`,
            count: value
          })
        }
      }

      return output
    })

    // Methods

    // Event Handlers
    const handleClick = (id: string) => {
      store.dispatch('game/activatePoweup', id)
    }

    // Hooks
    onMounted(() => {
      store.dispatch('game/setUIElementHeight', {
        footer: footer.value.getBoundingClientRect().height
      })
    })

    return {
      footer,
      powerups,
      isActive,
      handleClick
    }
  }
})
</script>
