<template>
  <ui-game-overlay-content 
    ref="pauseRef"
    heading="Game Paused"
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
        @click="handleGameResume"
      >
        Resume
      </cbutton>
    </template>
    
    <!-- <cbutton
      slot="footerRight"
      icon-only
      @click="hideOverlay"
    >
      <cicon
        name="cross"
        size="lg"
      />
    </cbutton> -->
  </ui-game-overlay-content>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'
import UiGameOverlayContent from './UiGameOverlayContent.vue'

export default defineComponent({
  name: 'UiGameOverlayPause',
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
    
    const handleGameResume = () => {
      store.dispatch('game/setGamePlaying')
      hideOverlay()
    }

    // Hooks
    onMounted(() => {
      showOverlay()
    })

    return {
      handleGameCancelation,
      handleGameResume
    }
  }
})
</script>