<template>
  <ui-game-overlay-content 
    heading="Out of Lifes!"
  > 
    <template #footerLeft>
      <cbutton
        icon-only
        @click="handleGameCancelation"
      >
        <cicon
          name="home"
          size="lg"
        />
      </cbutton>
    </template>
    
    <template #footerCenter>
      <cbutton
        @click="handleGameRetry"
      >
        Retry
      </cbutton>
    </template>
  </ui-game-overlay-content>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'
import UiGameOverlayContent from './UiGameOverlayContent.vue'

export default defineComponent({
  name: 'UiGameOverlayRoundLost',
  components: {
    UiGameOverlayContent
  },
  setup() {
    // Injects
    const store = useStore()

    // Methods
    const hideOverlay = () => {
      store.dispatch('gameUI/setOverlayFadeOut')
    }
    
    const showOverlay = () => {
      store.dispatch('gameUI/setOverlayFadeIn')
    }

    // Events
    const handleGameCancelation = () => {
      store.dispatch('game/setGameReset')
      hideOverlay()
    }
    
    const handleGameRetry = () => {
      alert('not coded yet')
    }

    // Hooks
    onMounted(() => {
      showOverlay()
    })

    return {
      handleGameCancelation,
      handleGameRetry
    }
  }
})
</script>