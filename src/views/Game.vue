<template>
  <section class="ui-game">
    <ui-game-board />
    <ui-game-top />
    <ui-game-bottom />
    <ui-game-powerup-bar />
    <ui-game-overlay />
  </section>
</template>

<script lang="ts">
import { onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { DUMMIE_DATA, UI } from '../configs/constants'

import UiGameTop from '../components/ui/UiGameTop.vue'
import UiGameBottom from '../components/ui/UiGameBottom.vue'
import UiGameBoard from '../components/ui/UiGameBoard.vue'
import UiGamePowerupBar from '../components/ui/UiGamePowerupBar.vue'
import UiGameOverlay from '../components/ui/UiGameOverlay.vue'

export default defineComponent({
  name: 'Game',
  components: {
    UiGameTop,
    UiGameBottom,
    UiGameBoard,
    UiGamePowerupBar,
    UiGameOverlay
  },
  setup() {

    // Injects
    const store = useStore()

    // Hooks
    onMounted(() => {
      store.dispatch('gameUI/setOverlayComponent', UI.overlayComponents.countdown)
      store.dispatch('game/preparemMatch', {
        words: DUMMIE_DATA.words,
        locales: DUMMIE_DATA.locales
      })
    })
  }
})
</script>

<style scoped>
.ui-game {
  @apply w-full h-full;
}
</style>